import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Define plan type and subscription plans
type PlanId = 'basic' | 'pro' | 'enterprise';

type Plan = {
  name: string;
  description: string;
  priceId: string;
  features: string[];
};

const SUBSCRIPTION_PLANS: Record<PlanId, Plan> = {
  basic: {
    name: 'Basic Plan',
    description: 'Access to basic features and model downloads',
    priceId: 'price_basic_123', // Replace with actual Stripe price ID
    features: ['Access to basic models', 'Limited downloads', 'Community support']
  },
  pro: {
    name: 'Pro Plan',
    description: 'Access to premium features and unlimited model downloads',
    priceId: 'price_pro_456', // Replace with actual Stripe price ID
    features: ['Access to all models', 'Unlimited downloads', 'Priority support', 'Early access to new models']
  },
  enterprise: {
    name: 'Enterprise Plan',
    description: 'Custom solutions for businesses',
    priceId: 'price_enterprise_789', // Replace with actual Stripe price ID
    features: ['Custom model training', 'Dedicated support', 'API access', 'Custom branding']
  }
};

export async function POST(req: NextRequest) {
  try {
    const { userId, planId, customerId } = await req.json();
    
    // Validate required fields
    if (!userId || !planId) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Validate plan exists
    if (!Object.keys(SUBSCRIPTION_PLANS).includes(planId)) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid plan ID' }),
        { status: 400 }
      );
    }
    
    const plan = SUBSCRIPTION_PLANS[planId as PlanId];
    
    // Create checkout session for subscription
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/account/subscription?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      customer: customerId || undefined, // Use existing customer if available
      metadata: {
        userId,
        planId,
        type: 'subscription',
      },
      subscription_data: {
        metadata: {
          userId,
          planId,
        },
      },
    });
    
    return new NextResponse(
      JSON.stringify({ 
        sessionId: session.id,
        url: session.url 
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error creating subscription:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create subscription' }),
      { status: 500 }
    );
  }
} 