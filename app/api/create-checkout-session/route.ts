import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { modelId, userId, modelName, modelDescription, price, imageUrl } = await req.json();
    
    // Validate required fields
    if (!modelId || !userId || !price) {
      return new NextResponse(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 }
      );
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: modelName || 'AI Model',
              description: modelDescription || 'AI Model purchase',
              images: imageUrl ? [imageUrl] : [],
            },
            unit_amount: Math.round(price * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/models/${modelId}`,
      metadata: {
        modelId,
        userId,
        type: 'model_purchase',
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
    console.error('Error creating checkout session:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to create checkout session' }),
      { status: 500 }
    );
  }
} 