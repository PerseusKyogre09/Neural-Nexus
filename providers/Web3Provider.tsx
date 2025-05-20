"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Use our wrapper instead of directly importing ethers
import ethers, { getDefaultProvider, Contract, providers } from './EthersWrapper';
import Web3Modal from 'web3modal';
import CoinbaseWalletSDK from '@coinbase/wallet-sdk';
import { configureChains, createConfig, WagmiConfig, Config } from 'wagmi';
import { mainnet, polygon, optimism, arbitrum } from 'wagmi/chains';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

// Define the Web3 context type
interface Web3ContextType {
  isConnected: boolean;
  account: string | null;
  chainId: number | null;
  balance: string | null;
  provider: any | null;
  signer: any | null;
  connectWallet: () => Promise<boolean>;
  disconnectWallet: () => Promise<boolean>;
  isWeb3Enabled: boolean;
  toggleWeb3Features: () => void;
  mintNFT: (tokenURI: string) => Promise<string | null>;
  uploadToIPFS: (file: File) => Promise<string | null>;
  isNFTMintingEnabled: boolean;
  isIPFSStorageEnabled: boolean;
  toggleNFTMinting: () => void;
  toggleIPFSStorage: () => void;
  userBadges: string[];
  cryptoEarnings: number;
  showCryptoEarnings: boolean;
  toggleCryptoEarnings: () => void;
}

// Create the Web3 context
const Web3Context = createContext<Web3ContextType | undefined>(undefined);

// Helper function to ensure chains have required properties
const ensureChainProperties = (chain: any) => {
  if (!chain.rpcUrls) {
    chain.rpcUrls = {};
  }
  if (!chain.rpcUrls.public) {
    chain.rpcUrls.public = {};
  }
  if (!chain.rpcUrls.public.http) {
    chain.rpcUrls.public.http = [
      // Fallback RPC URL
      'https://eth-mainnet.g.alchemy.com/v2/demo'
    ];
  }
  return chain;
};

// Configure chains for wagmi
const { chains, publicClient, webSocketPublicClient } = configureChains(
  // Apply our helper function to ensure chains have required properties
  [ensureChainProperties(mainnet)],
  [publicProvider()]
);

// Create wagmi config with proper error handling for chain URLs
let wagmiConfig: any;
try {
  wagmiConfig = createConfig({
    autoConnect: false,
    connectors: [
      new MetaMaskConnector({ 
        chains,
        options: {
          shimDisconnect: true,
        }
      }),
      new CoinbaseWalletConnector({
        chains,
        options: {
          appName: 'Neural Nexus',
        },
      }),
      new WalletConnectConnector({
        chains,
        options: {
          projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'demo-project-id',
          showQrModal: true,
        },
      }),
      new InjectedConnector({
        chains,
        options: {
          name: 'Injected',
          shimDisconnect: true,
        },
      }),
    ],
    publicClient,
    webSocketPublicClient,
  });
} catch (error) {
  console.error("Failed to create wagmi config:", error);
  // Create a minimal fallback object
  wagmiConfig = {
    _config: { state: {} },
    connectors: [],
    publicClient: { request: async () => null },
    chains: []
  };
}

