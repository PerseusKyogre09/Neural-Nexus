import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { useAppContext } from '@/providers/AppProvider';
import { toast } from 'react-hot-toast';

interface SubscriptionButtonProps {
  planId: 'basic' | 'pro' | 'enterprise';
  planName: string;
  price: number;
  period: 'month' | 'year';
  isPopular?: boolean;
  features?: string[];
  className?: string;
}

const SubscriptionButton: React.FC<SubscriptionButtonProps> = ({
  planId,
  planName,
  price,
  period,
  isPopular = false,
  features = [],
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, appUser } = useAppContext();
  
  const handleSubscribe = async () => {
    // Check if user is logged in
    if (!user || !appUser) {
      toast.error('Please sign in to purchase a subscription');
      router.push('/signin?redirect=' + encodeURIComponent('/pricing'));
      return;
    }
    
    setLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: appUser.id,
          planId,
          customerId: appUser.stripeCustomerId, // If user already has a Stripe customer ID
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription checkout');
      }
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Error processing your subscription. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Format price
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
  
  return (
    <div className={`rounded-xl overflow-hidden ${isPopular ? 'border-2 border-cyan-500' : 'border border-gray-700'} ${className}`}>
      {isPopular && (
        <div className="bg-cyan-500 text-white text-center py-1 font-medium">
          Most Popular
        </div>
      )}
      
      <div className="p-6">
        <h3 className="text-xl font-bold">{planName}</h3>
        
        <div className="mt-4 mb-6">
          <span className="text-3xl font-bold">{formattedPrice}</span>
          <span className="text-gray-400">/{period}</span>
        </div>
        
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="w-5 h-5 text-cyan-500 mr-2 flex-shrink-0 mt-0.5" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-lg font-medium transition-all ${
            isPopular 
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/25'
              : 'bg-gray-800 hover:bg-gray-700 text-white'
          } disabled:opacity-70`}
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <CreditCard className="w-5 h-5" />
          )}
          
          <span>Subscribe Now</span>
        </button>
      </div>
    </div>
  );
};

export default SubscriptionButton; 