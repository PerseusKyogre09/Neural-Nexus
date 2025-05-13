"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    icon: '₿',
    description: 'Pay with BTC, ETH, or other major cryptocurrencies'
  },
  {
    id: 'upi',
    name: 'UPI',
    icon: '🇮🇳',
    description: 'Instant payment using UPI apps like GPay, PhonePe'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    icon: '💳',
    description: 'Safe and secure payment via PayPal'
  },
  {
    id: 'bank',
    name: 'Net Banking',
    icon: '🏦',
    description: 'Direct bank transfer via NEFT/RTGS'
  }
];

export default function PaymentOptions({ amount, onPaymentComplete }: { amount: number; onPaymentComplete: () => void }) {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    setLoading(true);
    // Implement actual payment logic here based on selectedMethod
    try {
      // Simulated payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      onPaymentComplete();
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white/5 backdrop-blur-lg rounded-xl">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Payment Method</h2>
      
      <div className="space-y-4 mb-6">
        {paymentMethods.map((method) => (
          <motion.div
            key={method.id}
            whileHover={{ scale: 1.02 }}
            onClick={() => setSelectedMethod(method.id)}
            className={`p-4 rounded-lg cursor-pointer transition-colors ${
              selectedMethod === method.id
                ? 'bg-pink-500/20 border-2 border-pink-500'
                : 'bg-white/5 border-2 border-transparent'
            }`}
          >
            <div className="flex items-center">
              <div className="text-2xl mr-3">{method.icon}</div>
              <div>
                <h3 className="font-semibold">{method.name}</h3>
                <p className="text-sm text-gray-400">{method.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-white/10 pt-4">
        <div className="flex justify-between mb-4">
          <span className="text-gray-400">Amount:</span>
          <span className="font-bold">${amount.toFixed(2)}</span>
        </div>

        <Button
          onClick={handlePayment}
          disabled={!selectedMethod || loading}
          className="w-full bg-pink-500 hover:bg-pink-600 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center">
              <span className="animate-spin mr-2">⚡</span>
              Processing...
            </div>
          ) : (
            'Complete Payment'
          )}
        </Button>
      </div>
    </div>
  );
} 