import { TrendingUp } from 'lucide-react'
import { getQuickStats } from '@/app/(public)/actions'

export async function QuickStats() {
  const stats = await getQuickStats()

  return (
    <div className="rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-6">
      <div className="mb-4 flex items-center gap-2">
        <TrendingUp className="h-6 w-6 text-blue-600" />
        <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
      </div>

      <div className="space-y-4">
        {/* Active Jobs */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Active Jobs</span>
          <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-semibold text-white">
            {stats.activeJobs}
          </span>
        </div>

        {/* Verified Employers */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">Verified Employers</span>
          <span className="rounded-full bg-green-200 px-3 py-1 text-sm font-semibold text-green-900">
            {stats.verifiedEmployers}
          </span>
        </div>

        {/* New This Week */}
        <div className="flex items-center justify-between">
          <span className="text-gray-700">New This Week</span>
          <span className="rounded-full bg-purple-200 px-3 py-1 text-sm font-semibold text-purple-900">
            {stats.newThisWeek}
          </span>
        </div>
      </div>
    </div>
  )
}