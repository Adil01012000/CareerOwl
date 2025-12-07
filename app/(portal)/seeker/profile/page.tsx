import { createClient } from '@/utils/supabase/server'
import { SeekerProfileForm } from './components/SeekerProfileForm'

export default async function SeekerProfilePage() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return <div>Unauthorized</div>
  }

  // Fetch applicant profile
  const { data: applicantProfile, error } = await supabase
    .from('applicant_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error && error.code !== 'PGRST116') {
    // PGRST116 is "not found" - that's okay, profile might not exist yet
    console.error('Error fetching applicant profile:', error)
  }

  // Type assertion to ensure proper typing for the component
  let profileData: Record<string, unknown> | null = applicantProfile as Record<string, unknown> | null
  
  // Add user email to profile data
  if (profileData) {
    profileData.email = user.email
  } else {
    profileData = { email: user.email }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-dark">My Profile</h1>
          <p className="mt-2 text-gray-600">
            Build your professional profile to match with opportunities
          </p>
        </div>
      </div>

      <SeekerProfileForm initialData={profileData || { email: user.email }} />
    </div>
  )
}

