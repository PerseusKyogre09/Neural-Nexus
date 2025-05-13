"use client";

import { useState, useEffect } from 'react';
import { useWeb3 } from '@/providers/Web3Provider';
import { AnimatedButton } from './ui/animated-button';
import { AnimatedCard } from './ui/animated-card';
import { Wallet, AlertCircle, CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTonConnect } from '@/providers/TonConnectProvider';

// Check if code is running on the client side
const isBrowser = typeof window !== 'undefined';

export default function WalletConnect() {
  const { 
    isConnected, 
    account, 
    balance, 
    chainId, 
    connectWallet, 
    disconnectWallet,
    userBadges 
  } = useWeb3();
  
  const { isInitialized, connector } = useTonConnect();
  const [tonConnected, setTonConnected] = useState(false);
  const [tonAddress, setTonAddress] = useState<string | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [showWalletInfo, setShowWalletInfo] = useState(false);
  
  // Format wallet address for display
  const formatAddress = (address: string | null) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Format chain based on chainId
  const getChainName = (chainId: number | null) => {
    if (!chainId) return 'Unknown Network';
    const chains: Record<number, string> = {
      1: 'Ethereum Mainnet',
      137: 'Polygon',
      10: 'Optimism',
      42161: 'Arbitrum',
      56: 'BSC',
      43114: 'Avalanche'
    };
    return chains[chainId] || `Chain ID: ${chainId}`;
  };
  
  // Copy wallet address to clipboard
  const copyToClipboard = () => {
    if (account) {
      navigator.clipboard.writeText(account);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  // TON wallet connect function
  const connectTonWallet = async () => {
    if (!isBrowser || !isInitialized || !connector) return;
    
    try {
      // Use connector from context
      const connectionData = await connector.connect();
      
      if (connectionData) {
        console.log("TON wallet connection initiated");
      }
    } catch (error) {
      console.error("Error connecting TON wallet:", error);
    }
  };
  
  // Check for existing TON connection
  useEffect(() => {
    if (isBrowser && isInitialized && connector) {
      try {
        if (connector.connected) {
          const wallet = connector.wallet;
          if (wallet && wallet.account) {
            setTonConnected(true);
            setTonAddress(wallet.account.address);
          }
        }
        
        // Set up connection status listener
        const unsubscribe = connector.onStatusChange((wallet: any) => {
          if (wallet) {
            setTonConnected(true);
            setTonAddress(wallet.account.address);
          } else {
            setTonConnected(false);
            setTonAddress(null);
          }
        });
        
        return () => {
          if (typeof unsubscribe === 'function') unsubscribe();
        };
      } catch (error) {
        console.error("Error checking TON connection:", error);
      }
    }
  }, [isInitialized, connector]);
  
  // Reset wallet info panel when disconnected
  useEffect(() => {
    if (!isConnected) {
      setShowWalletInfo(false);
    }
  }, [isConnected]);
  
  // Skip rendering during SSR
  if (!isBrowser) {
    return null;
  }
  
  return (
    <div className="relative">
      {!isConnected && !tonConnected ? (
        <div className="flex flex-col space-y-2">
          <AnimatedButton
            variant="outline"
            size="sm"
            onClick={connectWallet}
            className="border-purple-500/40 hover:border-purple-500"
          >
            <span className="flex items-center">
              <Wallet className="w-4 h-4 mr-2" />
              Connect Ethereum Wallet
            </span>
          </AnimatedButton>
          
          {isInitialized && connector && process.env.NEXT_PUBLIC_ENABLE_TONCONNECT === 'true' && (
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={connectTonWallet}
              className="border-blue-500/40 hover:border-blue-500"
            >
              <span className="flex items-center">
                <Wallet className="w-4 h-4 mr-2" />
                Connect TON Wallet
              </span>
            </AnimatedButton>
          )}
        </div>
      ) : (
        <div className="flex items-center">
          {/* Connected Wallet Button - Show Ethereum wallet if connected */}
          {isConnected && (
            <AnimatedButton
              variant="outline"
              size="sm"
              onClick={() => setShowWalletInfo(!showWalletInfo)}
              className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/40"
            >
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                {formatAddress(account)}
              </span>
            </AnimatedButton>
          )}
          
          {/* Show TON wallet if connected */}
          {tonConnected && (
            <AnimatedButton
              variant="outline"
              size="sm"
              className="ml-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-blue-500/40"
            >
              <span className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-blue-500 mr-2 animate-pulse"></div>
                {formatAddress(tonAddress)}
              </span>
            </AnimatedButton>
          )}
          
          {/* Expanded Wallet Info Panel */}
          {showWalletInfo && isConnected && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full right-0 mt-2 z-50"
            >
              <AnimatedCard className="w-72 p-4 shadow-xl border border-purple-500/20">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium text-sm">Wallet Connected</h3>
                    <div className="flex items-center text-xs text-green-400">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Network</span>
                      <span className="text-xs font-medium">
                        {getChainName(chainId)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Balance</span>
                      <span className="text-xs font-medium">
                        {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0 ETH'}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">Address</span>
                      <div className="flex items-center">
                        <span className="text-xs font-medium mr-1">{formatAddress(account)}</span>
                        <button 
                          onClick={copyToClipboard}
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          {copied ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Web3 Badges Section */}
                  {userBadges && userBadges.length > 0 && (
                    <div className="pt-2 border-t border-gray-800">
                      <h4 className="text-xs text-gray-400 mb-2">Your Badges</h4>
                      <div className="flex flex-wrap gap-2">
                        {userBadges.map((badge, index) => (
                          <div 
                            key={index}
                            className="px-2 py-1 bg-purple-900/30 rounded-full text-[10px] font-medium border border-purple-500/20"
                          >
                            {badge}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-2">
                    <a 
                      href={`https://etherscan.io/address/${account}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 flex items-center"
                    >
                      View on Explorer <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    
                    <button 
                      onClick={() => disconnectWallet()}
                      className="text-xs text-red-400 hover:text-red-300"
                    >
                      Disconnect
                    </button>
                  </div>
                </div>
              </AnimatedCard>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
} 