'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CompanyProfileResult {
  error?: string
  success?: boolean
  message?: string
}

export async function updateCompanyProfile(
  formData: FormData
): Promise<CompanyProfileResult> {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get company profile ID - we'll need to link it to the user
  // For now, we'll use a simple approach: get or create profile
  // Note: company_profiles table exists but types may not be regenerated yet
  const { data: existingProfile } = await supabase
    .from('company_profiles' as any)
    .select('id')
    .eq('id', user.id)
    .single()

  // Extract form data
  const profileData: Record<string, unknown> = {
    legal_business_name: formData.get('legal_business_name') as string || null,
    trade_name: formData.get('trade_name') as string || null,
    cra_business_number: formData.get('cra_business_number') as string || null,
    year_founded: formData.get('year_founded') ? parseInt(formData.get('year_founded') as string) : null,
    website_url: formData.get('website_url') as string || null,
    headquarters_address: formData.get('headquarters_address') as string || null,
    primary_contact_email: formData.get('primary_contact_email') as string || null,
    primary_phone: formData.get('primary_phone') as string || null,
    company_description: formData.get('company_description') as string || null,
    business_type: formData.get('business_type') as string || null,
    company_size: formData.get('company_size') as string || null,
    annual_revenue: formData.get('annual_revenue') as string || null,
    no_of_locations: formData.get('no_of_locations') ? parseInt(formData.get('no_of_locations') as string) : null,
    ownership_model: formData.get('ownership_model') as string || null,
    primary_industry: formData.get('primary_industry') as string || null,
    naics_code: formData.get('naics_code') as string || null,
    primary_products: formData.get('primary_products') as string || null,
    actively_hiring: formData.get('actively_hiring') as string || null,
    annual_hiring_volume: formData.get('annual_hiring_volume') as string || null,
    applicant_tracking_system: formData.get('applicant_tracking_system') as string || null,
    dress_code: formData.get('dress_code') as string || null,
    health_benefits: formData.get('health_benefits') as string || null,
    retirement_plans: formData.get('retirement_plans') as string || null,
    paid_time_off: formData.get('paid_time_off') ? parseInt(formData.get('paid_time_off') as string) : null,
    flexible_hours: formData.get('flexible_hours') as string || null,
    relocation_assistance: formData.get('relocation_assistance') as string || null,
    lmia_employer: formData.get('lmia_employer') as string || null,
    designated_learning_institution: formData.get('designated_learning_institution') === 'true',
    dli_number: formData.get('dli_number') ? parseInt(formData.get('dli_number') as string) : null,
    recognized_employer_pilot: formData.get('recognized_employer_pilot') as string || null,
    glassdoor_rating: formData.get('glassdoor_rating') ? parseFloat(formData.get('glassdoor_rating') as string) : null,
    indeed_rating: formData.get('indeed_rating') ? parseFloat(formData.get('indeed_rating') as string) : null,
    awards_and_recognition: formData.get('awards_and_recognition') as string || null,
  }

  // Handle JSONB fields
  const additionalLocation = formData.get('additional_location')
  if (additionalLocation) {
    try {
      profileData.additional_location = JSON.parse(additionalLocation as string)
    } catch {
      // Invalid JSON, skip
    }
  }

  // Handle target client segments from checkboxes
  const targetClientSegments: Record<string, boolean> = {}
  const segments = ['b2b', 'b2c', 'government', 'nonprofit', 'internal', 'other']
  segments.forEach((segment) => {
    const value = formData.get(`target_segment_${segment}`)
    targetClientSegments[segment] = value === 'true'
  })
  profileData.target_client_segment = targetClientSegments

  // Handle work model from checkboxes
  const workModelData: Record<string, boolean> = {}
  const workModelOptions = ['onsite', 'remote_first', 'hybrid', 'remote_optional']
  workModelOptions.forEach((option) => {
    const value = formData.get(`work_model_${option}`)
    workModelData[option] = value === 'true'
  })
  profileData.work_model = workModelData

  // Handle diversity policies from checkboxes
  const diversityPoliciesData: Record<string, boolean> = {}
  const diversityOptions = ['dei_policy', 'pay_equity_audits', 'none', 'employee_resource_groups', 'accessibility_plan']
  diversityOptions.forEach((option) => {
    const value = formData.get(`diversity_${option}`)
    diversityPoliciesData[option] = value === 'true'
  })
  profileData.diversity_policies = diversityPoliciesData

  // Handle company values from checkboxes
  const companyValuesList: string[] = []
  const valueOptions = [
    { key: 'integrity', label: 'Integrity' },
    { key: 'collaboration', label: 'Collaboration' },
    { key: 'innovation', label: 'Innovation' },
    { key: 'sustainability', label: 'Sustainability' },
    { key: 'impact', label: 'Impact' },
    { key: 'other', label: 'Other' }
  ]
  valueOptions.forEach((option) => {
    const value = formData.get(`company_value_${option.key}`)
    if (value === 'true') {
      companyValuesList.push(option.label)
    }
  })
  profileData.company_values = { values: companyValuesList }

  // Handle remote work support from checkboxes
  const remoteWorkSupportData: Record<string, boolean> = {}
  const remoteWorkOptions = ['stipend', 'equipment', 'none']
  remoteWorkOptions.forEach((option) => {
    const value = formData.get(`remote_work_${option}`)
    remoteWorkSupportData[option] = value === 'true'
  })
  profileData.remote_work_support = remoteWorkSupportData

  // Handle learning & development from checkboxes
  const learningDevPrograms: string[] = []
  const learningOptions = [
    { key: 'tuition_aid', label: 'Tuition Aid' },
    { key: 'conferences', label: 'Conferences' },
    { key: 'internal_programs', label: 'Internal Programs' },
    { key: 'dedicated_time', label: 'Dedicated Time' },
    { key: 'none', label: 'None' }
  ]
  learningOptions.forEach((option) => {
    const value = formData.get(`learning_${option.key}`)
    if (value === 'true') {
      learningDevPrograms.push(option.label)
    }
  })
  profileData.learning_and_development = { programs: learningDevPrograms }

  // Handle environmental certifications from checkboxes
  const envCertifications: string[] = []
  const envCertOptions = [
    { key: 'b_corp', label: 'B Corp' },
    { key: 'net_zero_pledge', label: 'Net Zero Pledge' },
    { key: 'iso_14001', label: 'Iso 14001' },
    { key: 'none', label: 'None' }
  ]
  envCertOptions.forEach((option) => {
    const value = formData.get(`env_cert_${option.key}`)
    if (value === 'true') {
      envCertifications.push(option.label)
    }
  })
  profileData.environmental_certification = { certifications: envCertifications, initiatives: [] }

  // Handle community involvement from checkboxes
  const communityData: Record<string, boolean> = {}
  const communityOptions = ['volunteering', 'sponsorships', 'donations', 'local_sourcing']
  communityOptions.forEach((option) => {
    const value = formData.get(`community_${option}`)
    communityData[option] = value === 'true'
  })
  profileData.community_involvement = communityData

  // Update or insert
  // Note: company_profiles table exists but types may not be regenerated yet
  let result
  if (existingProfile) {
    result = await supabase
      .from('company_profiles' as any)
      .update(profileData)
      .eq('id', user.id)
  } else {
    result = await supabase
      .from('company_profiles' as any)
      .insert({ id: user.id, ...profileData })
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath('/employer/company')
  return { success: true, message: 'Company profile updated successfully' }
}

