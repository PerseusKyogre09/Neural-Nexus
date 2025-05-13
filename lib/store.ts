import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Model {
  id: string;
  name: string;
  description: string;
  author: string;
  price: number;
  currency: string;
  rating: number;
  downloads: number;
  imageUrl: string;
  tags: string[];
  createdAt: string;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  walletConnected: boolean;
  walletAddress?: string;
  ownedModels: string[];
  purchasedModels?: string[];
  stripeCustomerId?: string;
  subscription?: {
    id: string;
    status: string;
    planId?: string;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
  };
}

interface UIState {
  theme: 'dark' | 'light';
  isSearchOpen: boolean;
  activeTab: string;
  isModalOpen: boolean;
  modalType: 'upload' | 'payment' | 'preview' | 'compare' | null;
}

export interface AppState {
  user: AppUser | null;
  cart: Model[];
  favoriteModels: string[];
  searchQuery: string;
  recentlyViewed: string[];
  ui: UIState;
  
  // User actions
  setUser: (user: AppUser | null) => void;
  connectWallet: (address: string) => void;
  disconnectWallet: () => void;
  
  // Cart actions
  addToCart: (model: Model) => void;
  removeFromCart: (modelId: string) => void;
  clearCart: () => void;
  
  // Favorite actions
  toggleFavorite: (modelId: string) => void;
  
  // UI actions
  setTheme: (theme: 'dark' | 'light') => void;
  setSearchOpen: (isOpen: boolean) => void;
  setActiveTab: (tab: string) => void;
  openModal: (type: 'upload' | 'payment' | 'preview' | 'compare') => void;
  closeModal: () => void;
  
  // Search/browsing actions
  setSearchQuery: (query: string) => void;
  addToRecentlyViewed: (modelId: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      user: null,
      cart: [],
      favoriteModels: [],
      searchQuery: '',
      recentlyViewed: [],
      ui: {
        theme: 'dark',
        isSearchOpen: false,
        activeTab: 'featured',
        isModalOpen: false,
        modalType: null,
      },
      
      // User actions
      setUser: (user) => set({ user }),
      connectWallet: (address) => set((state) => ({
        user: state.user 
          ? { ...state.user, walletConnected: true, walletAddress: address } 
          : null
      })),
      disconnectWallet: () => set((state) => ({
        user: state.user 
          ? { ...state.user, walletConnected: false, walletAddress: undefined } 
          : null
      })),
      
      // Cart actions
      addToCart: (model) => set((state) => ({
        cart: [...state.cart, model]
      })),
      removeFromCart: (modelId) => set((state) => ({
        cart: state.cart.filter((item) => item.id !== modelId)
      })),
      clearCart: () => set({ cart: [] }),
      
      // Favorite actions
      toggleFavorite: (modelId) => set((state) => ({
        favoriteModels: state.favoriteModels.includes(modelId)
          ? state.favoriteModels.filter((id) => id !== modelId)
          : [...state.favoriteModels, modelId]
      })),
      
      // UI actions
      setTheme: (theme) => set((state) => ({
        ui: { ...state.ui, theme }
      })),
      setSearchOpen: (isSearchOpen) => set((state) => ({
        ui: { ...state.ui, isSearchOpen }
      })),
      setActiveTab: (activeTab) => set((state) => ({
        ui: { ...state.ui, activeTab }
      })),
      openModal: (modalType) => set((state) => ({
        ui: { ...state.ui, isModalOpen: true, modalType }
      })),
      closeModal: () => set((state) => ({
        ui: { ...state.ui, isModalOpen: false, modalType: null }
      })),
      
      // Search/browsing actions
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      addToRecentlyViewed: (modelId) => set((state) => ({
        recentlyViewed: [
          modelId,
          ...state.recentlyViewed.filter((id) => id !== modelId)
        ].slice(0, 10) // Keep only the 10 most recent
      })),
    }),
    {
      name: 'neural-nexus-store',
      partialize: (state) => ({
        favoriteModels: state.favoriteModels,
        recentlyViewed: state.recentlyViewed,
        ui: { theme: state.ui.theme },
      }),
    }
  )
); 