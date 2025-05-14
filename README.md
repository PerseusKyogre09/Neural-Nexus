# Neural Nexus - AI Model Hub

<div align="center">
  <img src="public/images/Logo.png" alt="Neural Nexus Logo" width="200" />
  <p style="font-size: 1.2em; color: #00BFFF; font-weight: bold;">The Ultimate Hub for AI Innovators</p>
</div>

## Welcome to Neural Nexus

Welcome to **Neural Nexus**, a comprehensive AI model hub where you can upload, sell, and transfer ownership of your AI creations using various payment methods including cryptocurrency, UPI, PayPal, and net banking. We focus on building a vibrant community of creators and innovators shaping the future of AI, emphasizing innovation and collaboration.

We're inspired by the 'Radio on the Internet' concept for AI—powered by strategic partnerships and a commitment to open access. Our mission is to democratize AI by providing free models and data, inspired by the Transformers library from Hugging Face, while also offering premium content for advanced users.

## Features

- **Upload AI Models**: Share your models with the world
- **Secure Payments**: Process payments via Stripe, Razorpay (UPI), or Cryptocurrency (MetaMask)
- **Modern Authentication**: Sign in with Google, GitHub, email, or cryptocurrency wallets
- **Ownership Transfer**: Transfer model ownership with blockchain security
- **Open Source Models**: Access a comprehensive library of free models inspired by Transformers
- **Premium Marketplace**: Buy and sell premium models and datasets for advanced projects
- **Modern UI**: Responsive design with smooth animations and contemporary aesthetics

## Technology Stack

- **Next.js**: React framework for high-performance applications
- **Tailwind CSS**: Utility-first CSS framework for modern styling
- **Framer Motion**: Animation library for enhanced user experience
- **Supabase**: Open-source Firebase alternative for authentication and database management
- **Stripe & Razorpay**: Payment processing solutions
- **Edge Functions**: Lightweight serverless functions for optimal performance

## Setup Guide

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Drago-03/Neural-Nexus.git
   cd Neural-Nexus
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables**:
   Create a `.env.local` file in the root directory using the `.env.local.example` as a template:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit the file to add your actual credentials.

