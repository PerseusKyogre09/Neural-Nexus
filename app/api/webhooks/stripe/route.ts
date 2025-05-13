import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '@/lib/firebase';
import { doc, setDoc, updateDoc, getDoc, collection, serverTimestamp } from 'firebase/firestore';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', // Use the supported version
});

// Define webhook signing secrets for both payload styles
const SNAPSHOT_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_UJNTsEOy6mJJCFScwJwO9AC7trkMJ0aR';
const THIN_WEBHOOK_SECRET = process.env.STRIPE_THIN_WEBHOOK_SECRET || 'whsec_OeN75T1qFCuSouRRWtTu4fN5xHe3PZT5';

// Helper to read request body as buffer
async function readBodyAsBuffer(req: NextRequest) {
  const chunks = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.from([]);
  
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  
  return Buffer.concat(chunks);
}

export async function POST(req: NextRequest) {
  try {
    // Get the raw body
    const rawBody = await readBodyAsBuffer(req);
    
    // Get the Stripe signature from headers
    const signature = req.headers.get('stripe-signature');
    
    if (!signature) {
      return new NextResponse('Missing stripe-signature header', { status: 400 });
    }
    
    let event: Stripe.Event;
    let isSnapshotPayload = true;
    
    // Try to verify using the snapshot webhook secret first
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        SNAPSHOT_WEBHOOK_SECRET
      );
    } catch (snapshotErr) {
      // If verification with the snapshot secret fails, try the thin secret
      try {
        event = stripe.webhooks.constructEvent(
          rawBody,
          signature,
          THIN_WEBHOOK_SECRET
        );
        isSnapshotPayload = false;
      } catch (thinErr) {
        console.error('⚠️ Webhook signature verification failed:', thinErr);
        return new NextResponse('Webhook signature verification failed', { status: 400 });
      }
    }
    
    console.log(`✅ Received ${isSnapshotPayload ? 'snapshot' : 'thin'} event:`, event.type);

    // Handle the event based on its type
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handleSuccessfulPayment(event, isSnapshotPayload);
        break;
        
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event, isSnapshotPayload);
        break;
        
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event, isSnapshotPayload);
        break;
        
      case 'invoice.paid':
        await handleInvoicePaid(event, isSnapshotPayload);
        break;
      
      // Add other event types as needed
        
      default:
        console.log(`🤔 Unhandled event type: ${event.type}`);
    }
    
    return new NextResponse(JSON.stringify({ received: true }), { status: 200 });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new NextResponse('Webhook error', { status: 500 });
  }
}

// Helper function to expand Stripe objects for thin payloads
async function expandStripeObject(type: string, id: string): Promise<any> {
  switch (type) {
    case 'payment_intent':
      return await stripe.paymentIntents.retrieve(id);
    case 'checkout.session':
      return await stripe.checkout.sessions.retrieve(id, {
        expand: ['line_items', 'customer', 'payment_intent']
      });
    case 'subscription':
      return await stripe.subscriptions.retrieve(id, {
        expand: ['customer', 'latest_invoice', 'items.data.price.product']
      });
    case 'invoice':
      return await stripe.invoices.retrieve(id, {
        expand: ['customer', 'subscription', 'payment_intent']
      });
    default:
      throw new Error(`Unsupported Stripe object type: ${type}`);
  }
}

