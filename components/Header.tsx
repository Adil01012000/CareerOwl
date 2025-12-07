import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/utils/supabase/server'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🦉 CareerOwl</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link href="/seeker/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button variant="outline" type="submit">Sign Out</Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/jobs">
                <Button variant="ghost">Browse Jobs</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Sign In</Button>
              </Link>
              <Link href="/role-selection">
                <Button variant="default">Create Account</Button>
              </Link>
              <Link href="/employer/register">
                <Button className="bg-accent hover:bg-accent/90">Post Job</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}