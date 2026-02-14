import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

// Create Supabase client for frontend
// This uses the anon key - RLS policies control access
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Database types (for TypeScript)
export interface User {
  id: string;
  username: string | null;
  wallet_address: string;
  created_at: string;
}

export interface API {
  id: string;
  user_id: string;
  api_name: string;
  api_name_slug: string;
  image_url: string | null;
  created_at: string;
}

export interface Endpoint {
  id: string;
  api_id: string;
  endpoint_name: string;
  endpoint_path: string;
  original_url: string;
  price_microstx: number;
  active: boolean;
  created_at: string;
}

export interface APICall {
  id: string;
  endpoint_id: string;
  caller_wallet: string;
  tx_hash: string;
  amount_paid: number;
  status_code: number | null;
  latency_ms: number | null;
  timestamp: string;
}
