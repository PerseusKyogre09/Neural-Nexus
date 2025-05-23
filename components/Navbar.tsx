"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Settings, LogOut, BarChart2, Key } from 'lucide-react';
import Brand from './Brand';
import dynamic from 'next/dynamic';
import { useAppContext } from '@/providers/AppProvider';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { AIAssistantButton } from '@/components/ui/AIAssistantButton';

// Define a type for the User object with metadata
interface ExtendedUser {
  email?: string;
  displayName?: string;
  photoURL?: string;
  user_metadata?: {
    first_name?: string;
    avatar_url?: string;
    full_name?: string;
  };
}

// Import SimpleCryptoButton using dynamic import to avoid SSR issues
const SimpleCryptoButton = dynamic(
  () => import('./SimpleCryptoButton'),
  { ssr: false, loading: () => null }
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const { user: appUser, signOut: appSignOut } = useAppContext();
  const { user: supabaseUser, supabase } = useSupabase();
  const router = useRouter();
  
  // Use Supabase user if available, otherwise fall back to AppContext user
  const user = supabaseUser || appUser as ExtendedUser;

  useEffect(() => {
    setIsMounted(true);
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      // Try Supabase logout first
      if (supabase) {
        await supabase.auth.signOut();
        console.log("✅ Logged out from Supabase");
      }
      
      // Also try AppContext logout as fallback
      if (appSignOut) {
        await appSignOut();
        console.log("✅ Logged out from AppContext");
      }
      
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { href: '/hosting', label: 'Hosting' },
    { href: '/community', label: 'Community' },
    { href: '/research', label: 'Research' },
    { href: '/open-source', label: 'Open Source' },
    { href: '/pricing', label: 'Pricing' },
    { href: '/playground', label: 'AI Playground', isComingSoon: true },
    { href: '/api', label: 'API' },
    { href: '/about', label: 'About' },
    { href: '/careers', label: 'Careers' }
  ];

  // Helper to determine if link is external
  const isExternalLink = (href: string) => {
    return href.startsWith('http://') || href.startsWith('https://');
  };

  // Helper to get user display info from either provider
  const getUserDisplayName = () => {
    if (supabaseUser?.user_metadata?.full_name) {
      return supabaseUser.user_metadata.full_name;
    } else if (supabaseUser?.user_metadata?.first_name) {
      return supabaseUser.user_metadata.first_name;
    } else if (appUser?.displayName) {
      return appUser.displayName;
    }
    return 'User';
  };
  
  const getUserEmail = () => {
    return supabaseUser?.email || appUser?.email || '';
  };
  
  const getUserAvatar = () => {
    return supabaseUser?.user_metadata?.avatar_url || appUser?.photoURL;
  };
  
  const getInitial = () => {
    const name = getUserDisplayName();
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-900/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Brand size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              link.isComingSoon ? (
                <div
                  key={link.href}
                  className="relative group cursor-default"
                >
                  <span className="text-gray-300 transition-colors">
                    {link.label}
                  </span>
                  <div className="absolute left-0 top-full mt-1 w-full h-0.5 bg-gray-700 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 px-3 py-1 bg-gray-800 text-xs text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    <em>Coming Soon</em>
                  </div>
                </div>
              ) : isExternalLink(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {user ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="relative flex items-center focus:outline-none"
                  aria-label="Open user menu"
                >
                  {getUserAvatar() ? (
                    <img 
                      src={getUserAvatar()} 
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                      {getInitial()}
                    </div>
                  )}
                </button>
                
                <AnimatePresence>
                  {profileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-700 z-50"
                    >
                      <div className="border-b border-gray-700 p-3">
                        <p className="font-medium">
                          {getUserDisplayName()}
                        </p>
                        <p className="text-sm text-gray-400 truncate">{getUserEmail()}</p>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/dashboard"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <BarChart2 className="w-4 h-4 mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          href="/dashboard?tab=api"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          API Keys
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <User className="w-4 h-4 mr-2" />
                          Profile
                        </Link>
                        <Link
                          href="/dashboard?tab=settings"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 transition-colors flex items-center"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-800 transition-colors flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all transform hover:scale-105"
              >
                Get Started
              </Link>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <motion.div
          className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}
          initial="closed"
          animate={isOpen ? "open" : "closed"}
          variants={{
            open: { opacity: 1, height: 'auto' },
            closed: { opacity: 0, height: 0 }
          }}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              link.isComingSoon ? (
                <div
                  key={link.href}
                  className="block px-3 py-2 rounded-lg text-gray-400 cursor-default"
                >
                  {link.label} <em className="text-xs ml-2 text-gray-500">Coming Soon</em>
                </div>
              ) : isExternalLink(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              )
            ))}
            
            {user ? (
              <>
                <div className="px-3 py-2 border-t border-gray-700 mt-2 pt-2">
                  <div className="flex items-center mb-2">
                    {getUserAvatar() ? (
                      <img 
                        src={getUserAvatar()} 
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white">
                        {getInitial()}
                      </div>
                    )}
                    <div className="ml-2">
                      <p className="font-medium text-sm">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{getUserEmail()}</p>
                    </div>
                  </div>
                  
                  <Link
                    href="/dashboard"
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <BarChart2 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard?tab=api"
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Key className="w-4 h-4 mr-2" />
                    API Keys
                  </Link>
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard?tab=settings"
                    className="block px-3 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-3 py-2 rounded-lg text-red-400 hover:bg-gray-800 transition-colors flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                href="/signup"
                className="block px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:from-cyan-600 hover:to-blue-600 transition-all"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 