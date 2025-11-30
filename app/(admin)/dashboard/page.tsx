import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import {
  Shield,
  Users,
  Briefcase,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  Clock,
  CheckCircle,
  LogOut,
} from 'lucide-react'
import { signOut } from '@/app/(auth)/actions'

const AdminDashboard = async () => {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Verify admin role
  const role = user.user_metadata?.role
  if (role !== 'admin') {
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
              <span className="px-2 py-1 text-xs font-medium bg-red-500/20 text-red-400 rounded-md flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Admin
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-slate-400">Manage users, verify employers, and monitor platform activity.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Total Users</p>
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
                <p className="text-sm text-slate-400">Pending Verifications</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">0</p>
                <p className="text-sm text-slate-400">Active Jobs</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">$0</p>
                <p className="text-sm text-slate-400">Revenue (MTD)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Verification Queue */}
          <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-semibold text-white">Verification Queue</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Review and verify employer business documents.
            </p>
            <a
              href="/admin/verification"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-900 font-medium rounded-lg transition-all text-sm"
            >
              Review pending (0)
            </a>
          </div>

          {/* User Management */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">User Management</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Manage user accounts, roles, and permissions.
            </p>
            <a
              href="/admin/users"
              className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
            >
              Manage users →
            </a>
          </div>

          {/* Job Management */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Briefcase className="w-5 h-5 text-emerald-400" />
              <h2 className="text-lg font-semibold text-white">Job Management</h2>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Monitor all job postings and force-close if needed.
            </p>
            <a
              href="/admin/jobs"
              className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 text-sm font-medium transition-colors"
            >
              View all jobs →
            </a>
          </div>
        </div>

        {/* Alerts Section */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-semibold text-white">System Alerts</h2>
          </div>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <p className="text-emerald-400 font-medium">All systems operational</p>
            <p className="text-slate-500 text-sm mt-1">No alerts or issues detected.</p>
          </div>
        </div>

        {/* Recent Admin Activity */}
        <div className="mt-8 bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Admin Activity</h2>
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-slate-500" />
            </div>
            <p className="text-slate-400">No recent admin actions</p>
            <p className="text-slate-500 text-sm mt-1">Admin actions will be logged here.</p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard

