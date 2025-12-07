import { createClient } from '@/utils/supabase/server'
import { RecruiterProfileForm } from './components/RecruiterProfileForm'

export default async function RecruiterProfilePage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Unauthorized</div>
  }

  // Fetch recruiter profile
  const { data: recruiterProfile, error } = await supabase
    .from('recruiter_profile')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, profile might not exist yet
    console.error('Error fetching recruiter profile:', error)
  }

  // Type assertion to ensure proper typing for the component
  const profileData: Record<string, unknown> | null = recruiterProfile as Record<string, unknown> | null

  // Get verification status (this would come from a verification table or metadata)
  // For now, we'll use placeholder values based on the design
  const verificationStatus = {
    businessVerification: 'verified' as 'verified' | 'pending' | 'rejected',
    professionalStatus: 'pending' as 'verified' | 'pending' | 'rejected',
    provincialRegistration: 'rejected' as 'verified' | 'pending' | 'rejected' | 'not_required',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">Recruiter Profile</h1>
          <p className="mt-2 text-gray-600">
            Build your recruiter brand and verify your credentials
          </p>
        </div>
      </div>

      <RecruiterProfileForm 
        initialData={profileData} 
        verificationStatus={verificationStatus}
      />
    </div>
  )
}

