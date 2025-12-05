import { AuthHeader } from '@/components/AuthHeader'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthHeader />
      <main className="flex min-h-screen items-center justify-center bg-gray-50">
        {children}
      </main>
    </>
  )
}