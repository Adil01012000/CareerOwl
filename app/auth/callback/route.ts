import { createClient } from '@/utils/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // If "next" is in params, use it as the redirect URL (for redirect back after email verification)
  const next = searchParams.get('next') ?? null

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      // Get user role from metadata and redirect to appropriate dashboard
      const role = data.user.user_metadata?.role as 'job_seeker' | 'employer' | 'admin' | undefined

      // If there's a specific "next" URL, use it
      if (next) {
        return NextResponse.redirect(`${origin}${next}`)
      }

      // Otherwise, redirect based on role
      let redirectPath = '/seeker/dashboard' // default
      switch (role) {
        case 'employer':
          redirectPath = '/employer/dashboard'
          break
        case 'admin':
          redirectPath = '/admin/dashboard'
          break
        case 'job_seeker':
        default:
          redirectPath = '/seeker/dashboard'
          break
      }

      return NextResponse.redirect(`${origin}${redirectPath}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}

