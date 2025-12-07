import { PortalHeader } from '@/components/PortalHeader'
import { PortalSidebar } from '@/components/PortalSidebar'
import { createClient } from '@/utils/supabase/server'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Middleware already checked auth, so this should always succeed
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    // This should never happen if middleware works
    throw new Error('Unauthorized - middleware failed')
  }

  // Get role from metadata (fast) or profiles table (fallback)
  let role = user.user_metadata?.role as 'job_seeker' | 'employer' | 'recruiter' | 'advertiser' | 'esdc_officer' | 'admin' | undefined
  let email = user.email || ''

  // Fallback: Query profiles if metadata is missing
  if (!role) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, email')
      .eq('id', user.id)
      .single()
    
    role = profile?.role
    email = profile?.email || email
  }

  if (!role) {
    throw new Error('User has no role assigned')
  }

  const roleName = role === 'job_seeker' ? 'Job Seeker' : 
                   role === 'employer' ? 'Employer' :
                   role === 'recruiter' ? 'Recruiter' :
                   role === 'advertiser' ? 'Advertiser' :
                   role === 'esdc_officer' ? 'ESDC Officer' : 'Admin'

  return (
    <div className="flex h-screen flex-col">
      <PortalHeader userEmail={email} roleName={roleName} />
      
      <div className="flex flex-1 overflow-hidden">
        <PortalSidebar role={role} />
        
        <main className="flex-1 overflow-y-auto bg-gray-50 p-8">
          {children}
        </main>
      </div>
    </div>
  )
}