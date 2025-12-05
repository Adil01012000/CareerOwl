import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LogOut, Bell, Settings } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'

interface PortalHeaderProps {
  userEmail: string
  roleName: string
}

export function PortalHeader({ userEmail, roleName }: PortalHeaderProps) {
  return (
    <header className="border-b bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🦉 CareerOwl</span>
        </Link>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          {/* Role Badge */}
          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            {roleName}
          </span>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>

          {/* User Email */}
          <span className="text-sm text-gray-600">{userEmail}</span>

          {/* Sign Out - Using Server Action */}
          <form action={signOut}>
            <Button variant="outline" size="sm" type="submit">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </div>
      </div>
    </header>
  )
}