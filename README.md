# Neural Nexus - AI Model Hub

Yo, welcome to **Neural Nexus**, the dopest AI model hub where you can upload, sell, and transfer ownership of your AI creations with crypto, UPI, PayPal, or net banking. Built for the future of AI creators, fam! 🔥

## Features

- **Upload AI Models**: Drop your models and flex your skills.
- **Secure Payments**: Pay with Stripe, Razorpay (UPI), or Crypto (MetaMask).
- **Google Auth**: Sign in with Google, no cap.
- **Ownership Transfer**: Permanently transfer model ownership.
- **Lit UI**: Animated logo, background particles, and Gen-Z vibes.

## Tech Stack

- **Next.js**: Framework for React.
- **Tailwind CSS**: Styling with modern utility classes.
- **Framer Motion**: Sick animations.
- **Firebase**: Auth and backend setup.
- **Stripe & Razorpay**: Payment processing.

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

4. **Firebase Setup (Production Ready)**:
   
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
   
   f. Set up Firebase Admin SDK (for server operations):
      - Go to Project settings > Service accounts
      - Click "Generate new private key"
      - Save the JSON file securely
      - Add the relevant values to your environment variables
   
   g. Set up security rules:
      - Create proper Firestore rules:
        ```
        rules_version = '2';
        service cloud.firestore {
          match /databases/{database}/documents {
            // User profiles are readable by anyone but writable only by the owner
            match /users/{userId} {
              allow read;
              allow write: if request.auth != null && request.auth.uid == userId;
            }
            
            // Models are readable by anyone but writable only by the owner
            match /models/{modelId} {
              allow read;
              allow create: if request.auth != null;
              allow update, delete: if request.auth != null && request.auth.uid == resource.data.userId;
            }
          }
        }
        ```
      - Create proper Storage rules:
        ```
        rules_version = '2';
        service firebase.storage {
          match /b/{bucket}/o {
            match /models/{userId}/{fileName} {
              allow read;
              allow write: if request.auth != null && request.auth.uid == userId;
            }
            
            match /profile/{userId}/{fileName} {
              allow read;
              allow write: if request.auth != null && request.auth.uid == userId;
            }
          }
        }
        ```

5. **Firebase Emulators (Development)**:
   
   For local development, you can use Firebase emulators:
   
   a. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```
   
   b. Login to Firebase:
   ```bash
   firebase login
   ```
   
   c. Initialize emulators:
   ```bash
   firebase init emulators
   ```
   Select Authentication, Firestore, Storage, and Functions emulators.
   
   d. Start emulators:
   ```bash
   firebase emulators:start
   ```
   
   e. Update your `.env.local` to use emulators:
   ```
   NEXT_PUBLIC_USE_FIREBASE_EMULATORS=true
   ```

6. **Run Locally**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` to see the app in action.

## Firebase Data Structure

Our app uses the following Firestore collections:

### Users Collection
```
users/{userId}
  - uid: string
  - displayName: string
  - email: string
  - photoURL: string (optional)
  - createdAt: timestamp
  - lastLoginAt: timestamp
  - walletConnected: boolean
  - ownedModels: array of modelIds
```

### Models Collection
```
models/{modelId}
  - id: string
  - userId: string (owner's userId)
  - name: string
  - description: string
  - price: number
  - category: string
  - tags: array of strings
  - fileUrl: string (download URL)
  - filePath: string (storage path)
  - fileSize: number
  - fileType: string
  - createdAt: timestamp
  - updatedAt: timestamp
  - downloads: number
  - rating: number
  - ratings: array of objects
  - isPublic: boolean
  - status: string (active, archived, etc.)
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

Firebase provides several tools to monitor your application:

1. **Firebase Analytics**: Track user engagement and app usage
2. **Firebase Performance**: Monitor app performance
3. **Firebase Crashlytics**: Track and fix crashes

Access these through the Firebase Console.

## Contributing

Got ideas to make this even more lit? Drop a PR or issue. Let's build this together!

## License

© 2025 Indie Hub. All rights reserved.
