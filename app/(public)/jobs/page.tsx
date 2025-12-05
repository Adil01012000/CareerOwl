import { Shield } from 'lucide-react'
import Link from 'next/link'
import { SearchBar } from './components/SearchBar'
import { QuickStats } from './components/QuickStats'
import { JobListings } from './components/JobListings'
import { type JobSearchParams } from '../actions'

interface JobsPageProps {
  searchParams: Promise<{
    search?: string
    province?: string
    employmentType?: string
    minSalary?: string
    page?: string
    perPage?: string
  }>
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams

  const searchParamsFormatted: JobSearchParams = {
    search: params.search,
    province: params.province,
    employmentType: params.employmentType,
    minSalary: params.minSalary ? Number(params.minSalary) : undefined,
    page: params.page ? Number(params.page) : 1,
    perPage: params.perPage ? Number(params.perPage) : 25,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Find Your Next Career in Canada
          </h1>
          <p className="mb-8 text-xl opacity-90">
            A premium job site built by CareerOwl for verified Canadian Employers
            and Recruiters
          </p>

          {/* Search Bar */}
          <SearchBar />

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
            <span>✓ Canadian Employers Only</span>
            <span>✓ All Employers Verified</span>
            <span>✓ More Supports for Teams</span>
          </div>
        </div>
      </section>

      {/* Info Bar */}
      <section className="border-b bg-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-sm text-gray-600">
              CareerOwl: Clean, Clear & Safe - All employers verified • Canadian
              businesses only • Zero tolerance for fraud
            </span>
            <Link
              href="/safety"
              className="text-sm text-primary hover:underline"
            >
              Learn more about our safety measures →
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Left Sidebar - Quick Stats */}
          <aside className="lg:col-span-1">
            <div className="sticky top-4">
              <QuickStats />
            </div>
          </aside>

          {/* Main Content - Job Listings */}
          <main className="lg:col-span-3">
            <JobListings searchParams={searchParamsFormatted} />
          </main>
        </div>
      </section>
    </div>
  )
}

