import { TonConnect } from '@tonconnect/sdk';

const connector = new TonConnect({
  manifestUrl: 'https://your-domain.com/tonconnect-manifest.json'
});

export interface TonWalletData {
  address: string;
  network: string;
  publicKey: string;
}

export const connectTonkeeper = async (): Promise<TonWalletData | null> => {
  try {
    // Request wallet connection
    const walletConnectionSource = {
      universalLink: 'https://app.tonkeeper.com/ton-connect',
      bridgeUrl: 'https://bridge.tonapi.io/bridge'
    };

    await connector.connect(walletConnectionSource);

    // Get wallet info once connected
    const walletInfo = connector.account;
    
    if (!walletInfo) {
      throw new Error('Failed to get wallet info');
    }

    return {
      address: walletInfo.address,
      network: walletInfo.chain,
      publicKey: walletInfo.publicKey || ''
    };
  } catch (error) {
    console.error('Tonkeeper connection error:', error);
    return null;
  }
};

export const disconnectTonkeeper = async (): Promise<void> => {
  try {
    await connector.disconnect();
  } catch (error) {
    console.error('Tonkeeper disconnection error:', error);
  }
};
