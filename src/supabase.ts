import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw — createClient() would crash the whole app at load (white screen).
  // Fall back to a placeholder so the rest of the site renders; only blog
  // features will fail (with a network error) until the env vars are set.
  console.error(
    'Supabase env vars are missing. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY ' +
      'in your hosting provider, then rebuild/redeploy. Blog features will not work until then.'
  );
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key'
);

// Storage bucket used for blog cover images
export const BLOG_BUCKET = 'blog-images';
