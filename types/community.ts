// Types for the community page components

export interface Creator {
  name: string;
  image: string;
  role: string;
  models: number;
  followers: string;
  bio: string;
  tags: string[];
}

export interface Model {
  name: string;
  image: string;
  creator: string;
  category: string;
  likes: number;
  downloads: string;
}

export interface Event {
  title: string;
  date: string;
  image: string;
  location: string;
  attendees: number;
}

export interface Discussion {
  title: string;
  author: string;
  replies: number;
  likes: number;
  tags: string[];
}

// Animation variants for Framer Motion
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5 }
};

// Utility type for variant props
export type VariantType = 'default' | 'gradient' | 'subtle'; 