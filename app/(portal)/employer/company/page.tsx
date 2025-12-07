import { createClient } from '@/utils/supabase/server'
import { CompanyProfileForm } from './components/CompanyProfileForm'
import { Badge } from '@/components/ui/badge'
import { CheckCircle2, XCircle, Clock } from 'lucide-react'

export default async function CompanyProfilePage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Unauthorized</div>
  }

  // Fetch company profile from the new company_profiles table
  // Note: company_profiles table exists but types may not be regenerated yet
  const { data: companyProfile, error } = await supabase
    .from('company_profiles' as any)
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, profile might not exist yet
    console.error('Error fetching company profile:', error)
  }

  // Type assertion to ensure proper typing for the component
  const profileData: Record<string, unknown> | null = companyProfile as Record<string, unknown> | null

  // Get verification status from employer_profiles (if it exists)
  const { data: employerProfile } = await supabase
    .from('employer_profiles')
    .select('document_verification_status')
    .eq('id', user.id)
    .single()

  const verificationStatus = employerProfile?.document_verification_status

  // Get verification status badge
  const getVerificationBadge = () => {
    if (verificationStatus === 'verified') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      )
    }
    if (verificationStatus === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        <Clock className="mr-1 h-3 w-3" />
        Pending
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Company Profile</h1>
          <p className="mt-2 text-gray-600">
            Manage your company information and build your employer brand
          </p>
        </div>
        {verificationStatus && getVerificationBadge()}
      </div>

      {/* {verificationStatus !== 'verified' && (
        <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> You must be verified before you can post jobs.
            Please ensure all required documents are uploaded and submitted for review.
          </p>
        </div>
      )} */}

      <CompanyProfileForm 
        initialData={profileData} 
        verificationStatus={verificationStatus || undefined}
      />
    </div>
  )
}
