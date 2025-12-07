'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, UserPlus, AlertCircle, Loader2, ArrowLeft, MailCheck } from 'lucide-react'
import { signup, AuthResult } from '../actions'

type Role = 'job_seeker' | 'employer' | 'recruiter' | 'advertiser' | 'esdc_officer'

const RegisterPage = () => {
  const searchParams = useSearchParams()
  const roleFromUrl = searchParams.get('role') as Role | null
  
  const [selectedRole, setSelectedRole] = useState<Role>(roleFromUrl || 'job_seeker')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [passwordMatch, setPasswordMatch] = useState(true)

  useEffect(() => {
    if (roleFromUrl) {
      setSelectedRole(roleFromUrl)
    }
  }, [roleFromUrl])

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    // Check password match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setPasswordMatch(false)
      setIsLoading(false)
      return
    }

    setPasswordMatch(true)

    // Append the selected role to form data
    formData.set('role', selectedRole)

    const result: AuthResult = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setIsLoading(false)
    } else if (result?.success) {
      setSuccess(true)
      setIsLoading(false)
    }
  }

  // Success State - Show confirmation message
  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <MailCheck className="w-10 h-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-4">Check your email</h1>
          <p className="text-gray-600 text-lg mb-8">
            We&apos;ve sent a confirmation link to your email address. Click the link to activate your account.
          </p>

          <div className="bg-white border border-gray-200 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-medium text-gray-900 mb-3">What&apos;s next?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>1. Open your email inbox</li>
              <li>2. Click the confirmation link</li>
              <li>3. Complete your profile setup</li>
            </ul>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all"
            >
              Go to Login
            </Link>
            <p className="text-gray-600 text-sm">
              Didn&apos;t receive the email?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => setSuccess(false)}
              >
                Try again
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back to sign in link */}
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          {/* Title */}
          <h1 className="text-2xl font-bold text-gray-900 mb-8">
            Create your account
          </h1>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {/* Hidden Role Field */}
            <input type="hidden" name="role" value={selectedRole} />

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-blue-50 border border-blue-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  disabled={isLoading}
                  className={`w-full pl-12 pr-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    !passwordMatch
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage

