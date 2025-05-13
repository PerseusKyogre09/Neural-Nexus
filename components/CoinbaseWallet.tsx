"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatEther, parseEther } from 'ethers';
import { AnimatedCard } from './ui/animated-card';
import { AnimatedButton } from './ui/animated-button';

// Simulated wallet connection for demo purposes
// In production, this would use the actual Coinbase SDK
export default function CoinbaseWallet({ onPaymentComplete }: { onPaymentComplete?: (success: boolean, hash?: string) => void }) {
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState<string>('');
  const [balance, setBalance] = useState<string>('0.1234');
  const [recipient, setRecipient] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState<any[]>([
    {
      hash: '0x3a4e98b123c7889a1d2e4f67b3b87fb83c4837103adc02ce36c39d14d8a23d29',
      timestamp: Date.now() - 86400000, // 1 day ago
      type: 'receive',
      value: parseEther('0.5')
    },
    {
      hash: '0x7f1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
      timestamp: Date.now() - 172800000, // 2 days ago
      type: 'send',
      value: parseEther('0.2')
    }
  ]);

  const connectWallet = () => {
    // Simulate wallet connection
    setConnected(true);
    setAddress('0x1234567890abcdef1234567890abcdef12345678');
  };

  // Handle crypto payment
  const handleTransfer = async () => {
    if (!connected || !recipient || !amount) return;
    
    setIsTransferring(true);
    
    try {
      // Simulate transaction with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a fake transaction hash
      const txHash = '0x' + Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      
      // Add to transaction history
      setTransactionHistory(prev => [
        {
          hash: txHash,
          timestamp: Date.now(),
          type: 'send',
          value: parseEther(amount)
        },
        ...prev
      ]);
      
      // Update UI and notify payment success
      setAmount('');
      setRecipient('');
      
      if (onPaymentComplete) {
        onPaymentComplete(true, txHash);
      }
    } catch (error) {
      console.error("Error during transfer:", error);
      if (onPaymentComplete) {
        onPaymentComplete(false);
      }
    } finally {
      setIsTransferring(false);
    }
  };

  if (!connected) {
    return (
      <div className="flex flex-col items-center p-8">
        <AnimatedCard variant="gradient" className="p-6 mb-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4 text-center">Connect Your Wallet</h2>
          <p className="text-gray-300 mb-6 text-center">
            Sign in with Coinbase to securely purchase AI models with cryptocurrency
          </p>
          <div className="flex justify-center">
            <AnimatedButton
              variant="primary"
              onClick={connectWallet}
              className="px-8"
            >
              Connect Coinbase Wallet
            </AnimatedButton>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <AnimatedCard variant="glass" className="p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h3 className="text-gray-400 text-sm">Connected Wallet</h3>
            <p className="font-mono text-md">{`${address.substring(0, 6)}...${address.substring(address.length - 4)}`}</p>
          </div>
          <div>
            <h3 className="text-gray-400 text-sm">Balance</h3>
            <p className="font-bold text-xl">{parseFloat(balance).toFixed(4)} ETH</p>
          </div>
          <div className="md:text-right">
            <AnimatedButton 
              variant="outline" 
              size="sm"
              onClick={() => setConnected(false)}
            >
              Disconnect
            </AnimatedButton>
          </div>
        </div>
      </AnimatedCard>
      
      <AnimatedCard variant="default" className="p-6">
        <h3 className="text-xl font-bold mb-4">Send Payment</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Recipient Address</label>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="0x..."
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Amount (ETH)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              step="0.001"
              min="0"
              className="w-full p-3 rounded-lg bg-white/5 border border-white/10 focus:border-pink-500 outline-none text-white"
            />
          </div>
          
          <AnimatedButton
            variant="primary"
            onClick={handleTransfer}
            isLoading={isTransferring}
            disabled={!recipient || !amount || isTransferring}
            className="w-full mt-2"
          >
            Send Payment
          </AnimatedButton>
        </div>
      </AnimatedCard>
      
      {transactionHistory.length > 0 && (
        <AnimatedCard variant="dark" className="p-6">
          <h3 className="text-xl font-bold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactionHistory.map((tx, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 bg-white/5 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    {new Date(tx.timestamp).toLocaleDateString()}
                  </span>
                  <span className={`text-sm ${tx.type === 'send' ? 'text-red-400' : 'text-green-400'}`}>
                    {tx.type === 'send' ? '-' : '+'}{formatEther(tx.value)} ETH
                  </span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-1">
                  TX: {tx.hash}
                </div>
              </motion.div>
            ))}
          </div>
        </AnimatedCard>
      )}
    </div>
  );
} 