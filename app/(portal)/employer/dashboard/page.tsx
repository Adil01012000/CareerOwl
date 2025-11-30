import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  Briefcase,
  Users,
  MessageSquare,
  TrendingUp,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'

const EmployerDashboard = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check verification status (would normally come from employer_profiles table)
  const isVerified = false // Placeholder - would check document_verification_status

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900">CO</span>
              </div>
              <span className="text-xl font-semibold text-white">CareerOwl</span>
              <span className="px-2 py-1 text-xs font-medium bg-blue-500/20 text-blue-400 rounded-md">
                Employer
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">{user.email}</span>
              <form action={signOut}>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white border border-slate-600/50 hover:border-slate-500/50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Verification Banner */}
        {!isVerified && (
          <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white mb-1">Verification Required</h3>
                <p className="text-slate-400 text-sm">
                  Your business documents are pending verification. You can create job drafts, but
                  you won&apos;t be able to publish jobs until your account is verified.
                </p>
              </div>
              <a
                href="/employer/verification"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-semibold rounded-xl transition-all"
              >
                Submit documents
              </a>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Employer Dashboard</h1>
          <p className="text-slate-400">Manage your job postings and track applications.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Total Applicants</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Pending Review</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Hires Made</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Post New Job Card */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Plus className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Post a New Job</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Create a new job posting and reach thousands of qualified candidates.
            </p>
            <a
              href="/employer/jobs/new"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isVerified
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900'
                  : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {isVerified ? 'Create job post' : 'Verification required'}
            </a>
          </div>

          {/* Manage Applications Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Manage Applications</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Review and manage applications with our Kanban-style board.
            </p>
            <a
              href="/employer/jobs"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View all jobs →
            </a>
          </div>

          {/* Messages Card */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Communicate directly with candidates about their applications.
            </p>
            <a
              href="/employer/messages"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 text-sm font-medium transition-colors"
            >
              View messages →
            </a>
          </div>
        </div>

        {/* Recent Activity Placeholder */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400">No recent activity</p>
            <p className="text-slate-500 text-sm mt-1">
              Post your first job to start receiving applications.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default EmployerDashboard

