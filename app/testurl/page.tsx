"use client";

import { useState, useEffect } from 'react';
import { getBaseUrl } from '@/lib/utils';
import Link from 'next/link';

export default function TestUrlPage() {
  const [baseUrl, setBaseUrl] = useState<string>('');
  const [hostname, setHostname] = useState<string>('');
  const [fullUrl, setFullUrl] = useState<string>('');

  useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined') {
      const detectedBaseUrl = getBaseUrl();
      setBaseUrl(detectedBaseUrl);
      setHostname(window.location.hostname);
      setFullUrl(window.location.href);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">URL Detection Test</h1>
      
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-3">Base URL Detection</h2>
        <div className="grid gap-4 mb-6">
          <div>
            <p className="text-gray-400 mb-1">Detected hostname:</p>
            <p className="bg-gray-700 p-2 rounded">{hostname || 'Not detected yet'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">getBaseUrl() result:</p>
            <p className="bg-gray-700 p-2 rounded">{baseUrl || 'Not detected yet'}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Full current URL:</p>
            <p className="bg-gray-700 p-2 rounded">{fullUrl || 'Not detected yet'}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Constructed OAuth URLs:</h3>
          <div className="bg-gray-700 p-3 rounded mb-2">
            <p className="text-gray-300 mb-1">Standard OAuth redirect:</p>
            <p className="break-all">{baseUrl ? `${baseUrl}/auth/callback` : 'Waiting for base URL...'}</p>
          </div>
          <div className="bg-gray-700 p-3 rounded">
            <p className="text-gray-300 mb-1">With callback parameter:</p>
            <p className="break-all">{baseUrl ? `${baseUrl}/auth/callback?callbackUrl=${encodeURIComponent('/dashboard')}` : 'Waiting for base URL...'}</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Link 
          href="/signin" 
          className="py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded font-medium text-center"
        >
          Go to Sign In
        </Link>
        <Link 
          href="/" 
          className="py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded font-medium text-center"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
} 