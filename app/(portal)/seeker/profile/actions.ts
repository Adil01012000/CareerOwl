'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface SeekerProfileResult {
  error?: string
  success?: boolean
  message?: string
}

export async function updateSeekerProfile(
  formData: FormData
): Promise<SeekerProfileResult> {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get applicant profile
  const { data: existingProfile } = await supabase
    .from('applicant_profiles')
    .select('id')
    .eq('id', user.id)
    .single()

  // Extract form data
  const profileData: Record<string, unknown> = {
    // Personal Information
    title: formData.get('title') as string || null,
    pronouns: formData.get('pronouns') as string || null,
    legal_first_name: formData.get('legal_first_name') as string || null,
    middle_name: formData.get('middle_name') as string || null,
    legal_last_name: formData.get('legal_last_name') as string || null,
    preferred_name: formData.get('preferred_name') as string || null,
    phone_number: formData.get('phone_number') as string || null,
    
    // Profile Photo
    show_profile_photo: formData.get('show_profile_photo_publicly') === 'on',
    
    // Location
    city: formData.get('city') as string || null,
    province: formData.get('province') as string || null,
    postal_code: formData.get('postal_code') as string || null,
    country_id: formData.get('country_id') ? parseInt(formData.get('country_id') as string) : null,
    
    // Demographic Information
    date_of_birth: formData.get('date_of_birth') as string || null,
    gender: formData.get('gender') as string || null,
    ethnicity: formData.get('ethnicity') as string || null,
    veteran_status: formData.get('veteran_status') as string || null,
    disability_status: formData.get('disability_status') as string || null,
    
    // Professional Links
    linkedin_url: formData.get('linkedin_url') as string || null,
    portfolio: formData.get('portfolio') as string || null,
    github_url: formData.get('github_url') as string || null,
    
    // Additional Email Addresses (JSONB)
    additional_email_addresses: formData.get('additional_email_addresses') 
      ? JSON.parse(formData.get('additional_email_addresses') as string)
      : null,
    
    // Work Authorization
    work_status: formData.get('work_status') as string || null,
    
    // Role Tab Fields
    target_job_titles: formData.get('target_job_titles')
      ? JSON.parse(formData.get('target_job_titles') as string)
      : null,
    primary_noc_code: formData.get('primary_noc_code') as string || null,
    seniority_level: formData.get('seniority_level') as string || null,
    employment_type: formData.get('employment_type')
      ? JSON.parse(formData.get('employment_type') as string)
      : null,
    work_setting_preference: formData.get('work_setting_preference')
      ? JSON.parse(formData.get('work_setting_preference') as string)
      : null,
    
    // Location Tab Fields
    relocation_willingness: formData.get('relocation_willingness') as string || null,
    max_commute_time: formData.get('max_commute_time') ? parseInt(formData.get('max_commute_time') as string) : null,
    travel_willingness: formData.get('travel_willingness') as string || null,
    driver_license_class: formData.get('driver_license_class')
      ? JSON.parse(formData.get('driver_license_class') as string)
      : null,
    personal_vehicle: formData.get('personal_vehicle') as string || null,
    
    // Availability Tab Fields
    earliest_start_date: formData.get('earliest_start_date') as string || null,
    notice_period: formData.get('notice_period') as string || null,
    weekly_availability: formData.get('weekly_availability')
      ? JSON.parse(formData.get('weekly_availability') as string)
      : null,
    shift_flexibility: formData.get('shift_flexibility')
      ? JSON.parse(formData.get('shift_flexibility') as string)
      : null,
    
    // Compensation Tab Fields
    salary_expectation: formData.get('salary_expectation') ? parseInt(formData.get('salary_expectation') as string) : null,
    salary_type: formData.get('salary_type') as string || null,
    currency: formData.get('currency') as string || null,
    minimum_acceptable_offer: formData.get('minimum_acceptable_offer') ? parseInt(formData.get('minimum_acceptable_offer') as string) : null,
    compensation_types: formData.get('compensation_types')
      ? JSON.parse(formData.get('compensation_types') as string)
      : null,
    
    // Skills Tab Fields
    years_of_experience: formData.get('years_of_experience') ? parseInt(formData.get('years_of_experience') as string) : null,
    core_skills: formData.get('core_skills')
      ? JSON.parse(formData.get('core_skills') as string)
      : null,
    tools_and_technologies: formData.get('tools_and_technologies')
      ? JSON.parse(formData.get('tools_and_technologies') as string)
      : null,
    industry_experience: formData.get('industry_experience')
      ? JSON.parse(formData.get('industry_experience') as string)
      : null,
    people_leadership: formData.get('people_leadership') as string || null,
    budget_responsibility: formData.get('budget_responsibility') as string || null,
    accomplishments: formData.get('accomplishments')
      ? JSON.parse(formData.get('accomplishments') as string)
      : null,
    
    // Preferences Tab Fields
    team_environment: formData.get('team_environment') as string || null,
    management_style: formData.get('management_style') as string || null,
    company_size: formData.get('company_size') as string || null,
    js_references: formData.get('js_references') as string || null,
    values_and_motivators: formData.get('values_and_motivators')
      ? JSON.parse(formData.get('values_and_motivators') as string)
      : null,
    compliance_and_consent: formData.get('compliance_and_consent')
      ? JSON.parse(formData.get('compliance_and_consent') as string)
      : null,
    
    // Regulatory Tab Fields
    is_occupation_regulated: formData.get('is_occupation_regulated') as string || null,
    regulatory_status: formData.get('regulatory_status') as string || null,
    regulatory_body_name: formData.get('regulatory_body_name') as string || null,
    regulator_website_url: formData.get('regulator_website_url') as string || null,
    
    // Target Groups Fields
    is_person_with_disability: formData.get('is_person_with_disability') === 'on',
    is_newcomer_to_canada: formData.get('is_newcomer_to_canada') === 'on',
    year_arrived_in_canada: formData.get('year_arrived_in_canada') ? parseInt(formData.get('year_arrived_in_canada') as string) : null,
    is_youth: formData.get('is_youth') === 'on',
    is_veteran_of_caf: formData.get('is_veteran_of_caf') === 'on',
    branch_of_service: formData.get('branch_of_service') as string || null,
    is_indigenous_person: formData.get('is_indigenous_person') === 'on',
    community_or_nation: formData.get('community_or_nation') as string || null,
    is_mature_worker: formData.get('is_mature_worker') === 'on',
    is_member_of_visible_minority: formData.get('is_member_of_visible_minority') === 'on',
  }
  
  // Handle file uploads (profile photo and ID documents)
  // Note: File uploads should be handled separately via Supabase Storage
  // For now, we'll just store the file names/references
  const profilePhoto = formData.get('profile_photo') as File | null
  const idDocument1 = formData.get('id_document_1') as File | null
  const idDocument2 = formData.get('id_document_2') as File | null
  
  // TODO: Upload files to Supabase Storage and store URLs
  // if (profilePhoto && profilePhoto.size > 0) {
  //   // Upload to storage and get URL
  // }
  // if (idDocument1 && idDocument1.size > 0) {
  //   // Upload to storage and get URL
  // }
  // if (idDocument2 && idDocument2.size > 0) {
  //   // Upload to storage and get URL
  // }

  // Handle target group checkboxes
  const targetGroups = [
    'is_newcomer',
    'is_veteran',
    'is_person_with_disability',
    'is_indigenous',
    'is_youth',
    'is_mature_worker',
    'is_visible_minority'
  ]
  
  targetGroups.forEach((group) => {
    profileData[group] = formData.get(group) === 'on'
  })

  // Update or insert
  let result
  if (existingProfile) {
    result = await supabase
      .from('applicant_profiles')
      .update(profileData)
      .eq('id', user.id)
  } else {
    result = await supabase
      .from('applicant_profiles')
      .insert({ id: user.id, ...profileData })
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath('/seeker/profile')
  return { success: true, message: 'Profile updated successfully' }
}

