"use client";

import React from 'react';
import { Chain } from "wagmi";
import type { WalletDisplay } from "@coinbase/agentkit";
// Make sure CDP SDK is only imported on server functions to avoid exposing the secret
// Do not import it here where it could be accessed by the client

/**
 * Coinbase onchain integration for frontend
 */
export const initCoinbaseOnchain = async () => {
  // Dynamic import to ensure client-side only import
  const { createTheme, createOnchain } = await import("@coinbase/agentkit");

  // Check if Coinbase API is enabled via environment
  if (!process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID) {
    console.warn("Coinbase onchain not configured - missing PROJECT_ID");
    return null;
  }

  try {
    // Initialize theme config
    const theme = createTheme({
      borderRadius: "large",
      accentColor: {
        light: "#7c3aed", // purple-600
        dark: "#9f7aea", // purple-400
      },
      colorScheme: "dark",
      fontStack: "system",
    });

    // Create agent kit onchain - this is client-side only
    const onchain = createOnchain({
      projectId: process.env.NEXT_PUBLIC_COINBASE_PROJECT_ID!,
      // Optional: Default chains to use
      defaultChains: ["ethereum", "base", "polygon", "arbitrum", "avalanche"] as Chain[],
      theme,
    });

    return onchain;
  } catch (error) {
    console.error("Error initializing Coinbase onchain:", error);
    return null;
  }
};

export const COINBASE_WALLET_CONFIG: WalletDisplay = {
  id: "coinbase-wallet",
  name: "Coinbase Wallet",
  icon: "https://api.iconify.design/logos/coinbase-icon.svg",
  description: "Connect to your Coinbase Wallet",
  iconBackground: "#2c53f5",
  category: "popular",
};

// Hook to check if we're running on the client side to prevent server errors
export const useIsClient = () => {
  const [isClient, setIsClient] = React.useState(false);
  
  React.useEffect(() => {
    setIsClient(true);
  }, []);
  
  return isClient;
};

// Helper function for formatting addresses (0x123...abc)
export const formatAddress = (address: string | undefined): string => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Helper function to get the block explorer URL for a transaction
export const getExplorerUrl = (chainId: number, txHash: string): string => {
  const explorerUrls: Record<number, string> = {
    1: "https://etherscan.io", // Ethereum
    137: "https://polygonscan.com", // Polygon
    42161: "https://arbiscan.io", // Arbitrum
    43114: "https://snowtrace.io", // Avalanche
    8453: "https://basescan.org", // Base
  };

  const baseUrl = explorerUrls[chainId] || "https://etherscan.io";
  return `${baseUrl}/tx/${txHash}`;
}; 