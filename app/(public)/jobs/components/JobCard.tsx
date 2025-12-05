import { MapPin, Briefcase, DollarSign, Globe, Clock, FileText, ShieldCheck, Building2 } from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface JobCardProps {
  job: {
    id: string
    title: string
    location_city: string | null
    location_province: string | null
    employment_type: string | null
    salary_min: number | null
    salary_max: number | null
    salary_type: string | null
    tracking_number: number
    created_at: string | null
    is_esdc_compliant: boolean | null
    employer_profiles: {
      legal_business_name: string | null
      company_logo_url: string | null
      document_verification_status: 'pending' | 'verified' | 'rejected' | null
    }
  }
}

export function JobCard({ job }: JobCardProps) {
  const isVerified = job.employer_profiles.document_verification_status === 'verified'
  
  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return null
    
    const suffix = job.salary_type === 'hourly' ? '/hr' : '/yr'
    
    if (job.salary_min && job.salary_max) {
      const min = job.salary_type === 'hourly' 
        ? `$${job.salary_min}` 
        : `$${job.salary_min.toLocaleString()}`
      const max = job.salary_type === 'hourly'
        ? `$${job.salary_max}`
        : `$${job.salary_max.toLocaleString()}`
      return `${min} - ${max} ${suffix}`
    }
    
    return null
  }

  // Format location
  const location = job.location_city 
    ? `${job.location_city}, ${job.location_province}`
    : job.location_province

  // Posted date
  const postedDate = job.created_at 
    ? formatDistanceToNow(new Date(job.created_at), { addSuffix: false })
    : 'Recently'

  // Mock skills (based on image context)
  const skills = ['SQL', 'Python', 'Tableau', 'Excel']

  return (
    <div className="group flex w-full flex-col rounded-2xl border-2 border-transparent bg-white p-6 shadow-sm transition-all hover:border-[#6B2D5B] hover:shadow-md ring-1 ring-gray-200 hover:ring-0">
      
      {/* --- Header Section: Logo, Title, Badges --- */}
      <div className="mb-6 flex items-start gap-5">
        {/* Logo Box */}
        <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#854d70]">
          {job.employer_profiles.company_logo_url ? (
            <img
              src={job.employer_profiles.company_logo_url}
              alt={job.employer_profiles.legal_business_name || 'Company'}
              className="h-full w-full object-cover"
            />
          ) : (
            <Building2 className="h-7 w-7 text-white opacity-90" />
          )}
        </div>

        {/* Title & Company */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-[#4A1D3E] group-hover:text-[#6B2D5B] transition-colors">
            {job.title}
          </h3>
          <p className="font-medium text-gray-600 mb-2">
            {job.employer_profiles.legal_business_name || 'Company Name'}
          </p>

          {/* Badges Row */}
          <div className="flex flex-wrap items-center gap-2">
            {isVerified && (
              <span className="inline-flex items-center gap-1.5 rounded-md bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 ring-1 ring-inset ring-green-600/20">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </span>
            )}
            <span className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
              JOB-{job.tracking_number.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* --- Grid Section: Location, Salary, Type, Remote --- */}
      <div className="mb-6 grid grid-cols-1 gap-y-3 md:grid-cols-2">
        {/* Location */}
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-[#854d70]" />
          <span>{location}</span>
        </div>

        {/* Salary */}
        <div className="flex items-center gap-2.5 text-sm font-semibold text-green-600">
          <DollarSign className="h-4 w-4 shrink-0" />
          <span>{formatSalary() || 'Salary not disclosed'}</span>
        </div>

        {/* Employment Type */}
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Briefcase className="h-4 w-4 shrink-0 text-[#854d70]" />
          <span>{job.employment_type}</span>
        </div>

        {/* Remote/Hybrid */}
        <div className="flex items-center gap-2.5 text-sm text-gray-500">
          <Globe className="h-4 w-4 shrink-0 text-[#854d70]" />
          <span>Remote</span>
        </div>
      </div>

      {/* --- Skills Section --- */}
      <div className="mb-6 flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="rounded-md border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* Divider */}
      <div className="mt-auto h-px w-full bg-gray-100 mb-4"></div>

      {/* --- Footer Section: Date & Button --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
          <Clock className="h-3.5 w-3.5" />
          <span>Posted {postedDate}</span>
        </div>

        <Link
          href={`/jobs/${job.id}`}
          className="rounded-lg bg-[#5b2148] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#4a1b3a] focus:outline-none focus:ring-2 focus:ring-[#5b2148] focus:ring-offset-2"
        >
          View Details
        </Link>
      </div>
    </div>
  )
}