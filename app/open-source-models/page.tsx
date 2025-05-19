"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function OpenSourceModelsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the combined open source page with the models tab pre-selected
    router.replace('/open-source?tab=models');
  }, [router]);

  // Return a simple loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
        <p className="text-xl">Redirecting to Open Source page...</p>
          </div>
        </div>
  );
} 