'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export interface RecruiterProfileResult {
  error?: string
  success?: boolean
  message?: string
}

export async function updateRecruiterProfile(
  formData: FormData
): Promise<RecruiterProfileResult> {
  const supabase = await createClient()

  // Get current user
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (userError || !user) {
    return { error: 'Unauthorized' }
  }

  // Get recruiter profile
  const { data: existingProfile } = await supabase
    .from('recruiter_profile')
    .select('id')
    .eq('id', user.id)
    .single()

  // Extract form data
  const profileData: Record<string, unknown> = {
    // Professional Designation fields
    professional_designation: formData.get('professional_designation') as string || null,
    name_of_regulatory_body: formData.get('name_of_regulatory_body') as string || null,
    registration_number: formData.get('registration_number') as string || null,
    registration_expiry_date: formData.get('registration_expiry_date') as string || null,
    
    // Business Information fields
    legal_business_name: formData.get('legal_business_name') as string || null,
    trade_name: formData.get('trade_name') as string || null,
    cra_business_number: formData.get('cra_business_number') as string || null,
    primary_contact_email: formData.get('primary_contact_email') as string || null,
    primary_phone: formData.get('primary_phone') as string || null,
    headquarters_address: formData.get('headquarters_address') as string || null,
    website_url: formData.get('website_url') as string || null,
    years_in_business: formData.get('years_in_business') ? parseInt(formData.get('years_in_business') as string) : null,
    description: formData.get('description') as string || null,
    
    // Provincial Registration fields
    is_operating_in_provinces: formData.get('is_operating_in_provinces') === 'true',
  }

  // Handle operational provinces (from checkboxes)
  const operationalProvinces: string[] = []
  const provinces = ['ontario', 'british_columbia', 'alberta', 'saskatchewan', 'manitoba']
  provinces.forEach((province) => {
    if (formData.get(`province_${province}`) === 'true') {
      operationalProvinces.push(province)
    }
  })
  profileData.operational_provinces = operationalProvinces.length > 0 ? operationalProvinces : null

  // Handle registration documents per province
  const registrationDocs: Record<string, string> = {}
  provinces.forEach((province) => {
    const file = formData.get(`registration_doc_${province}`) as File | null
    if (file && file.size > 0) {
      // TODO: Upload to Supabase Storage and store URL
      // For now, store file name as placeholder
      registrationDocs[province] = file.name
    }
  })
  profileData.registration_documents = Object.keys(registrationDocs).length > 0 ? registrationDocs : null

  // Handle primary industries (comma-separated to JSONB array)
  const industriesInput = formData.get('primary_industries') as string || ''
  if (industriesInput.trim()) {
    const industriesArray = industriesInput
      .split(',')
      .map(i => i.trim())
      .filter(i => i.length > 0)
    profileData.primary_industries = industriesArray.length > 0 ? industriesArray : null
  } else {
    profileData.primary_industries = null
  }

  // Handle NOC codes (comma-separated to JSONB array)
  const nocCodesInput = formData.get('noc_codes') as string || ''
  if (nocCodesInput.trim()) {
    const nocCodesArray = nocCodesInput
      .split(',')
      .map(c => c.trim())
      .filter(c => c.length > 0)
    profileData.noc_codes = nocCodesArray.length > 0 ? nocCodesArray : null
  } else {
    profileData.noc_codes = null
  }
  
  // Handle file uploads (proof of registration, logo, documents)
  // Note: File uploads should be handled separately via Supabase Storage
  // For now, we'll just store the file names/references
  const proofOfRegistration = formData.get('proof_of_registration') as File | null
  const logo = formData.get('logo') as File | null
  const registrationDocument = formData.get('registration_document') as File | null
  const licenseDocument = formData.get('license_document') as File | null
  
  // TODO: Upload files to Supabase Storage and store URLs
  // if (proofOfRegistration && proofOfRegistration.size > 0) {
  //   // Upload to storage and get URL
  // }

  // Update or insert
  let result
  if (existingProfile) {
    result = await supabase
      .from('recruiter_profile')
      .update(profileData)
      .eq('id', user.id)
  } else {
    result = await supabase
      .from('recruiter_profile')
      .insert({ id: user.id, ...profileData })
  }

  if (result.error) {
    return { error: result.error.message }
  }

  revalidatePath('/recruiter/profile')
  return { success: true, message: 'Profile updated successfully' }
}

