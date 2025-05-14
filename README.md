# Neural Nexus - AI Model Hub

Yo, welcome to **Neural Nexus**, the dopest AI model hub where you can upload, sell, and transfer ownership of your AI creations with crypto, UPI, PayPal, or net banking. Built for the future of AI creators, fam! 🔥

## Features

- **Upload AI Models**: Drop your models and flex your skills.
- **Secure Payments**: Pay with Stripe, Razorpay (UPI), or Crypto (MetaMask).
- **Modern Auth**: Sign in with Google, GitHub, email, or crypto wallets.
- **Ownership Transfer**: Permanently transfer model ownership.
- **Lit UI**: Animated logo, background particles, and Gen-Z vibes.

## Tech Stack

- **Next.js**: Framework for React.
- **Tailwind CSS**: Styling with modern utility classes.
- **Framer Motion**: Sick animations.
- **Supabase**: Open-source Firebase alternative for auth and database.
- **Stripe & Razorpay**: Payment processing.
- **Edge Functions**: Lightweight serverless functions for better performance.

## Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/your-username/neural-nexus.git
   cd neural-nexus
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
   Open `http://localhost:3000` to see the app in action.

## Supabase Data Model

The app uses the following Supabase tables:

### user_profiles
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

### models
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

1. Push your code to a GitHub repo.
2. Go to [Vercel](https://vercel.com) and create a new project.
3. Connect your GitHub repo.
4. Set all the environment variables from your `.env.local` file in the Vercel dashboard.
5. Deploy, and you're live, fam!

### Setting Up Environment Variables on Vercel
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

## Contributing

Got ideas to make this even more lit? Drop a PR or issue. Let's build this together!

## License

© 2025 Indie Hub. All rights reserved.
