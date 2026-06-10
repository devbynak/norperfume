import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client used by /api routes (Vercel serverless).
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';

// Create client only if we have the credentials, otherwise export a proxy or handle it in handlers
export const supabaseAdmin = (supabaseUrl && supabaseServiceKey) 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })
  : null as any; // Fallback to avoid crash on import
