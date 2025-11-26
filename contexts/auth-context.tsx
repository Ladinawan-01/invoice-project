"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName?: string, phone?: string) => Promise<{ error: any; data?: any }>
  signOut: () => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Error getting session:', error)
      }
      setUser(session?.user ?? null)
      setLoading(false)
    }).catch((error) => {
      console.error('Error in getSession:', error)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      if (session) {
        router.refresh()
      }
    })

    return () => subscription.unsubscribe()
  }, [router, supabase])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signUp = async (email: string, password: string, fullName?: string, phone?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
        },
      },
    })
    
    // Supabase sometimes returns 200 OK but user is not actually created if email already exists
    // Check multiple conditions to detect duplicate email:
    // 1. No error but no user object
    // 2. User exists but identities array is empty (indicates duplicate)
    // 3. User exists but role is empty string
    if (!error && data?.user) {
      const user = data.user
      // Check if identities array is empty - this indicates duplicate email
      if (!user.identities || user.identities.length === 0) {
        return { 
          error: { 
            message: "This email is already registered. Please sign in instead.",
            code: "user_already_registered"
          },
          data: null
        }
      }
      // Check if role is empty string - another indicator
      if (user.role === "" || !user.role) {
        return { 
          error: { 
            message: "This email is already registered. Please sign in instead.",
            code: "user_already_registered"
          },
          data: null
        }
      }
    }
    
    // Check if user was actually created (null user means duplicate)
    if (!error && !data?.user) {
      return { 
        error: { 
          message: "This email is already registered. Please sign in instead.",
          code: "user_already_registered"
        },
        data: null
      }
    }

    // Handle explicit duplicate email errors
    if (error) {
      // Check if it's a duplicate email error
      const isDuplicateEmail = 
        error.message?.toLowerCase().includes("user already registered") ||
        error.message?.toLowerCase().includes("already registered") ||
        error.message?.toLowerCase().includes("email already exists") ||
        error.message?.toLowerCase().includes("already exists") ||
        error.message?.toLowerCase().includes("duplicate") ||
        error.code === "user_already_registered"
      
      if (isDuplicateEmail) {
        return { 
          error: { 
            message: "This email is already registered. Please sign in instead.",
            code: "user_already_registered"
          },
          data: null
        }
      }
    }
    
    return { error, data }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const resendConfirmationEmail = async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email,
    })
    return { error }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut, resendConfirmationEmail }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