4. **Supabase Setup (Main Database & Auth)**:
   
   a. Create a Supabase project at [Supabase](https://supabase.com/) (free tier available)
   
   b. Get your API credentials:
      - Go to Project Settings > API
      - Copy the URL, public anon key, and service role key
      - Add them to your `.env.local` file
   
   c. Initialize the database:
      - After setting up your project and environment variables, run:
      ```bash
      # Start your Next.js dev server
      npm run dev
      
      # In a new terminal, initialize the database (one-time setup)
      curl "http://localhost:3000/api/supabase-setup?setup_key=YOUR_SETUP_KEY_FROM_ENV"
      ```
      
   d. Enable authentication providers:
      - Go to Authentication > Providers
      - Enable Email, Google, GitHub, etc. as needed
      - Configure OAuth credentials for third-party providers
   
   e. Set up storage buckets:
      - Go to Storage
      - Create buckets for: `models`, `avatars`, `thumbnails`
      - Set RLS policies for each bucket

5. **Firebase Setup (Legacy/Optional)**:
   
   The app is transitioning from Firebase to Supabase, but can still use Firebase for some features.
   
   a. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   
   b. Enable Authentication services:
      - Go to Authentication > Sign-in method
      - Enable Email/Password and Google sign-in methods
   
   c. Create a Firestore database:
      - Go to Firestore Database > Create database
      - Start in production mode
      - Choose a location close to your users
   
   d. Set up Storage:
      - Go to Storage > Get started
      - Set up security rules for production
   
   e. Get your Firebase config:
      - Go to Project settings > General
      - Scroll down to "Your apps" and select your web app
      - Copy the Firebase config values to your `.env.local` file

6. **Run Locally**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to view the application.

## Supabase Data Model

The application uses the following Supabase tables:

### **user_profiles**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  email TEXT,
  bio TEXT,
  avatar_url TEXT,
  website TEXT,
  social_links JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

### **models**
```sql
CREATE TABLE models (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) DEFAULT 0,
  category TEXT,
  tags TEXT[],
  file_url TEXT,
  file_path TEXT,
  file_size BIGINT,
  file_type TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  is_public BOOLEAN DEFAULT true,
  status TEXT DEFAULT 'active'
);
```

## Deployment on Vercel

1. Push your code to a GitHub repository
2. Go to [Vercel](https://vercel.com) and create a new project
3. Connect your GitHub repository
4. Set all the environment variables from your `.env.local` file in the Vercel dashboard
5. Deploy your application

### **Setting Up Environment Variables on Vercel**
- Go to your project settings in Vercel
- Navigate to Environment Variables
- Add all the variables from your `.env.local` file
- Make sure to set `NEXT_PUBLIC_APP_ENV=production`
- Redeploy your application to apply the changes

## Monitoring and Analytics

Both Supabase and Firebase provide tools to monitor your application:

1. **Supabase Dashboard**: Track database usage, API calls, and authentication
2. **Firebase Analytics** (if using): Track user engagement and app usage
3. **Vercel Analytics**: Monitor page performance and user metrics

## Edge Functions vs. Serverless Functions

This app uses both Edge Functions (for lightweight operations) and standard serverless functions (for heavier processing):

- **Edge Functions**: Fast, lightweight API routes that run globally close to users
- **Serverless Functions**: More powerful Node.js environments for database operations and complex processing

## Web3 Wallet Integration

Neural Nexus includes a lightweight wallet connection system through the `SimpleCryptoProvider`. This replaces the previous TonConnect implementation.

### **Enabling the Wallet Connection**

To enable wallet connection in your application:

1. Set the feature flag in your `.env.local` file:
```
NEXT_PUBLIC_ENABLE_SIMPLE_CRYPTO=true
```

2. The wallet connect button will automatically appear in the navbar when the feature flag is enabled.

3. For custom integration, you can use the `SimpleCryptoButton` component:
```tsx
import dynamic from 'next/dynamic';

// Import with dynamic to avoid SSR issues
const SimpleCryptoButton = dynamic(
  () => import('@/components/SimpleCryptoButton'),
  { ssr: false }
);

// Then use it in your component
function MyComponent() {
  return <SimpleCryptoButton />;
}
```

4. For direct access to wallet state, use the `useSimpleCrypto` hook:
```tsx
import { useSimpleCrypto } from '@/providers/SimpleCryptoProvider';

function MyComponent() {
  const { activeWallet, connectWallet, disconnectWallet } = useSimpleCrypto();
  
  return (
    <div>
      {activeWallet ? (
        <div>Connected to: {activeWallet}</div>
      ) : (
        <button onClick={() => connectWallet('MetaMask')}>Connect</button>
      )}
    </div>
  );
}
```

## Policies & Documentation

We maintain comprehensive documentation on how we handle data, models, and content. Please review our policies for complete transparency:

- **Privacy Policy**: Learn how we protect your data and maintain information security. [Read More](docs/PRIVACY_POLICY.md)
- **Content Policy**: Keep the vibes positive! Understand what content is cool to share on Neural Nexus. [Read More](docs/CONTENT_POLICY.md)
- **Model Policies**: Rules for uploading and sharing AI models. Let's keep the AI game fair and innovative. [Read More](docs/MODEL_POLICIES.md)
- **Cookie Policy**: We use cookies to make your experience smoother than butter. Find out how. [Read More](docs/COOKIE_POLICY.md)
- **Updates & Changelog**: Stay updated with the latest changes and features. We're always leveling up! [Read More](docs/UPDATES.md)

These docs are here to ensure we're all on the same page, building a safe and creative space for AI innovation. Got questions? Hit us up! 💬

## Contributing

Got ideas to make this even more lit? Drop a PR or issue. Let's build this together! 💡

### **Contributors**
- **Mantej Singh** - Project Lead & Developer 🚀

## License

© 2025 Indie Hub. All rights reserved. Keep it real, fam! ✌️
