import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import { Footer } from '@/components/Footer'
import { Header } from '@/components/Header'

export default function HomePage() {
  return (
    <> <Header />
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primary-dark py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-4 text-5xl font-bold">
            Find Your Next Career in Canada
          </h1>
          <p className="mb-8 text-xl opacity-90">
            A premium job site built by CareerOwl for verified Canadian Employers and Recruiters
          </p>
          
          {/* Quick Search Bar */}
          <div className="mx-auto max-w-2xl">
            <div className="flex gap-2 rounded-lg bg-white p-2">
              <input
                type="text"
                placeholder="Job title, keywords, or company..."
                className="flex-1 px-4 py-2 text-gray-900 outline-none"
              />
              <Button className="bg-primary hover:bg-primary-dark">
                <Search className="mr-2 h-5 w-5" />
                Search Jobs
              </Button>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-8 flex justify-center gap-8 text-sm">
            <span>✓ Canadian Employers Only</span>
            <span>✓ All Employers Verified</span>
            <span>✓ More Supports for Teams</span>
          </div>
        </div>
      </section>

      {/* Quick Job Listings Preview */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center text-3xl font-bold text-dark">
            Featured Opportunities
          </h2>
          
          <div className="mb-8 text-center">
            <p className="text-gray-600">
              Sample jobs will appear here. Full job board coming soon.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center gap-4">
            <Link href="/jobs">
              <Button variant="outline" size="lg">
                Browse All Jobs
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary" size="lg">
                Create Account
              </Button>
            </Link>
            <Link href="/employer/register">
              <Button className="bg-accent" size="lg">
                Post a Job
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div> 
    <Footer />
    </>
    )
}