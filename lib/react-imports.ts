/**
 * Central place for React imports to avoid importing React in middleware
 * Import this file in your components, but NOT in middleware
 */

// Only import if not in edge runtime
let React: any;
let useState: any;
let useEffect: any;
let useCallback: any;

// Only load React if we're in a browser or server environment, not edge runtime
if (typeof window !== 'undefined' || 
    (typeof process !== 'undefined' && process.env.NEXT_RUNTIME !== 'edge')) {
  // Safe to import React
  const ReactModule = require('react');
  React = ReactModule;
  useState = ReactModule.useState;
  useEffect = ReactModule.useEffect;
  useCallback = ReactModule.useCallback;
}

// Dummy implementations for edge runtime to avoid errors
const edgeReact = {
  createElement: () => null,
  Fragment: Symbol('Fragment'),
};

// Export either real React or dummy implementation
export default typeof React !== 'undefined' ? React : edgeReact;
export { 
  useState, 
  useEffect,
  useCallback
}; 