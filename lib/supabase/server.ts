import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export function createClient(cookieStore = cookies()) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        'x-supabase-auth-token': cookieStore.get('supabase-auth-token')?.value,
      },
    },
  });
} 