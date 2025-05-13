import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Define types for our response data
interface LineItem {
  id: string;
  name: string | undefined;
  amount: number | null;
  quantity: number | null;
}

interface SubscriptionData {
  id: string;
  status: string;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface CheckoutResponseData {
  id: string;
  mode: string | null;
  status: string | null;
  customer_email: string | null | undefined;
  currency: string | undefined;
  amount_total: number | null;
  payment_status: string | null;
  lineItems?: LineItem[];
  subscription?: SubscriptionData;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const sessionId = url.searchParams.get('session_id');
    
    if (!sessionId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing session_id parameter' }),
        { status: 400 }
      );
    }
    
    // Retrieve the session with expanded data
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'customer', 'payment_intent', 'subscription']
    });
    
    // Extract relevant details based on session mode
    const responseData: CheckoutResponseData = {
      id: session.id,
      mode: session.mode,
      status: session.status,
      customer_email: session.customer_details?.email,
      currency: session.currency?.toUpperCase(),
      amount_total: session.amount_total,
      payment_status: session.payment_status,
      lineItems: session.line_items?.data.map(item => ({
        id: item.id,
        name: item.description,
        amount: item.amount_total,
        quantity: item.quantity
      }))
    };
    
    // Add subscription-specific details if applicable
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = typeof session.subscription === 'string'
        ? await stripe.subscriptions.retrieve(session.subscription)
        : session.subscription;
        
      responseData.subscription = {
        id: subscription.id,
        status: subscription.status,
        current_period_end: subscription.current_period_end,
        cancel_at_period_end: subscription.cancel_at_period_end
      };
    }
    
    return new NextResponse(
      JSON.stringify(responseData),
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error retrieving checkout session:', error);
    
    // Return a more specific error if it's a Stripe error
    if (error.type === 'StripeInvalidRequestError') {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid session ID or session expired' }),
        { status: 400 }
      );
    }
    
    return new NextResponse(
      JSON.stringify({ error: 'Failed to retrieve checkout details' }),
      { status: 500 }
    );
  }
} 