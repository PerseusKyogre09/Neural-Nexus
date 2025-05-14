import { NextRequest, NextResponse } from 'next/server';
import { CDP } from '@coinbase/cdp-sdk';

// Initialize Coinbase CDP SDK with API key and secret
const initCDP = () => {
  const apiKeyId = process.env.NEXT_PUBLIC_COINBASE_APP_KEY_ID;
  const apiSecret = process.env.COINBASE_SECRET;

  if (!apiKeyId || !apiSecret) {
    console.error('Missing Coinbase CDP credentials');
    return null;
  }

  try {
    return new CDP({
      apiKeyId,
      apiSecret,
    });
  } catch (error) {
    console.error('Error initializing Coinbase CDP SDK:', error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  try {
    const cdp = initCDP();
    
    if (!cdp) {
      return NextResponse.json(
        { error: 'Coinbase CDP not properly configured' },
        { status: 500 }
      );
    }

    const requestData = await req.json();
    const { action, params } = requestData;

    switch (action) {
      case 'getBalance':
        const { address, chainId } = params;
        // Get balance from the CDP SDK
        const balance = await cdp.getBalances({
          blockchain: 'ethereum', // You can make this dynamic based on chainId
          walletAddress: address,
        });
        return NextResponse.json({ balance });

      case 'getTransaction':
        const { txHash } = params;
        // Get transaction details
        const txDetails = await cdp.getTransaction({
          blockchain: 'ethereum', // You can make this dynamic
          txHash,
        });
        return NextResponse.json({ transaction: txDetails });
      
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in Coinbase CDP API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 