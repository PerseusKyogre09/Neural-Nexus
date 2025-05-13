"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Button } from '@/components/ui/button';

export default function UserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  if (!user) {
    return <p className="text-gray-300">Sign in to see your profile, fam!</p>;
  }

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg p-6 rounded-xl shadow-xl w-full max-w-md mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
    >
      <h2 className="text-2xl font-bold mb-4 text-pink-400">Yo, {user.displayName}!</h2>
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <img
            src={user.photoURL || 'https://via.placeholder.com/150'}
            alt="Profile Pic"
            className="w-16 h-16 rounded-full border-2 border-pink-400"
          />
          <div>
            <p className="text-gray-300">Email: {user.email}</p>
            <p className="text-gray-300">Joined: {user.metadata.creationTime?.split(' ')[3] || 'N/A'}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-pink-400">Your AI Models</h3>
          <p className="text-gray-300">No models uploaded yet. Drop some heat, fam!</p>
        </div>
        <Button className="bg-pink-500 hover:bg-pink-600 text-white">
          Manage Account, No Cap
        </Button>
      </div>
    </motion.div>
  );
} 