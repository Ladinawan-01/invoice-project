import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Direct Supabase configuration (no .env needed)
const SUPABASE_URL = 'https://rwpilfomrrixlaigciyw.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_8UuJsg9Wd7-oJ9n3nYtvew_Ut1bOqnk' // Replace with your actual anon key from Supabase dashboard

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

