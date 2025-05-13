"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, ArrowLeft, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function CheckoutSuccessPage() {
  const [loading, setLoading] = useState(true);
  const [checkoutDetails, setCheckoutDetails] = useState<any>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  
  useEffect(() => {
    // If no session ID is provided, redirect to home
    if (!sessionId) {
      toast.error('No checkout session found');
      router.push('/');
      return;
    }
    
    // Fetch checkout session details
    const getCheckoutDetails = async () => {
      try {
        const response = await fetch(`/api/checkout-details?session_id=${sessionId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch checkout details');
        }
        
        setCheckoutDetails(data);
      } catch (error) {
        console.error('Error fetching checkout details:', error);
        toast.error('Could not verify your purchase. Please contact support.');
      } finally {
        setLoading(false);
      }
    };
    
    getCheckoutDetails();
  }, [sessionId, router]);
  
  const isSubscription = checkoutDetails?.mode === 'subscription';
  
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-3xl">
          <motion.div 
            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 md:p-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {loading ? (
              <div className="flex flex-col items-center py-8">
                <div className="loader mb-4">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </div>
                <p className="text-xl font-medium">Verifying your purchase...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center mb-8">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-10 h-10 text-green-500" />
                  </div>
                </div>
                
                <h1 className="text-3xl font-bold text-center mb-6">Payment Successful!</h1>
                
                <p className="text-center text-gray-300 mb-8">
                  {isSubscription 
                    ? 'Your subscription has been successfully activated.'
                    : 'Your purchase has been successfully completed.'}
                  Thank you for your payment.
                </p>
                
                {checkoutDetails && (
                  <div className="bg-gray-900/50 rounded-xl p-6 mb-8">
                    <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                    
                    <div className="space-y-2">
                      {checkoutDetails.lineItems?.map((item: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Package className="w-5 h-5 text-cyan-500 mr-3" />
                            <span>{item.name || 'Product'}</span>
                          </div>
                          <span>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: checkoutDetails.currency || 'USD'
                            }).format((item.amount || 0) / 100)}
                          </span>
                        </div>
                      ))}
                      
                      {!checkoutDetails.lineItems && checkoutDetails.amount_total && (
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Package className="w-5 h-5 text-cyan-500 mr-3" />
                            <span>{isSubscription ? 'Subscription' : 'Product'}</span>
                          </div>
                          <span>
                            {new Intl.NumberFormat('en-US', {
                              style: 'currency',
                              currency: checkoutDetails.currency || 'USD'
                            }).format(checkoutDetails.amount_total / 100)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  {isSubscription ? (
                    <Link 
                      href="/account/subscription" 
                      className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
                    >
                      <span>View My Subscription</span>
                    </Link>
                  ) : (
                    <Link 
                      href="/account/purchases" 
                      className="flex items-center justify-center gap-2 py-3 px-6 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/25"
                    >
                      <span>View My Purchases</span>
                    </Link>
                  )}
                  
                  <Link 
                    href="/" 
                    className="flex items-center justify-center gap-2 py-3 px-6 bg-gray-800 hover:bg-gray-700 rounded-lg font-medium transition-colors"
                  >
                    <Home className="w-5 h-5" />
                    <span>Return Home</span>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 