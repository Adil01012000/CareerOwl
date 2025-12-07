import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { Database } from '@/types/supabase'

export const updateSession = async (request: NextRequest) => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )
    // Return response without auth check if env vars are missing
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANT: Do not write any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  // Define protected route prefixes
  const protectedRoutes = ['/seeker', '/employer', '/recruiter', '/advertiser', '/esdc', '/admin']
  const authRoutes = ['/login', '/register', '/role-selection']

  // Check if current path is protected
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // If user is not logged in and trying to access protected routes
  if (!user && isProtectedRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If user is logged in
  if (user) {
    let role = user.user_metadata?.role as 'job_seeker' | 'employer' | 'recruiter' | 'advertiser' | 'esdc_officer' | 'admin' | undefined

  // If metadata is missing, query the database (fallback)
  if (!role) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    role = profile?.role

    // If STILL no role, user needs to complete registration
    if (!role) {
      console.warn('User has no role:', user.email, user.id)
      // For now, assume job_seeker as default
      role = 'job_seeker'
    }
  }
    // Redirect authenticated users away from auth pages to their dashboard
    if (isAuthRoute) {
      const url = request.nextUrl.clone()
      switch (role) {
        case 'employer':
          url.pathname = '/employer/dashboard'
          break
        case 'recruiter':
          url.pathname = '/recruiter/dashboard'
          break
        case 'advertiser':
          url.pathname = '/advertiser/dashboard'
          break
        case 'esdc_officer':
          url.pathname = '/esdc/dashboard'
          break
        case 'admin':
          url.pathname = '/admin/dashboard'
          break
        case 'job_seeker':
        default:
          url.pathname = '/seeker/dashboard'
          break
      }
      return NextResponse.redirect(url)
    }

    // Role-based route enforcement (do NOT query database - use metadata)
    if (role === 'job_seeker') {
      // Job seekers cannot access other role routes
      if (pathname.startsWith('/employer') || pathname.startsWith('/recruiter') || pathname.startsWith('/advertiser') || pathname.startsWith('/esdc') || pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/seeker/dashboard'
        return NextResponse.redirect(url)
      }
    }

    if (role === 'employer') {
      // Employers cannot access other role routes
      if (pathname.startsWith('/seeker') || pathname.startsWith('/recruiter') || pathname.startsWith('/advertiser') || pathname.startsWith('/esdc') || pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/employer/dashboard'
        return NextResponse.redirect(url)
      }
    }

    if (role === 'recruiter') {
      // Recruiters cannot access other role routes
      if (pathname.startsWith('/seeker') || pathname.startsWith('/employer') || pathname.startsWith('/advertiser') || pathname.startsWith('/esdc') || pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/recruiter/dashboard'
        return NextResponse.redirect(url)
      }
    }

    if (role === 'advertiser') {
      // Advertisers cannot access other role routes
      if (pathname.startsWith('/seeker') || pathname.startsWith('/employer') || pathname.startsWith('/recruiter') || pathname.startsWith('/esdc') || pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/advertiser/dashboard'
        return NextResponse.redirect(url)
      }
    }

    if (role === 'esdc_officer') {
      // ESDC Officers cannot access other role routes
      if (pathname.startsWith('/seeker') || pathname.startsWith('/employer') || pathname.startsWith('/recruiter') || pathname.startsWith('/advertiser') || pathname.startsWith('/admin')) {
        const url = request.nextUrl.clone()
        url.pathname = '/esdc/dashboard'
        return NextResponse.redirect(url)
      }
    }

    if (role === 'admin') {
      // Admins can access everything, but let's keep them on admin routes by default
      // No restrictions for admins
    }
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}

