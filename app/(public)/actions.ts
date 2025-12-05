'use server'

import { createClient } from '@/utils/supabase/server'

export interface JobSearchParams {
  search?: string
  province?: string
  employmentType?: string
  minSalary?: number
  page?: number
  perPage?: number
}

export interface JobSearchResult {
  jobs: Array<{
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
  }>
  total: number
  error?: string
}

export async function searchJobs(params: JobSearchParams): Promise<JobSearchResult> {
  const supabase = await createClient()
  
  const {
    search = '',
    province,
    employmentType,
    minSalary,
    page = 1,
    perPage = 25
  } = params

  let query = supabase
    .from('job_posts')
    .select(`
      id,
      title,
      location_city,
      location_province,
      employment_type,
      salary_min,
      salary_max,
      salary_type,
      tracking_number,
      created_at,
      is_esdc_compliant,
      employer_profiles!inner (
        legal_business_name,
        company_logo_url,
        document_verification_status
      )
    `, { count: 'exact' })
    .eq('status', 'published')

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description_html.ilike.%${search}%`)
  }

  if (province) {
    query = query.eq('location_province', province)
  }

  if (employmentType) {
    query = query.eq('employment_type', employmentType)
  }

  if (minSalary) {
    query = query.gte('salary_min', minSalary)
  }

  // Sorting and pagination
  const offset = (page - 1) * perPage
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Job search error:', error)
    return { jobs: [], total: 0, error: error.message }
  }

  return { jobs: data || [], total: count || 0 }
}

export interface QuickStats {
  activeJobs: number
  verifiedEmployers: number
  newThisWeek: number
}

export async function getQuickStats(): Promise<QuickStats> {
  const supabase = await createClient()

  // Active Jobs
  const { count: activeJobs } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Verified Employers (with published jobs)
  const { data: verifiedEmployers } = await supabase
    .from('job_posts')
    .select('employer_id, employer_profiles!inner(document_verification_status)')
    .eq('status', 'published')
    .eq('employer_profiles.document_verification_status', 'verified')

  const uniqueEmployers = new Set(verifiedEmployers?.map(j => j.employer_id) || []).size

  // New This Week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { count: newThisWeek } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('created_at', weekAgo.toISOString())

  return {
    activeJobs: activeJobs || 0,
    verifiedEmployers: uniqueEmployers,
    newThisWeek: newThisWeek || 0
  }
}

