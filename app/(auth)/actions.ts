'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/utils/supabase/server'

export interface AuthResult {
  error?: string
  success?: boolean
  message?: string
}

export const login = async (formData: FormData): Promise<AuthResult> => {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  // 1. We need 'data' here to check the role immediately
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // 2. Get the Role from the session metadata
  const role = data.user?.user_metadata?.role

  revalidatePath('/', 'layout')

  // 3. Dynamic Redirect based on Role
  if (role === 'employer') {
    redirect('/employer/dashboard')
  } else if (role === 'recruiter') {
    redirect('/recruiter/dashboard')
  } else if (role === 'advertiser') {
    redirect('/advertiser/dashboard')
  } else if (role === 'esdc_officer') {
    redirect('/esdc/dashboard')
  } else if (role === 'admin') {
    redirect('/admin/dashboard')
  } else {
    // Default to seeker for 'job_seeker' or undefined
    redirect('/seeker/dashboard')
  }
}

export const signup = async (formData: FormData): Promise<AuthResult> => {
  const supabase = await createClient()
  const headersList = await headers()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const role = formData.get('role') as 'job_seeker' | 'employer' | 'recruiter' | 'advertiser' | 'esdc_officer'

  if (!email || !password) {
    return { error: 'Email and password are required' }
  }

  const validRoles = ['job_seeker', 'employer', 'recruiter', 'advertiser', 'esdc_officer']
  if (!role || !validRoles.includes(role)) {
    return { error: 'Please select a valid role' }
  }

  // Validate password strength
  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters long' }
  }

  // Get the origin dynamically for the email redirect
  const origin = headersList.get('origin')

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        role, user_metadata: { role } // This will be available in user_metadata for the database trigger
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  return {
    success: true,
    message: 'Check your email for the confirmation link to complete your registration.',
  }
}

export const signOut = async (): Promise<void> => {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

