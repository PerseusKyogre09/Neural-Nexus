"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SignInMenu } from '@/src/components/auth/SignInMenu';
import Link from 'next/link';
import { ArrowRight } from "lucide-react";

export default function SignupPage() {
  // State to control if the SignInMenu is open
  const [showSignInMenu, setShowSignInMenu] = useState(false);
  
  // Auto-open the signup modal when the page loads
  useEffect(() => {
    setShowSignInMenu(true);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <Navbar />
      
      <div className="pt-28 pb-16 px-4">
        <div className="container mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-500 to-pink-500">
              Join Neural Nexus
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Create your account to access all features and join our community of AI enthusiasts.
            </p>
          </div>
        </div>
      </div>

      {/* Render the SignInMenu with isSignIn=false to show signup form */}
      <SignInMenu 
        isOpen={showSignInMenu} 
        onClose={() => setShowSignInMenu(false)} 
        initialMode="signup"
      />
      
      <Footer />
    </main>
  );
} 