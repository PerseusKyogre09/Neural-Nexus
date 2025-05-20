/**
 * Runtime detection utilities
 * Used to conditionally load dependencies based on runtime
 */

// Check if we're in edge runtime
export const isEdgeRuntime = typeof process !== 'undefined' && 
  (process.env.NEXT_RUNTIME === 'edge' || process.env.EDGE_RUNTIME);

// Check if we're in browser
export const isBrowser = typeof window !== 'undefined';

// Check if we're in server (but not Edge)
export const isServer = typeof process !== 'undefined' && !isEdgeRuntime;

// Safe React import helper
export function safeReactImport() {
  if (isEdgeRuntime) {
    // Return dummy implementation for Edge runtime
    return {
      createElement: () => null,
      Fragment: Symbol('Fragment'),
      useState: () => [null, () => {}],
      useEffect: () => {},
    };
  }
  
  // Only import React in non-Edge environments
  return require('react');
}

// No-op function for Edge runtime
export const noopForEdge = () => {}; 