import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { useAppContext } from '@/providers/AppProvider';
import { toast } from 'react-hot-toast';

interface BuyModelButtonProps {
  modelId: string;
  modelName: string;
  modelDescription?: string;
  price: number;
  imageUrl?: string;
  className?: string;
}

const BuyModelButton: React.FC<BuyModelButtonProps> = ({
  modelId,
  modelName,
  modelDescription,
  price,
  imageUrl,
  className = ''
}) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, appUser } = useAppContext();
  
  const handleBuyModel = async () => {
    // Check if user is logged in
    if (!user || !appUser) {
      toast.error('Please sign in to purchase this model');
      router.push('/signin?redirect=' + encodeURIComponent(`/models/${modelId}`));
      return;
    }
    
    setLoading(true);
    
    try {
      // Create checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          userId: appUser.id,
          modelName,
          modelDescription,
          price,
          imageUrl,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }
      
      // Redirect to Stripe checkout
      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Error processing your purchase. Please try again.');
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
    <button
      onClick={handleBuyModel}
      disabled={loading}
      className={`flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25 disabled:opacity-70 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin" />
      ) : (
        <ShoppingCart className="w-5 h-5" />
      )}
      
      <span>Buy for {formattedPrice}</span>
    </button>
  );
};

export default BuyModelButton; 