// Create the Web3 provider component
export function Web3Provider({ children }: { children: ReactNode }) {
  // Browser detection - MUST be first hook
  const [isBrowser, setIsBrowser] = useState(false);
  
  // All state variables declared upfront
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [provider, setProvider] = useState<any | null>(null);
  const [signer, setSigner] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isWeb3Enabled, setIsWeb3Enabled] = useState(false);
  const [isNFTMintingEnabled, setIsNFTMintingEnabled] = useState(false);
  const [isIPFSStorageEnabled, setIsIPFSStorageEnabled] = useState(false);
  const [userBadges, setUserBadges] = useState<string[]>([]);
  const [cryptoEarnings, setCryptoEarnings] = useState<number>(0);
  const [showCryptoEarnings, setShowCryptoEarnings] = useState(false);
  const [web3Modal, setWeb3Modal] = useState<Web3Modal | null>(null);
  
  // Check if we're in browser - must be first effect
  useEffect(() => {
    setIsBrowser(true);
  }, []);
  
  // Initialize Web3Modal on client-side only
  useEffect(() => {
    if (!isBrowser) return;
    
    try {
      const providerOptions = {
        coinbasewallet: {
          package: CoinbaseWalletSDK,
          options: {
            appName: "Neural Nexus",
            infuraId: process.env.NEXT_PUBLIC_INFURA_ID || "demo-infura-id"
          }
        }
      };
      
      const modal = new Web3Modal({
        cacheProvider: true,
        providerOptions,
        theme: "dark"
      });
      
      setWeb3Modal(modal);
      
      // Check if previously connected, but with error handling
      if (modal.cachedProvider) {
        connectWallet().catch(error => {
          console.error("Failed to reconnect cached provider:", error);
        });
      }
    } catch (error) {
      console.error("Failed to initialize Web3Modal:", error);
    }
  }, [isBrowser]);
  
  // Example user badges data - in a real app, fetch from backend
  useEffect(() => {
    if (isConnected && account) {
      // Mock data - would be fetched from backend in real app
      setUserBadges(['Open Source Contributor', 'Beta Tester']);
      setCryptoEarnings(1.25);
    }
  }, [isConnected, account]);
  
  // Connect wallet function
  const connectWallet = async (): Promise<boolean> => {
    if (!web3Modal) return false;
    
    try {
      const instance = await web3Modal.connect();
      const ethProvider = new ethers.BrowserProvider(instance);
      const ethSigner = await ethProvider.getSigner();
      const ethAccount = await ethSigner.getAddress();
      const ethNetwork = await ethProvider.getNetwork();
      const ethChainId = Number(ethNetwork.chainId);
      const ethBalance = ethers.formatEther(await ethProvider.getBalance(ethAccount));
      
      setProvider(ethProvider);
      setSigner(ethSigner);
      setAccount(ethAccount);
      setChainId(ethChainId);
      setBalance(ethBalance);
      setIsConnected(true);
      
      // Setup listeners
      instance.on("accountsChanged", async (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          if (ethProvider) {
            const balance = ethers.formatEther(await ethProvider.getBalance(accounts[0]));
            setBalance(balance);
          }
        } else {
          setAccount(null);
          setBalance(null);
          setIsConnected(false);
        }
      });
      
      instance.on("chainChanged", async () => {
        const newProvider = new ethers.BrowserProvider(instance);
        const network = await newProvider.getNetwork();
        setChainId(Number(network.chainId));
        if (account) {
          const balance = ethers.formatEther(await newProvider.getBalance(account));
          setBalance(balance);
        }
      });
      
      instance.on("disconnect", () => {
        disconnectWallet();
      });
      
      return true;
    } catch (error) {
      console.error("Connection error:", error);
      return false;
    }
  };
  
  // Disconnect wallet function
  const disconnectWallet = async (): Promise<boolean> => {
    if (web3Modal) {
      web3Modal.clearCachedProvider();
    }
    setAccount(null);
    setChainId(null);
    setBalance(null);
    setProvider(null);
    setSigner(null);
    setIsConnected(false);
    return true;
  };
  
  // Toggle Web3 features
  const toggleWeb3Features = () => {
    setIsWeb3Enabled(prev => !prev);
  };
  
  // Toggle NFT minting
  const toggleNFTMinting = () => {
    setIsNFTMintingEnabled(prev => !prev);
  };
  
  // Toggle IPFS storage
  const toggleIPFSStorage = () => {
    setIsIPFSStorageEnabled(prev => !prev);
  };
  
  // Toggle crypto earnings display
  const toggleCryptoEarnings = () => {
    setShowCryptoEarnings(prev => !prev);
  };
  
  // Mint NFT function (simplified - would connect to actual contract in production)
  const mintNFT = async (tokenURI: string): Promise<string | null> => {
    if (!isConnected || !signer) {
      console.error("Wallet not connected");
      return null;
    }
    
    try {
      // This is a placeholder for actual contract interaction
      // In a real implementation, you would:
      // 1. Connect to your NFT contract
      // 2. Call the mint function with tokenURI
      // 3. Return the transaction hash
      console.log(`Minting NFT with URI: ${tokenURI}`);
      return "0xMockTransactionHash";
    } catch (error) {
      console.error("NFT minting error:", error);
      return null;
    }
  };
  
  // Upload to IPFS function (simplified)
  const uploadToIPFS = async (file: File): Promise<string | null> => {
    try {
      // This is a placeholder for actual IPFS upload
      // In a real implementation, you would:
      // 1. Upload the file to IPFS via web3.storage or similar
      // 2. Return the IPFS hash/URI
      console.log(`Uploading file to IPFS: ${file.name}`);
      return "ipfs://MockIPFSHash";
    } catch (error) {
      console.error("IPFS upload error:", error);
      return null;
    }
  };
  
  const contextValue: Web3ContextType = {
    isConnected,
    account,
    chainId,
    balance,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    isWeb3Enabled,
    toggleWeb3Features,
    mintNFT,
    uploadToIPFS,
    isNFTMintingEnabled,
    isIPFSStorageEnabled,
    toggleNFTMinting,
    toggleIPFSStorage,
    userBadges,
    cryptoEarnings,
    showCryptoEarnings,
    toggleCryptoEarnings
  };
  
  // Early return for server-side rendering to maintain hook consistency
  if (!isBrowser) {
    return <>{children}</>;
  }
  
  return (
    <Web3Context.Provider value={contextValue}>
      {wagmiConfig && wagmiConfig._config ? (
        <WagmiConfig config={wagmiConfig}>
          {children}
        </WagmiConfig>
      ) : (
        // Fallback rendering without wagmi if configuration failed
        <>{children}</>
      )}
    </Web3Context.Provider>
  );
}

// Custom hook to use the Web3 context
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};

export default Web3Provider; 