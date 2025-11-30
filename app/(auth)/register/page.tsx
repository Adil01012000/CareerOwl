'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, Lock, UserPlus, AlertCircle, Loader2, Briefcase, User, CheckCircle, MailCheck } from 'lucide-react'
import { signup, AuthResult } from '../actions'

type Role = 'job_seeker' | 'employer'

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState<Role>('job_seeker')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true)
    setError(null)

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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="relative w-full max-w-md text-center">
          {/* Success Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 mb-6 shadow-lg shadow-green-500/25">
            <MailCheck className="w-10 h-10 text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Check your email</h1>
          <p className="text-slate-400 text-lg mb-8 max-w-sm mx-auto">
            We&apos;ve sent a confirmation link to your email address. Click the link to activate your account.
          </p>

          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-start gap-4 text-left">
              <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-medium text-white mb-1">What&apos;s next?</h3>
                <ul className="text-sm text-slate-400 space-y-2">
                  <li>1. Open your email inbox</li>
                  <li>2. Click the confirmation link</li>
                  <li>3. Complete your profile setup</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Go to Login
            </Link>
            <p className="text-slate-500 text-sm">
              Didn&apos;t receive the email?{' '}
              <button
                type="button"
                className="text-amber-400 hover:text-amber-300 font-medium"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 py-12">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 mb-4 shadow-lg shadow-orange-500/25">
            <span className="text-2xl font-bold text-slate-900">CO</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Create your account</h1>
          <p className="text-slate-400 mt-2">Join CareerOwl today</p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Role Selection Tabs */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-300 mb-3">I am a...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole('job_seeker')}
                disabled={isLoading}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'job_seeker'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-600/50 bg-slate-900/30 hover:border-slate-500/50 hover:bg-slate-900/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {selectedRole === 'job_seeker' && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                )}
                <User
                  className={`w-8 h-8 ${selectedRole === 'job_seeker' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                <span
                  className={`font-medium ${selectedRole === 'job_seeker' ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  Job Seeker
                </span>
                <span className="text-xs text-slate-500">Find your dream job</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole('employer')}
                disabled={isLoading}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  selectedRole === 'employer'
                    ? 'border-amber-500 bg-amber-500/10'
                    : 'border-slate-600/50 bg-slate-900/30 hover:border-slate-500/50 hover:bg-slate-900/50'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {selectedRole === 'employer' && (
                  <div className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-3.5 h-3.5 text-slate-900" />
                  </div>
                )}
                <Briefcase
                  className={`w-8 h-8 ${selectedRole === 'employer' ? 'text-amber-400' : 'text-slate-400'}`}
                />
                <span
                  className={`font-medium ${selectedRole === 'employer' ? 'text-amber-400' : 'text-slate-300'}`}
                >
                  Employer
                </span>
                <span className="text-xs text-slate-500">Hire top talent</span>
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            {/* Hidden Role Field */}
            <input type="hidden" name="role" value={selectedRole} />

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full pl-12 pr-4 py-3 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">Must be at least 8 characters</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-800/50 text-slate-500">Already have an account?</span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/login"
            className="w-full flex items-center justify-center py-3.5 px-4 border border-slate-600/50 text-slate-300 font-medium rounded-xl hover:bg-slate-700/30 hover:border-slate-500/50 transition-all"
          >
            Sign in instead
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="text-amber-400 hover:text-amber-300">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-amber-400 hover:text-amber-300">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage

