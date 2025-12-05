import { searchJobs, type JobSearchParams } from '@/app/(public)/actions'
import { JobCard } from './JobCard'

interface JobListingsProps {
  searchParams: JobSearchParams
}

export const JobListings = async ({ searchParams }: JobListingsProps) => {
  const result = await searchJobs(searchParams)
  const { jobs, total } = result

  const start = ((searchParams.page || 1) - 1) * (searchParams.perPage || 25) + 1
  const end = Math.min(start + jobs.length - 1, total)

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-gray-600">
          Showing {start}-{end} of {total}
        </div>
        <div className="flex items-center gap-4">
          {/* Sort and per-page controls can be added here later */}
        </div>
      </div>

      {/* Job Cards Grid */}
      {jobs.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
          <p className="text-lg text-gray-600">No jobs found matching your criteria.</p>
          <p className="mt-2 text-sm text-gray-500">
            Try adjusting your search filters or check back later.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

