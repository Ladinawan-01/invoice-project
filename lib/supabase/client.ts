import { createBrowserClient } from '@supabase/ssr'

// Direct Supabase configuration (no .env needed)
const SUPABASE_URL = 'https://rwpilfomrrixlaigciyw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_8UuJsg9Wd7-oJ9n3nYtvew_Ut1bOqnk' // Replace with your actual anon key from Supabase dashboard

export function createClient() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

