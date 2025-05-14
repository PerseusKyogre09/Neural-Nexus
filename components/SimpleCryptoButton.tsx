"use client";

import React, { useState } from 'react';
import { useSimpleCrypto } from '@/providers/SimpleCryptoProvider';
import { Wallet, CheckCircle, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface SimpleCryptoButtonProps {
  className?: string;
}

export default function SimpleCryptoButton({ className = '' }: SimpleCryptoButtonProps) {
  const { 
    isInitialized, 
    supportedWallets, 
    connectWallet, 
    disconnectWallet, 
    activeWallet, 
    isConnecting 
  } = useSimpleCrypto();
  
  const [showWalletList, setShowWalletList] = useState(false);
  
  // Safe rendering check for SSR
  if (!isInitialized) {
    return null;
  }
  
  return (
    <div className={`relative ${className}`}>
      {!activeWallet ? (
        <div>
          <button
            onClick={() => setShowWalletList(!showWalletList)}
            disabled={isConnecting}
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-medium text-white flex items-center hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {isConnecting ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
                <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${showWalletList ? 'rotate-180' : ''}`} />
              </>
            )}
          </button>
          
          {showWalletList && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute mt-2 bg-gray-900 border border-gray-800 rounded-lg shadow-xl w-48 z-10"
            >
              <ul className="py-2">
                {supportedWallets.map((wallet) => (
                  <li key={wallet} className="px-3">
                    <button
                      onClick={() => {
                        connectWallet(wallet);
                        setShowWalletList(false);
                      }}
                      className="w-full text-left py-2 px-3 hover:bg-gray-800 rounded-md flex items-center"
                    >
                      <Wallet className="w-4 h-4 mr-2 text-blue-400" />
                      {wallet}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button 
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg font-medium text-white flex items-center"
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            {activeWallet}
          </button>
          
          <button
            onClick={disconnectWallet}
            className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
            title="Disconnect wallet"
          >
            <Wallet className="w-4 h-4 text-gray-300" />
          </button>
        </div>
      )}
    </div>
  );
} 