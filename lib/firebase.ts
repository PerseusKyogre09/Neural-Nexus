import { initializeApp, getApps, getApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser,
  Auth
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit as firestoreLimit,
  CollectionReference,
  DocumentData,
  Firestore
} from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  FirebaseStorage
} from 'firebase/storage';

// Configure Firebase
const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with error handling
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;
let googleProvider: GoogleAuthProvider;

// Only initialize Firebase if we have valid config
const hasValidConfig = firebaseConfig.apiKey && 
                      firebaseConfig.apiKey !== "undefined" &&
                      firebaseConfig.projectId && 
                      firebaseConfig.appId;

if (hasValidConfig) {
  try {
    // Initialize Firebase
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    
    // Initialize services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    googleProvider = new GoogleAuthProvider();
    
    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Firebase initialization error:", error);
    // Create minimal placeholders to prevent app crashes
    createPlaceholders();
  }
} else {
  console.warn("Firebase config is missing or invalid. Using placeholders.");
  createPlaceholders();
}

// Create placeholder objects to prevent app crashes
function createPlaceholders() {
  const noop = () => {};
  const noopPromise = () => Promise.resolve(null);
  
  // Mock Auth
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: FirebaseUser | null) => void) => {
      setTimeout(() => callback(null), 0);
      return noop;
    },
    signInWithPopup: noopPromise,
    signOut: noopPromise,
  } as unknown as Auth;
  
  // Mock Firestore
  db = { 
    collection: () => ({}),
    doc: () => ({
      get: noopPromise,
      set: noopPromise,
      update: noopPromise,
    }),
  } as unknown as Firestore;
  
  // Mock Storage
  storage = {
    ref: () => ({
      put: noopPromise,
      getDownloadURL: noopPromise,
    }),
  } as unknown as FirebaseStorage;
  
  // Mock provider
  googleProvider = {} as GoogleAuthProvider;
}

// Authentication functions
export const signInWithGoogle = async () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return {
      uid: "demo-user-123",
      displayName: "Demo User",
      email: "demo@example.com",
      photoURL: "/default-avatar.png",
    } as unknown as FirebaseUser;
  }
  
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Store user in Firestore if they don't exist
    const userRef = doc(db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date(),
        walletConnected: false,
        ownedModels: [],
      });
    }
    
    return user;
  } catch (error) {
    console.error('Error signing in with Google', error);
    throw error;
  }
};

export const logOut = async () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return null;
  }
  
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error signing out', error);
    throw error;
  }
};

// User helpers
export const getCurrentUser = () => {
  if (!hasValidConfig) {
    console.warn("Firebase auth not available - using demo mode");
    return Promise.resolve(null);
  }
  
  return new Promise<FirebaseUser | null>((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

// Include simple versions of other functions that work in demo mode
export const updateUserProfile = async (userId: string, data: any) => {
  if (!hasValidConfig) {
    console.warn("Firebase Firestore not available - using demo mode");
    return null;
  }
  
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, data);
  } catch (error) {
    console.error('Error updating user profile', error);
    throw error;
  }
};

// Model functions
export const uploadModel = async (
  userId: string, 
  modelFile: File, 
  metadata: any, 
  onProgress?: (progress: number) => void
) => {
  try {
    const timestamp = new Date().getTime();
    const fileExtension = modelFile.name.split('.').pop();
    const fileName = `${userId}_${timestamp}.${fileExtension}`;
    const filePath = `models/${userId}/${fileName}`;
    
    // Upload file to storage
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, modelFile);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (onProgress) onProgress(progress);
        },
        (error) => {
          console.error('Error uploading model', error);
          reject(error);
        },
        async () => {
          // Get download URL
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          // Create model in Firestore
          const modelRef = doc(collection(db, 'models'));
          const modelData = {
            id: modelRef.id,
            userId,
            name: metadata.title,
            description: metadata.description,
            price: parseFloat(metadata.price),
            category: metadata.category,
            tags: metadata.tags,
            fileUrl: downloadURL,
            filePath,
            fileSize: modelFile.size,
            fileType: modelFile.type,
            createdAt: new Date(),
            downloads: 0,
            rating: 0,
            ratings: [],
          };
          
          await setDoc(modelRef, modelData);
          resolve(modelData);
        }
      );
    });
  } catch (error) {
    console.error('Error in upload process', error);
    throw error;
  }
};

export const getModels = async (categoryFilter?: string, limitCount: number = 50) => {
  try {
    const modelsCollection = collection(db, 'models');
    let modelsQuery;
    
    if (categoryFilter) {
      modelsQuery = query(
        modelsCollection, 
        where('category', '==', categoryFilter),
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );
    } else {
      modelsQuery = query(
        modelsCollection,
        orderBy('createdAt', 'desc'),
        firestoreLimit(limitCount)
      );
    }
    
    const modelsSnapshot = await getDocs(modelsQuery);
    return modelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting models', error);
    throw error;
  }
};

export const getUserModels = async (userId: string) => {
  try {
    const modelsCollection = collection(db, 'models');
    const modelsQuery = query(
      modelsCollection,
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const modelsSnapshot = await getDocs(modelsQuery);
    return modelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting user models', error);
    throw error;
  }
};

// Export the services (which may be real or placeholders)
export { auth, db, storage }; 