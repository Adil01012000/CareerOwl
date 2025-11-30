import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Briefcase, FileText, MessageSquare, Bell, TrendingUp, Clock, CheckCircle, LogOut } from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'

const SeekerDashboard = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back!</h1>
          <p className="text-slate-400">Here&apos;s what&apos;s happening with your job search.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Applications</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Interviews</p>
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
                <p className="text-sm text-slate-400">Offers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Browse Jobs</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Explore thousands of job opportunities matched to your profile.
            </p>
            <a
              href="/jobs"
              className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 text-sm font-medium transition-colors"
            >
              View all jobs →
            </a>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <MessageSquare className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Messages</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Check your inbox for messages from employers.
            </p>
            <a
              href="/seeker/messages"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              View messages →
            </a>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-5 h-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Stay updated with application status changes.
            </p>
            <span className="inline-flex items-center gap-2 text-slate-500 text-sm">
              No new notifications
            </span>
          </div>
        </div>

        {/* Profile Completion Banner */}
        <div className="mt-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-white mb-1">Complete your profile</h3>
              <p className="text-slate-400 text-sm">
                A complete profile increases your chances of getting noticed by employers.
              </p>
            </div>
            <a
              href="/seeker/profile"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-semibold rounded-xl shadow-lg shadow-orange-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
            >
              Edit profile
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SeekerDashboard

