import Link from 'next/link'

export function AuthHeader() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">🦉 CareerOwl</span>
        </Link>

        {/* Minimal Navigation */}
        <Link 
          href="/" 
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to Home
        </Link>
      </div>
    </header>
  )
}