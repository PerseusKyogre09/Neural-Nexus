import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with error handling
let supabase: any = null;

// Check if we have valid config and we're on the client side
if (supabaseUrl && supabaseAnonKey && typeof window !== 'undefined') {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true
      }
    });
    console.log('Supabase client initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    // Create placeholder client to prevent crashes
    supabase = createPlaceholderClient();
  }
} else {
  console.warn('Invalid Supabase config or running on server. Using placeholder client.');
  supabase = createPlaceholderClient();
}

// Create a placeholder client for error handling
function createPlaceholderClient() {
  const noopPromise = () => Promise.resolve({ data: null, error: new Error('Supabase not initialized') });
  
  return {
    auth: {
      signUp: noopPromise,
      signIn: noopPromise,
      signOut: noopPromise,
      getUser: noopPromise,
      onAuthStateChange: () => ({ data: null, unsubscribe: () => {} })
    },
    from: () => ({
      select: noopPromise,
      insert: noopPromise,
      update: noopPromise,
      delete: noopPromise
    })
  };
}

// Export signup function that uses Supabase instead of Firebase
export const signUpWithSupabase = async (
  email: string, 
  password: string, 
  metadata: { first_name: string; last_name: string; display_name?: string }
) => {
  try {
    // Sign up with Supabase
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user,
      message: 'User registered successfully'
    };
  } catch (error: any) {
    console.error('Error during Supabase registration:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during registration'
    };
  }
};

// Sign in with Supabase
export const signInWithSupabase = async (email: string, password: string) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error: any) {
    console.error('Error during Supabase login:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during login'
    };
  }
};

// Sign out
export const signOutFromSupabase = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return { success: true };
  } catch (error: any) {
    console.error('Error during Supabase logout:', error);
    return {
      success: false,
      error: error.message || 'An error occurred during logout'
    };
  }
};

// Get current user
export const getCurrentSupabaseUser = async () => {
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    
    return {
      success: true,
      user: data.user
    };
  } catch (error: any) {
    console.error('Error getting Supabase user:', error);
    return {
      success: false,
      error: error.message || 'An error occurred getting user data'
    };
  }
};

// Reset password
export const resetSupabasePassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    
    if (error) throw error;
    
    return {
      success: true,
      message: 'Password reset email sent'
    };
  } catch (error: any) {
    console.error('Error sending reset password email:', error);
    return {
      success: false,
      error: error.message || 'An error occurred sending password reset email'
    };
  }
};

export default supabase; 