// Handler for successful payments
async function handleSuccessfulPayment(event: Stripe.Event, isSnapshotPayload: boolean) {
  let paymentIntent;
  
  if (isSnapshotPayload) {
    // For snapshot payload, the object is already expanded
    paymentIntent = event.data.object as Stripe.PaymentIntent;
  } else {
    // For thin payload, we need to fetch the complete object
    const paymentIntentId = (event.data.object as { id: string }).id;
    paymentIntent = await expandStripeObject('payment_intent', paymentIntentId);
  }
  
  // Process payment data
  const customerId = paymentIntent.customer as string;
  const amount = paymentIntent.amount;
  const currency = paymentIntent.currency;
  const metadata = paymentIntent.metadata;
  
  // Store payment in Firestore
  const paymentRef = doc(collection(db, 'payments'), paymentIntent.id);
  await setDoc(paymentRef, {
    id: paymentIntent.id,
    customerId,
    amount,
    currency,
    metadata,
    status: paymentIntent.status,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
  
  // If payment includes a model purchase, associate it with the user
  if (metadata?.modelId) {
    await handleModelPurchase(customerId, metadata.modelId, metadata.userId);
  }
  
  console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
}

// Handler for checkout session completion
async function handleCheckoutCompleted(event: Stripe.Event, isSnapshotPayload: boolean) {
  let session;
  
  if (isSnapshotPayload) {
    // For snapshot payload, the object is already expanded
    session = event.data.object as Stripe.Checkout.Session;
  } else {
    // For thin payload, we need to fetch the complete object
    const sessionId = (event.data.object as { id: string }).id;
    session = await expandStripeObject('checkout.session', sessionId);
  }
  
  // Extract session data
  const customerId = session.customer as string;
  const metadata = session.metadata;
  
  // Store checkout data in Firestore
  const checkoutRef = doc(collection(db, 'checkouts'), session.id);
  await setDoc(checkoutRef, {
    id: session.id,
    customerId,
    amount_total: session.amount_total,
    currency: session.currency,
    payment_status: session.payment_status,
    metadata,
    createdAt: serverTimestamp(),
    completedAt: serverTimestamp(),
  });
  
  // Handle different checkout modes
  if (session.mode === 'subscription') {
    // Subscription purchase flow
    const subscriptionId = session.subscription as string;
    if (subscriptionId) {
      // Update user's subscription status
      await updateUserSubscription(metadata?.userId, subscriptionId);
    }
  } else if (session.mode === 'payment') {
    // One-time purchase flow
    const paymentIntentId = session.payment_intent as string;
    if (paymentIntentId && metadata?.modelId) {
      // Handle model purchase
      await handleModelPurchase(customerId, metadata.modelId, metadata.userId);
    }
  }
  
  console.log(`🛒 Checkout completed: ${session.id}`);
}

// Handler for subscription updates
async function handleSubscriptionUpdate(event: Stripe.Event, isSnapshotPayload: boolean) {
  let subscription;
  
  if (isSnapshotPayload) {
    // For snapshot payload, the object is already expanded
    subscription = event.data.object as Stripe.Subscription;
  } else {
    // For thin payload, we need to fetch the complete object
    const subscriptionId = (event.data.object as { id: string }).id;
    subscription = await expandStripeObject('subscription', subscriptionId);
  }
  
  // Extract subscription data
  const customerId = subscription.customer as string;
  const status = subscription.status;
  const currentPeriodEnd = subscription.current_period_end;
  const items = subscription.items.data;
  
  // Get plan details from the first item's price product
  let planDetails = {};
  if (items.length > 0 && items[0].price.product) {
    const product = items[0].price.product;
    if (typeof product !== 'string') {
      planDetails = {
        planId: items[0].price.id,
        planName: product.name,
        planDescription: product.description,
      };
    }
  }
  
  // Find user by Stripe customer ID
  const usersRef = collection(db, 'users');
  const userSnapshot = await getDoc(doc(usersRef, `stripe_${customerId}`));
  
  if (userSnapshot.exists()) {
    const userData = userSnapshot.data();
    const userId = userData.userId;
    
    // Update user's subscription in their record
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      subscription: {
        id: subscription.id,
        status,
        currentPeriodEnd: new Date(currentPeriodEnd * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        ...planDetails,
        updatedAt: serverTimestamp(),
      }
    });
    
    console.log(`🔄 Updated subscription for user ${userId}: ${status}`);
  } else {
    console.log(`⚠️ No user found for Stripe customer: ${customerId}`);
  }
}

// Handler for paid invoices
async function handleInvoicePaid(event: Stripe.Event, isSnapshotPayload: boolean) {
  let invoice;
  
  if (isSnapshotPayload) {
    // For snapshot payload, the object is already expanded
    invoice = event.data.object as Stripe.Invoice;
  } else {
    // For thin payload, we need to fetch the complete object
    const invoiceId = (event.data.object as { id: string }).id;
    invoice = await expandStripeObject('invoice', invoiceId);
  }
  
  // Extract invoice data
  const customerId = invoice.customer as string;
  const subscriptionId = invoice.subscription as string | null;
  
  // Store invoice in Firestore
  const invoiceRef = doc(collection(db, 'invoices'), invoice.id);
  await setDoc(invoiceRef, {
    id: invoice.id,
    customerId,
    subscriptionId,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: invoice.status,
    hostedInvoiceUrl: invoice.hosted_invoice_url,
    paidAt: invoice.status === 'paid' ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
  });
  
  console.log(`📝 Invoice paid: ${invoice.id}`);
}

// Helper to handle model purchase
async function handleModelPurchase(
  customerId: string, 
  modelId: string, 
  userId: string
) {
  try {
    // Verify the model exists
    const modelRef = doc(db, 'models', modelId);
    const modelSnapshot = await getDoc(modelRef);
    
    if (!modelSnapshot.exists()) {
      console.error(`Model not found: ${modelId}`);
      return;
    }
    
    // Add model to user's purchased models
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      purchasedModels: Array.from(new Set([
        ...(await getDoc(userRef)).data()?.purchasedModels || [],
        modelId
      ])),
      updatedAt: serverTimestamp(),
    });
    
    // Create purchase record
    const purchaseRef = doc(collection(db, 'purchases'), `${userId}_${modelId}`);
    await setDoc(purchaseRef, {
      userId,
      modelId,
      customerId,
      purchasedAt: serverTimestamp(),
    });
    
    console.log(`✅ Model purchase recorded: User ${userId} purchased model ${modelId}`);
  } catch (error) {
    console.error('Error handling model purchase:', error);
  }
}

// Helper to update user subscription
async function updateUserSubscription(userId: string, subscriptionId: string) {
  if (!userId) {
    console.error('Missing userId in subscription metadata');
    return;
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      'subscription.id': subscriptionId,
      'subscription.updatedAt': serverTimestamp(),
    });
    
    console.log(`✅ User ${userId} subscription updated: ${subscriptionId}`);
  } catch (error) {
    console.error('Error updating user subscription:', error);
  }
} 