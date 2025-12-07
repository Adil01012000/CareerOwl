'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  User,
  Shield,
  Zap,
  Lock,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Info,
  Calendar,
  Mail,
  Key,
  AlertTriangle,
  Plus,
  X,
  MapPin,
  Globe,
  Search,
  ExternalLink
} from 'lucide-react'
import { updateSeekerProfile } from '../actions'
import { cn } from '@/lib/utils'

interface SeekerProfileFormProps {
  initialData: Record<string, unknown> | null
}

const tabs = [
  { id: 'personal', label: 'Personal' },
  { id: 'work_auth', label: 'Work Auth' },
  { id: 'role', label: 'Role' },
  { id: 'location', label: 'Location' },
  { id: 'availability', label: 'Availability' },
  { id: 'compensation', label: 'Compensation' },
  { id: 'skills', label: 'Skills' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'regulatory', label: 'Regulatory' },
  { id: 'target_groups', label: 'Target Groups' },
]

export function SeekerProfileForm({ initialData }: SeekerProfileFormProps) {
  const [activeTab, setActiveTab] = useState('personal')
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)
  const [workStatus, setWorkStatus] = useState<string>(initialData?.work_status as string || '')
  
  // State for additional emails
  const getInitialEmails = (): Array<{ email: string; label: string }> => {
    if (!initialData?.additional_email_addresses) return []
    try {
      const emails = initialData.additional_email_addresses
      if (Array.isArray(emails)) {
        return emails as Array<{ email: string; label: string }>
      }
      if (typeof emails === 'string') {
        return JSON.parse(emails)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [additionalEmails, setAdditionalEmails] = useState<Array<{ email: string; label: string }>>(
    getInitialEmails()
  )

  // State for target job titles
  const getInitialJobTitles = (): string[] => {
    if (!initialData?.target_job_titles) return []
    try {
      const titles = initialData.target_job_titles
      if (Array.isArray(titles)) {
        return titles as string[]
      }
      if (typeof titles === 'string') {
        return JSON.parse(titles)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [targetJobTitles, setTargetJobTitles] = useState<string[]>(getInitialJobTitles())
  const [newJobTitle, setNewJobTitle] = useState('')

  // State for employment type checkboxes
  const getInitialEmploymentType = (): string[] => {
    if (!initialData?.employment_type) return []
    try {
      const types = initialData.employment_type
      if (Array.isArray(types)) {
        return types as string[]
      }
      if (typeof types === 'string') {
        return JSON.parse(types)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [employmentType, setEmploymentType] = useState<string[]>(getInitialEmploymentType())

  // State for work setting preference checkboxes
  const getInitialWorkSetting = (): string[] => {
    if (!initialData?.work_setting_preference) return []
    try {
      const settings = initialData.work_setting_preference
      if (Array.isArray(settings)) {
        return settings as string[]
      }
      if (typeof settings === 'string') {
        return JSON.parse(settings)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [workSettingPreference, setWorkSettingPreference] = useState<string[]>(getInitialWorkSetting())

  // State for driver's license class checkboxes
  const getInitialDriverLicense = (): string[] => {
    if (!initialData?.driver_license_class) return []
    try {
      const classes = initialData.driver_license_class
      if (Array.isArray(classes)) {
        return classes as string[]
      }
      if (typeof classes === 'string') {
        return JSON.parse(classes)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [driverLicenseClass, setDriverLicenseClass] = useState<string[]>(getInitialDriverLicense())

  // State for weekly availability checkboxes
  const getInitialWeeklyAvailability = (): string[] => {
    if (!initialData?.weekly_availability) return []
    try {
      const availability = initialData.weekly_availability
      if (Array.isArray(availability)) {
        return availability as string[]
      }
      if (typeof availability === 'string') {
        return JSON.parse(availability)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [weeklyAvailability, setWeeklyAvailability] = useState<string[]>(getInitialWeeklyAvailability())

  // State for shift flexibility checkboxes
  const getInitialShiftFlexibility = (): string[] => {
    if (!initialData?.shift_flexibility) return []
    try {
      const flexibility = initialData.shift_flexibility
      if (Array.isArray(flexibility)) {
        return flexibility as string[]
      }
      if (typeof flexibility === 'string') {
        return JSON.parse(flexibility)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [shiftFlexibility, setShiftFlexibility] = useState<string[]>(getInitialShiftFlexibility())

  // State for compensation types checkboxes
  const getInitialCompensationTypes = (): string[] => {
    if (!initialData?.compensation_types) return []
    try {
      const types = initialData.compensation_types
      if (Array.isArray(types)) {
        return types as string[]
      }
      if (typeof types === 'string') {
        return JSON.parse(types)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [compensationTypes, setCompensationTypes] = useState<string[]>(getInitialCompensationTypes())

  // State for core skills (array of {skill: string, years: number})
  const getInitialCoreSkills = (): Array<{skill: string, years: number}> => {
    if (!initialData?.core_skills) return []
    try {
      const skills = initialData.core_skills
      if (Array.isArray(skills)) {
        return skills as Array<{skill: string, years: number}>
      }
      if (typeof skills === 'string') {
        return JSON.parse(skills)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [coreSkills, setCoreSkills] = useState<Array<{skill: string, years: number}>>(getInitialCoreSkills())
  const [newCoreSkill, setNewCoreSkill] = useState('')
  const [newCoreSkillYears, setNewCoreSkillYears] = useState('')

  // State for tools & technologies (array of {tool: string, level: string, years: number})
  const getInitialTools = (): Array<{tool: string, level: string, years: number}> => {
    if (!initialData?.tools_and_technologies) return []
    try {
      const tools = initialData.tools_and_technologies
      if (Array.isArray(tools)) {
        return tools as Array<{tool: string, level: string, years: number}>
      }
      if (typeof tools === 'string') {
        return JSON.parse(tools)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [toolsAndTechnologies, setToolsAndTechnologies] = useState<Array<{tool: string, level: string, years: number}>>(getInitialTools())
  const [newTool, setNewTool] = useState('')
  const [newToolLevel, setNewToolLevel] = useState('')
  const [newToolYears, setNewToolYears] = useState('')

  // State for industry experience (array of {industry: string, years: number})
  const getInitialIndustryExperience = (): Array<{industry: string, years: number}> => {
    if (!initialData?.industry_experience) return []
    try {
      const industries = initialData.industry_experience
      if (Array.isArray(industries)) {
        return industries as Array<{industry: string, years: number}>
      }
      if (typeof industries === 'string') {
        return JSON.parse(industries)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [industryExperience, setIndustryExperience] = useState<Array<{industry: string, years: number}>>(getInitialIndustryExperience())
  const [newIndustry, setNewIndustry] = useState('')
  const [newIndustryYears, setNewIndustryYears] = useState('')

  // State for accomplishments (array of strings, max 3)
  const getInitialAccomplishments = (): string[] => {
    if (!initialData?.accomplishments) return []
    try {
      const acc = initialData.accomplishments
      if (Array.isArray(acc)) {
        return acc as string[]
      }
      if (typeof acc === 'string') {
        return JSON.parse(acc)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [accomplishments, setAccomplishments] = useState<string[]>(getInitialAccomplishments())
  const [newAccomplishment, setNewAccomplishment] = useState('')

  // State for values and motivators checkboxes
  const getInitialValuesAndMotivators = (): string[] => {
    if (!initialData?.values_and_motivators) return []
    try {
      const values = initialData.values_and_motivators
      if (Array.isArray(values)) {
        return values as string[]
      }
      if (typeof values === 'string') {
        return JSON.parse(values)
      }
      return []
    } catch {
      return []
    }
  }
  
  const [valuesAndMotivators, setValuesAndMotivators] = useState<string[]>(getInitialValuesAndMotivators())

  // State for compliance and consent checkboxes
  const getInitialCompliance = (): Record<string, boolean> => {
    if (!initialData?.compliance_and_consent) return {}
    try {
      const compliance = initialData.compliance_and_consent
      if (typeof compliance === 'object' && compliance !== null) {
        return compliance as Record<string, boolean>
      }
      if (typeof compliance === 'string') {
        return JSON.parse(compliance)
      }
      return {}
    } catch {
      return {}
    }
  }
  
  const [complianceAndConsent, setComplianceAndConsent] = useState<Record<string, boolean>>(getInitialCompliance())

  // State for regulated occupation status
  const [isOccupationRegulated, setIsOccupationRegulated] = useState<string>(
    (initialData?.is_occupation_regulated as string) || ''
  )

  // State for target groups checkboxes
  const [isNewcomer, setIsNewcomer] = useState<boolean>(
    (initialData?.is_newcomer_to_canada as boolean) || false
  )
  const [isVeteran, setIsVeteran] = useState<boolean>(
    (initialData?.is_veteran_of_caf as boolean) || false
  )
  const [isIndigenous, setIsIndigenous] = useState<boolean>(
    (initialData?.is_indigenous_person as boolean) || false
  )
  const [isVisibleMinority, setIsVisibleMinority] = useState<boolean>(
    (initialData?.is_member_of_visible_minority as boolean) || false
  )
  const [showVisibleMinorityDefinition, setShowVisibleMinorityDefinition] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    // Add additional emails as JSONB
    if (additionalEmails.length > 0) {
      formData.append('additional_email_addresses', JSON.stringify(additionalEmails))
    }
    
    // Add target job titles as JSONB
    if (targetJobTitles.length > 0) {
      formData.append('target_job_titles', JSON.stringify(targetJobTitles))
    }
    
    // Add employment type as JSONB
    if (employmentType.length > 0) {
      formData.append('employment_type', JSON.stringify(employmentType))
    }
    
    // Add work setting preference as JSONB
    if (workSettingPreference.length > 0) {
      formData.append('work_setting_preference', JSON.stringify(workSettingPreference))
    }
    
    // Add driver's license class as JSONB
    if (driverLicenseClass.length > 0) {
      formData.append('driver_license_class', JSON.stringify(driverLicenseClass))
    }
    
    // Add weekly availability as JSONB
    if (weeklyAvailability.length > 0) {
      formData.append('weekly_availability', JSON.stringify(weeklyAvailability))
    }
    
    // Add shift flexibility as JSONB
    if (shiftFlexibility.length > 0) {
      formData.append('shift_flexibility', JSON.stringify(shiftFlexibility))
    }
    
    // Add compensation types as JSONB
    if (compensationTypes.length > 0) {
      formData.append('compensation_types', JSON.stringify(compensationTypes))
    }
    
    // Add core skills as JSONB
    if (coreSkills.length > 0) {
      formData.append('core_skills', JSON.stringify(coreSkills))
    }
    
    // Add tools and technologies as JSONB
    if (toolsAndTechnologies.length > 0) {
      formData.append('tools_and_technologies', JSON.stringify(toolsAndTechnologies))
    }
    
    // Add industry experience as JSONB
    if (industryExperience.length > 0) {
      formData.append('industry_experience', JSON.stringify(industryExperience))
    }
    
    // Add accomplishments as JSONB
    if (accomplishments.length > 0) {
      formData.append('accomplishments', JSON.stringify(accomplishments))
    }
    
    // Add values and motivators as JSONB
    if (valuesAndMotivators.length > 0) {
      formData.append('values_and_motivators', JSON.stringify(valuesAndMotivators))
    }
    
    // Add compliance and consent as JSONB
    formData.append('compliance_and_consent', JSON.stringify(complianceAndConsent))
    
    startTransition(async () => {
      const result = await updateSeekerProfile(formData)
      setState(result)
      if (result.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  // Get verification status badge
  const getVerificationBadge = () => {
    const status = initialData?.identity_verification_status as string | null
    if (status === 'verified') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      )
    }
    if (status === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          <XCircle className="mr-1 h-3 w-3" />
          Rejected
        </Badge>
      )
    }
    return (
      <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
        <Clock className="mr-1 h-3 w-3" />
        Not Verified
      </Badge>
    )
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Header with Save Button */}
      <div className="flex justify-end">
        <Button type="submit" className="bg-primary" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Profile
            </>
          )}
        </Button>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex flex-wrap gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Success/Error Messages */}
      {state?.success && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <p className="text-sm text-green-800">{state.message}</p>
        </div>
      )}
      {state?.error && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{state.error}</p>
        </div>
      )}

      {/* Tab Content */}
      <div className="space-y-6">
        {/* Personal Tab */}
        <div className={activeTab === 'personal' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Profile Photo Section */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-6">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-gray-300 bg-gray-50 overflow-hidden">
                    {initialData?.profile_photo_url ? (
                      <img
                        src={initialData.profile_photo_url as string}
                        alt="Profile photo"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Upload Profile Photo</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('photo-upload')?.click()}
                      >
                        Choose file
                      </Button>
                      <span className="text-sm text-gray-500" id="photo-file-name">
                        No file chosen
                      </span>
                    </div>
                    <input
                      type="file"
                      id="photo-upload"
                      name="profile_photo"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const fileName = e.target.files?.[0]?.name || 'No file chosen'
                        document.getElementById('photo-file-name')!.textContent = fileName
                      }}
                    />
                    <p className="text-xs text-gray-500 mb-4">
                      JPG or PNG only, max 2MB
                    </p>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name="show_profile_photo_publicly"
                        defaultChecked={false}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">
                        Show profile photo publicly
                      </span>
                    </label>
                    <p className="mt-1 text-xs text-gray-500">
                      When enabled, your photo will be visible on job applications and to employers searching the database.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Identity Verification Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Identity Verification</CardTitle>
                  {getVerificationBadge()}
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Shield className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <Zap className="h-6 w-6 text-blue-600 flex-shrink-0" />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-blue-900 mb-2">
                        AI-Powered Identity Verification
                      </h3>
                      <p className="text-sm text-blue-800 mb-3">
                        Our advanced AI system instantly verifies your identity by analyzing your government-issued IDs. This helps:
                      </p>
                      <ul className="space-y-1 text-sm text-blue-800 mb-4">
                        <li>• Prevent bots, scammers, and fraudulent profiles</li>
                        <li>• Build trust with employers through instant verification</li>
                        <li>• Get your "Authenticated Applicant" badge automatically</li>
                        <li>• Receive priority visibility in employer searches</li>
                      </ul>
                      <div className="mt-4 pt-4 border-t border-blue-200">
                        <div className="flex items-start gap-2">
                          <Lock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium text-blue-900 mb-1">Your Privacy:</p>
                            <p className="text-xs text-blue-800">
                              Your ID documents are analyzed securely and never shared with employers. 
                              They are used solely for identity verification purposes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Government-Issued Photo ID #1 Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Government-Issued Photo ID #1 <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Examples: Passport, Driver's License, National ID Card, PR Card, Work Permit.
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Upload ID Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('id-doc-upload-1')?.click()}
                    >
                      Choose file
                    </Button>
                    <span className="text-sm text-gray-500" id="id-doc-1-file-name">
                      No file chosen
                    </span>
                  </div>
                  <input
                    type="file"
                    id="id-doc-upload-1"
                    name="id_document_1"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    required
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || 'No file chosen'
                      document.getElementById('id-doc-1-file-name')!.textContent = fileName
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Government-Issued Photo ID #2 Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Government-Issued Photo ID #2 <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Must be a different document from ID #1
                </p>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Upload ID Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('id-doc-upload-2')?.click()}
                    >
                      Choose file
                    </Button>
                    <span className="text-sm text-gray-500" id="id-doc-2-file-name">
                      No file chosen
                    </span>
                  </div>
                  <input
                    type="file"
                    id="id-doc-upload-2"
                    name="id_document_2"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    required
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || 'No file chosen'
                      document.getElementById('id-doc-2-file-name')!.textContent = fileName
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* How AI Verification Works Section */}
            <Card>
              <CardContent className="pt-6">
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-6">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">
                    How AI Verification Works
                  </h3>
                  <p className="text-sm text-purple-800 mb-4">
                    Once you upload both IDs, our AI instantly analyzes:
                  </p>
                  <ul className="space-y-2 text-sm text-purple-800 mb-4 list-disc list-inside">
                    <li>Document authenticity and security features</li>
                    <li>Consistency between both documents</li>
                    <li>Match with your profile information</li>
                    <li>Photo verification across documents</li>
                  </ul>
                  <div className="space-y-1 text-sm text-purple-800 mb-4">
                    <p><strong>Score 90+:</strong> Instant automatic verification ✓</p>
                    <p><strong>Score 70-89:</strong> Quick manual review (1-2 days)</p>
                    <p><strong>Score below 70:</strong> Detailed manual review</p>
                  </div>
                  <p className="text-xs text-purple-700">
                    Accepted formats: JPG, PNG, PDF (Max 2MB per file)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Title */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Title (Optional)
                    </label>
                    <Select name="title" defaultValue={initialData?.title as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select title..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mr.">Mr.</SelectItem>
                        <SelectItem value="Mrs.">Mrs.</SelectItem>
                        <SelectItem value="Ms.">Ms.</SelectItem>
                        <SelectItem value="Miss.">Miss.</SelectItem>
                        <SelectItem value="Dr.">Dr.</SelectItem>
                        <SelectItem value="Prof.">Prof.</SelectItem>
                        <SelectItem value="Mx.">Mx.</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Pronouns */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Pronouns (Optional)
                    </label>
                    <Select name="pronouns" defaultValue={initialData?.pronouns as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select pronouns..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="he/him">he/him</SelectItem>
                        <SelectItem value="she/her">she/her</SelectItem>
                        <SelectItem value="they/them">they/them</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Legal First Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Legal First Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="legal_first_name"
                      defaultValue={initialData?.legal_first_name as string || ''}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Middle Name
                    </label>
                    <Input
                      type="text"
                      name="middle_name"
                      defaultValue={initialData?.middle_name as string || ''}
                      className="w-full"
                    />
                  </div>

                  {/* Legal Last Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Legal Last Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="legal_last_name"
                      defaultValue={initialData?.legal_last_name as string || ''}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Preferred Name */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Preferred Name
                    </label>
                    <Input
                      type="text"
                      name="preferred_name"
                      defaultValue={initialData?.preferred_name as string || ''}
                      placeholder="Optional"
                      className="w-full"
                    />
                  </div>

                  {/* Mobile Phone */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Mobile Phone <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="tel"
                      name="phone_number"
                      defaultValue={initialData?.phone_number as string || ''}
                      placeholder="+1-416-555-0101"
                      required
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Location Section */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* City */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      City <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="city"
                      defaultValue={initialData?.city as string || ''}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Province/State */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Province/State <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="province"
                      defaultValue={initialData?.province as string || ''}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Postal Code */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Postal Code <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="text"
                      name="postal_code"
                      defaultValue={initialData?.postal_code as string || ''}
                      required
                      className="w-full"
                    />
                  </div>

                  {/* Country */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Country <span className="text-red-500">*</span>
                    </label>
                    <Select name="country_id" defaultValue={initialData?.country_id ? String(initialData.country_id) : '1'}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Canada</SelectItem>
                        <SelectItem value="2">United States</SelectItem>
                        <SelectItem value="3">United Kingdom</SelectItem>
                        <SelectItem value="4">Australia</SelectItem>
                        <SelectItem value="5">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demographic Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Demographic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Privacy Banner */}
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-yellow-200 flex-shrink-0 mt-0.5">
                      <Info className="h-3 w-3 text-yellow-800" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-yellow-900">
                        <strong>Private & Confidential</strong> This information is collected for statistical and diversity reporting purposes only. It will <strong>never</strong> be shown to employers or used in hiring decisions. All responses are optional and confidential.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Date of Birth */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Date of Birth
                    </label>
                    <div className="relative">
                      <Input
                        type="date"
                        name="date_of_birth"
                        defaultValue={initialData?.date_of_birth ? new Date(initialData.date_of_birth as string).toISOString().split('T')[0] : ''}
                        className="w-full pr-10"
                      />
                      <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      For age verification and eligibility only
                    </p>
                  </div>

                  {/* Gender Identity */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Gender Identity
                    </label>
                    <Select name="gender" defaultValue={initialData?.gender as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Non Binary">Non Binary</SelectItem>
                        <SelectItem value="Genderqueer">Genderqueer</SelectItem>
                        <SelectItem value="Genderfluid">Genderfluid</SelectItem>
                        <SelectItem value="Agender">Agender</SelectItem>
                        <SelectItem value="Two Spirit">Two Spirit</SelectItem>
                        <SelectItem value="Transgender Male">Transgender Male</SelectItem>
                        <SelectItem value="Transgender Female">Transgender Female</SelectItem>
                        <SelectItem value="Intersex">Intersex</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer to self describe">Prefer to self describe</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Ethnicity */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Ethnicity
                    </label>
                    <Select name="ethnicity" defaultValue={initialData?.ethnicity as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Indigenous">Indigenous</SelectItem>
                        <SelectItem value="Black/African">Black/African</SelectItem>
                        <SelectItem value="Asian">Asian</SelectItem>
                        <SelectItem value="White/Caucasian">White/Caucasian</SelectItem>
                        <SelectItem value="Latino/Hispanic">Latino/Hispanic</SelectItem>
                        <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                        <SelectItem value="Pacific Islander">Pacific Islander</SelectItem>
                        <SelectItem value="Mixed/Multiple">Mixed/Multiple</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Veteran Status */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Veteran Status
                    </label>
                    <Select name="veteran_status" defaultValue={initialData?.veteran_status as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Disability Status */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Disability Status
                    </label>
                    <Select name="disability_status" defaultValue={initialData?.disability_status as string || ''}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="mt-1 text-xs text-gray-500">
                      Helps us ensure accessibility and accommodation support
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Links Section */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Links</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* LinkedIn URL */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      LinkedIn URL
                    </label>
                    <Input
                      type="url"
                      name="linkedin_url"
                      defaultValue={initialData?.linkedin_url as string || ''}
                      placeholder="https://linkedin.com/in/yourprofile"
                      className="w-full"
                    />
                  </div>

                  {/* Portfolio/Website */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Portfolio/Website
                    </label>
                    <Input
                      type="url"
                      name="portfolio"
                      defaultValue={initialData?.portfolio as string || ''}
                      placeholder="https://yourportfolio.com"
                      className="w-full"
                    />
                  </div>

                  {/* GitHub URL */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      GitHub URL
                    </label>
                    <Input
                      type="url"
                      name="github_url"
                      defaultValue={initialData?.github_url as string || ''}
                      placeholder="https://github.com/yourusername"
                      className="w-full"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Account & Security Section */}
            <Card>
              <CardHeader>
                <CardTitle>Account & Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Multiple Email Addresses Info Box */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 flex-shrink-0 mt-0.5">
                      <Info className="h-3 w-3 text-blue-800" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-1">
                        Multiple Email Addresses
                      </h4>
                      <p className="text-sm text-blue-800">
                        Many job seekers use different email addresses for job applications to organize their job search. Add additional emails here to use them when applying through CareerOwl.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Primary Login Email */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Primary Login Email
                  </label>
                  <div className="flex items-center gap-3">
                    <Input
                      type="email"
                      value={initialData?.email as string || ''}
                      disabled
                      className="w-full bg-gray-50"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Login Account
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    This is your login email. To change it, please contact support.
                  </p>
                </div>

                {/* Additional Email Addresses */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Additional Email Addresses
                  </label>
                  
                  {/* Email Input Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <Input
                      type="email"
                      id="new-email-address"
                      placeholder="additional@email.com"
                      className="w-full"
                    />
                    <Input
                      type="text"
                      id="new-email-label"
                      placeholder="e.g., Job Applications, Professional"
                      className="w-full"
                    />
                  </div>
                  
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mb-4"
                    onClick={() => {
                      const emailInput = document.getElementById('new-email-address') as HTMLInputElement
                      const labelInput = document.getElementById('new-email-label') as HTMLInputElement
                      const email = emailInput.value.trim()
                      const label = labelInput.value.trim()
                      
                      if (email) {
                        setAdditionalEmails([...additionalEmails, { email, label }])
                        emailInput.value = ''
                        labelInput.value = ''
                      }
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Email Address
                  </Button>

                  {/* Display Added Emails */}
                  {additionalEmails.length > 0 ? (
                    <div className="space-y-2">
                      {additionalEmails.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{item.email}</p>
                            {item.label && (
                              <p className="text-xs text-gray-500">{item.label}</p>
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setAdditionalEmails(additionalEmails.filter((_, i) => i !== index))
                            }}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg bg-gray-50 border border-gray-200 p-4">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-600">No additional emails added yet</p>
                          <p className="text-xs text-gray-500">Add emails to use for job applications.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Password Section */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Password</p>
                      <p className="text-xs text-gray-500">Reset your password to secure your account.</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Key className="h-4 w-4" />
                    Reset Password
                  </Button>
                </div>

                {/* Security Note */}
                <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <Lock className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <p className="text-sm text-yellow-900">
                        Your primary login email is managed through your account settings and cannot be changed here. Additional emails are for job application purposes only and won't receive login notifications.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Work Auth Tab */}
        <div className={activeTab === 'work_auth' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Work Authorization in Canada
              </h2>
              <p className="text-gray-600">
                Help employers understand your eligibility to work in Canada.
              </p>
            </div>

            {/* Understanding Canadian Work Authorization */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <CardTitle>Understanding Canadian Work Authorization</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-700">
                  Employers in Canada can hire from two main talent pools:
                </p>
                
                <div className="space-y-3">
                  {/* Local Market */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">Local Market (Traditional Hiring)</p>
                      <p className="text-sm text-gray-700">
                        Canadian Citizens and Permanent Residents who can work immediately without restrictions.
                      </p>
                    </div>
                  </div>

                  {/* International Talent */}
                  <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-gray-900 mb-1">International Talent</p>
                      <p className="text-sm text-gray-700 mb-2">
                        This includes two sub-categories:
                      </p>
                      <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                        <li>
                          <strong>Already in Canada:</strong> Temporary residents with valid work permits (Open Work Permit, PGWP, IEC, etc.)
                        </li>
                        <li>
                          <strong>Outside Canada:</strong> International job seekers requiring LMIA, Provincial Nomination, or Pilot Program support
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Authorization Status */}
            <Card>
              <CardHeader>
                <CardTitle>
                  What is your current work authorization status? <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
                  <Select 
                    name="work_status" 
                    defaultValue={initialData?.work_status as string || ''}
                    required
                    onValueChange={(value) => setWorkStatus(value)}
                  >
                    <SelectTrigger className="w-full pl-10">
                      <SelectValue placeholder="Select your work authorization status..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Canadian Citizen">Canadian Citizen</SelectItem>
                      <SelectItem value="Permanent Resident">Permanent Resident</SelectItem>
                      <SelectItem value="Open Work Permit">Open Work Permit</SelectItem>
                      <SelectItem value="Post-Graduation Work Permit (PGWP)">Post-Graduation Work Permit (PGWP)</SelectItem>
                      <SelectItem value="International Experience Canada (IEC)">International Experience Canada (IEC)</SelectItem>
                      <SelectItem value="Employer-Specific Work Permit">Employer-Specific Work Permit</SelectItem>
                      <SelectItem value="Restricted Work Permit">Restricted Work Permit</SelectItem>
                      <SelectItem value="Outside Canada - Need LMIA">Outside Canada - Need LMIA</SelectItem>
                      <SelectItem value="Outside Canada - Need Provincial Nomination">Outside Canada - Need Provincial Nomination</SelectItem>
                      <SelectItem value="Outside Canada - Need Pilot Program">Outside Canada - Need Pilot Program</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Local Canadian Talent Info Box */}
                {(workStatus === 'Canadian Citizen' || workStatus === 'Permanent Resident') && (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900 mb-1">
                          Local Canadian Talent
                        </p>
                        <p className="text-sm text-green-800">
                          You can work for any employer in Canada without restrictions. Employers can hire you through traditional recruitment without immigration sponsorship.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Privacy Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-blue-600" />
                  <Lock className="h-5 w-5 text-blue-600" />
                  <CardTitle>Your Privacy Matters</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">
                  Your work authorization status is used only to match you with appropriate job opportunities. Employers cannot see this information until you apply to their positions. We use this to ensure you're matched with jobs where you're eligible to work.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Role Tab */}
        <div className={activeTab === 'role' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Target Job Titles */}
            <Card>
              <CardHeader>
                <CardTitle>Target Job Titles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Enter job title"
                    value={newJobTitle}
                    onChange={(e) => setNewJobTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newJobTitle.trim()) {
                        e.preventDefault()
                        if (!targetJobTitles.includes(newJobTitle.trim())) {
                          setTargetJobTitles([...targetJobTitles, newJobTitle.trim()])
                          setNewJobTitle('')
                        }
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newJobTitle.trim() && !targetJobTitles.includes(newJobTitle.trim())) {
                        setTargetJobTitles([...targetJobTitles, newJobTitle.trim()])
                        setNewJobTitle('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {targetJobTitles.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {targetJobTitles.map((title, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1"
                      >
                        {title}
                        <button
                          type="button"
                          onClick={() => {
                            setTargetJobTitles(targetJobTitles.filter((_, i) => i !== index))
                          }}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Primary NOC Code */}
            <Card>
              <CardHeader>
                <CardTitle>Primary NOC Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    name="primary_noc_code"
                    defaultValue={initialData?.primary_noc_code as string || ''}
                    placeholder="21232"
                    maxLength={5}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Search
                  </Button>
                </div>
                
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 flex-shrink-0 mt-0.5">
                      <Info className="h-3 w-3 text-blue-800" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="text-sm font-semibold text-blue-900">
                        We use NOC 2021 (5-digit codes)
                      </p>
                      <p className="text-sm text-blue-800">
                        CareerOwl uses the current <strong>NOC 2021</strong> classification system with 5-digit codes. This is the official system used by IRCC, Job Bank, and all Canadian government employment services as of November 2022.
                      </p>
                      <p className="text-sm text-blue-800">
                        <strong>Important:</strong> Do not use old 4-digit NOC 2016 codes. These are no longer valid for immigration applications, LMIA, Express Entry, or job postings. All NOC codes must be 5 digits.
                      </p>
                      <a
                        href="https://noc.esdc.gc.ca/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 underline"
                      >
                        Search NOC 2021 database
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seniority Level */}
            <Card>
              <CardHeader>
                <CardTitle>
                  Seniority Level <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Select 
                  name="seniority_level" 
                  defaultValue={initialData?.seniority_level as string || ''}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select seniority level..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Intern">Intern</SelectItem>
                    <SelectItem value="Junior">Junior</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Senior">Senior</SelectItem>
                    <SelectItem value="Lead">Lead</SelectItem>
                    <SelectItem value="Manager">Manager</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="VP">VP</SelectItem>
                    <SelectItem value="C-Suite">C-Suite</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Employment Type */}
            <Card>
              <CardHeader>
                <CardTitle>Employment Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Full Time', 'Temporary', 'Part Time', 'Internship', 'Contract', 'Coop'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={employmentType.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setEmploymentType([...employmentType, type])
                          } else {
                            setEmploymentType(employmentType.filter(t => t !== type))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Work Setting Preference */}
            <Card>
              <CardHeader>
                <CardTitle>Work Setting Preference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Onsite', 'Hybrid', 'Remote'].map((setting) => (
                    <label key={setting} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={workSettingPreference.includes(setting)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setWorkSettingPreference([...workSettingPreference, setting])
                          } else {
                            setWorkSettingPreference(workSettingPreference.filter(s => s !== setting))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{setting}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Location Tab */}
        <div className={activeTab === 'location' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Location & Mobility</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Relocation Willingness */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Relocation Willingness
                  </label>
                  <Select 
                    name="relocation_willingness" 
                    defaultValue={initialData?.relocation_willingness as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes - Open to relocate">Yes - Open to relocate</SelectItem>
                      <SelectItem value="No - not willing">No - not willing</SelectItem>
                      <SelectItem value="Within country only">Within country only</SelectItem>
                      <SelectItem value="Case-by-case">Case-by-case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Max Commute Time */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Max Commute Time (minutes)
                  </label>
                  <Input
                    type="number"
                    name="max_commute_time"
                    defaultValue={initialData?.max_commute_time ? String(initialData.max_commute_time) : ''}
                    placeholder="e.g., 45"
                    min="0"
                    className="w-full"
                  />
                </div>

                {/* Travel Willingness */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Travel Willingness
                  </label>
                  <Select 
                    name="travel_willingness" 
                    defaultValue={initialData?.travel_willingness as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0% - NO Travel">0% - NO Travel</SelectItem>
                      <SelectItem value="<10%">&lt;10%</SelectItem>
                      <SelectItem value="10-25%">10-25%</SelectItem>
                      <SelectItem value="25-50%">25-50%</SelectItem>
                      <SelectItem value=">50%">&gt;50%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Driver's License Class */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Driver's License Class
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {['G', 'G2', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Other'].map((licenseClass) => (
                      <label key={licenseClass} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={driverLicenseClass.includes(licenseClass)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setDriverLicenseClass([...driverLicenseClass, licenseClass])
                            } else {
                              setDriverLicenseClass(driverLicenseClass.filter(c => c !== licenseClass))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{licenseClass}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Personal Vehicle */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Personal Vehicle
                  </label>
                  <Select 
                    name="personal_vehicle" 
                    defaultValue={initialData?.personal_vehicle as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Availability Tab */}
        <div className={activeTab === 'availability' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Availability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Earliest Start Date */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Earliest Start Date
                  </label>
                  <div className="relative">
                    <Input
                      type="date"
                      name="earliest_start_date"
                      defaultValue={initialData?.earliest_start_date 
                        ? new Date(initialData.earliest_start_date as string).toISOString().split('T')[0] 
                        : ''}
                      className="w-full pr-10"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Notice Period */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Notice Period
                  </label>
                  <Select 
                    name="notice_period" 
                    defaultValue={initialData?.notice_period as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Immediate">Immediate</SelectItem>
                      <SelectItem value="1 Week">1 Week</SelectItem>
                      <SelectItem value="2 Weeks">2 Weeks</SelectItem>
                      <SelectItem value="4 Weeks">4 Weeks</SelectItem>
                      <SelectItem value="Over 4 Weeks">Over 4 Weeks</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Weekly Availability */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">
                    Weekly Availability
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Weekdays', 'Evenings', 'Weekends', 'Overnights'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={weeklyAvailability.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWeeklyAvailability([...weeklyAvailability, option])
                            } else {
                              setWeeklyAvailability(weeklyAvailability.filter(a => a !== option))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Shift Flexibility */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">
                    Shift Flexibility
                  </label>
                  <div className="flex flex-wrap gap-4">
                    {['Fixed', 'Rotating', 'Split', 'On Call'].map((option) => (
                      <label key={option} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={shiftFlexibility.includes(option)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setShiftFlexibility([...shiftFlexibility, option])
                            } else {
                              setShiftFlexibility(shiftFlexibility.filter(f => f !== option))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compensation Tab */}
        <div className={activeTab === 'compensation' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Compensation Expectations */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation Expectations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Salary Expectation */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Salary Expectation
                    </label>
                    <Input
                      type="number"
                      name="salary_expectation"
                      defaultValue={initialData?.salary_expectation ? String(initialData.salary_expectation) : ''}
                      placeholder="85000"
                      min="0"
                      className="w-full"
                    />
                  </div>

                  {/* Salary Type */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Salary Type
                    </label>
                    <Select 
                      name="salary_type" 
                      defaultValue={initialData?.salary_type as string || ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Annual">Annual</SelectItem>
                        <SelectItem value="Hourly">Hourly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Currency
                    </label>
                    <Select 
                      name="currency" 
                      defaultValue={initialData?.currency as string || 'CAD'}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Minimum Acceptable Offer */}
            <Card>
              <CardHeader>
                <CardTitle>Minimum Acceptable Offer</CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <Input
                    type="number"
                    name="minimum_acceptable_offer"
                    defaultValue={initialData?.minimum_acceptable_offer ? String(initialData.minimum_acceptable_offer) : ''}
                    placeholder="Your minimum salary requirement"
                    min="0"
                    className="w-full"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    This helps filter opportunities that don't meet your requirements
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Compensation Types */}
            <Card>
              <CardHeader>
                <CardTitle>Compensation Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {['Base', 'Bonus', 'Commission', 'Overtime', 'Equity'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={compensationTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setCompensationTypes([...compensationTypes, type])
                          } else {
                            setCompensationTypes(compensationTypes.filter(t => t !== type))
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Skills Tab */}
        <div className={activeTab === 'skills' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Years of Total Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Years of Total Experience</CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  type="number"
                  name="years_of_experience"
                  defaultValue={initialData?.years_of_experience ? String(initialData.years_of_experience) : ''}
                  placeholder="4"
                  min="0"
                  className="w-full max-w-xs"
                />
              </CardContent>
            </Card>

            {/* Core Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Core Skills</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Skill name"
                    value={newCoreSkill}
                    onChange={(e) => setNewCoreSkill(e.target.value)}
                    className="flex-1"
                  />
                  <Input
                    type="number"
                    placeholder="Years"
                    value={newCoreSkillYears}
                    onChange={(e) => setNewCoreSkillYears(e.target.value)}
                    min="0"
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newCoreSkill.trim() && newCoreSkillYears) {
                        setCoreSkills([...coreSkills, { skill: newCoreSkill.trim(), years: parseInt(newCoreSkillYears) }])
                        setNewCoreSkill('')
                        setNewCoreSkillYears('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {coreSkills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {coreSkills.map((item, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1"
                      >
                        {item.skill} - {item.years} {item.years === 1 ? 'year' : 'years'}
                        <button
                          type="button"
                          onClick={() => {
                            setCoreSkills(coreSkills.filter((_, i) => i !== index))
                          }}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tools & Technologies */}
            <Card>
              <CardHeader>
                <CardTitle>Tools & Technologies</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Tool/Technology"
                    value={newTool}
                    onChange={(e) => setNewTool(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newToolLevel} onValueChange={setNewToolLevel}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Beginner">Beginner</SelectItem>
                      <SelectItem value="Intermediate">Intermediate</SelectItem>
                      <SelectItem value="Advanced">Advanced</SelectItem>
                      <SelectItem value="Expert">Expert</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={newToolYears} onValueChange={setNewToolYears}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newTool.trim() && newToolLevel && newToolYears) {
                        setToolsAndTechnologies([...toolsAndTechnologies, { 
                          tool: newTool.trim(), 
                          level: newToolLevel, 
                          years: parseInt(newToolYears) 
                        }])
                        setNewTool('')
                        setNewToolLevel('')
                        setNewToolYears('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {toolsAndTechnologies.length > 0 && (
                  <div className="space-y-2">
                    {toolsAndTechnologies.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.tool}</p>
                          <p className="text-xs text-gray-500">{item.level} - {item.years} {item.years === 1 ? 'year' : 'years'}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setToolsAndTechnologies(toolsAndTechnologies.filter((_, i) => i !== index))
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Industry Experience */}
            <Card>
              <CardHeader>
                <CardTitle>Industry Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Industry"
                    value={newIndustry}
                    onChange={(e) => setNewIndustry(e.target.value)}
                    className="flex-1"
                  />
                  <Select value={newIndustryYears} onValueChange={setNewIndustryYears}>
                    <SelectTrigger className="w-24">
                      <SelectValue placeholder="Years" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 20 }, (_, i) => i + 1).map((year) => (
                        <SelectItem key={year} value={String(year)}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newIndustry.trim() && newIndustryYears) {
                        setIndustryExperience([...industryExperience, { 
                          industry: newIndustry.trim(), 
                          years: parseInt(newIndustryYears) 
                        }])
                        setNewIndustry('')
                        setNewIndustryYears('')
                      }
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                
                {industryExperience.length > 0 && (
                  <div className="space-y-2">
                    {industryExperience.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{item.industry}</p>
                          <p className="text-xs text-gray-500">{item.years} {item.years === 1 ? 'year' : 'years'}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIndustryExperience(industryExperience.filter((_, i) => i !== index))
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* People Leadership & Budget Responsibility */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>People Leadership</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    name="people_leadership" 
                    defaultValue={initialData?.people_leadership as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Mentored Others">Mentored Others</SelectItem>
                      <SelectItem value="Led 1-5 people">Led 1-5 people</SelectItem>
                      <SelectItem value="Led 6-20 people">Led 6-20 people</SelectItem>
                      <SelectItem value="Led 21+ people">Led 21+ people</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Budget/P&L Responsibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    name="budget_responsibility" 
                    defaultValue={initialData?.budget_responsibility as string || ''}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="<$100k">&lt;$100k</SelectItem>
                      <SelectItem value="$100k-$1M">$100k-$1M</SelectItem>
                      <SelectItem value="$1M-$10M">$1M-$10M</SelectItem>
                      <SelectItem value="$10M+">$10M+</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>

            {/* Top 3 Accomplishments */}
            <Card>
              <CardHeader>
                <CardTitle>Top 3 Accomplishments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <textarea
                    placeholder="Describe your accomplishment with measurable outcomes..."
                    value={newAccomplishment}
                    onChange={(e) => setNewAccomplishment(e.target.value)}
                    className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (newAccomplishment.trim() && accomplishments.length < 3) {
                        setAccomplishments([...accomplishments, newAccomplishment.trim()])
                        setNewAccomplishment('')
                      }
                    }}
                    disabled={accomplishments.length >= 3}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Accomplishment ({accomplishments.length}/3)
                  </Button>
                </div>
                
                {accomplishments.length > 0 && (
                  <div className="space-y-2">
                    {accomplishments.map((acc, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{acc}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setAccomplishments(accomplishments.filter((_, i) => i !== index))
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Preferences Tab */}
        <div className={activeTab === 'preferences' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Work Preferences */}
            <Card>
              <CardHeader>
                <CardTitle>Work Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Dropdowns in two columns */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Team Environment */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Team Environment
                    </label>
                    <Select 
                      name="team_environment" 
                      defaultValue={initialData?.team_environment as string || ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Independent work">Independent work</SelectItem>
                        <SelectItem value="Small team (2-10)">Small team (2-10)</SelectItem>
                        <SelectItem value="Cross-functional teams">Cross-functional teams</SelectItem>
                        <SelectItem value="Large organization">Large organization</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Management Style */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Management Style
                    </label>
                    <Select 
                      name="management_style" 
                      defaultValue={initialData?.management_style as string || ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Hands on">Hands on</SelectItem>
                        <SelectItem value="High autonomy">High autonomy</SelectItem>
                        <SelectItem value="Coaching focused">Coaching focused</SelectItem>
                        <SelectItem value="Structured">Structured</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Company Size */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Company Size
                    </label>
                    <Select 
                      name="company_size" 
                      defaultValue={initialData?.company_size as string || ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Startup (1-50)">Startup (1-50)</SelectItem>
                        <SelectItem value="SMB (51-200)">SMB (51-200)</SelectItem>
                        <SelectItem value="Mid-market (201-1000)">Mid-market (201-1000)</SelectItem>
                        <SelectItem value="Enterprise (1000+)">Enterprise (1000+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* References */}
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      References
                    </label>
                    <Select 
                      name="js_references" 
                      defaultValue={initialData?.js_references as string || ''}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available now">Available now</SelectItem>
                        <SelectItem value="After offer">After offer</SelectItem>
                        <SelectItem value="Not available">Not available</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Values & Motivators */}
                <div>
                  <label className="mb-3 block text-sm font-semibold text-gray-900">
                    Values & Motivators
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {['Impact', 'Compensation', 'Stability', 'Mission', 'Growth', 'Flexibility'].map((value) => (
                      <label key={value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={valuesAndMotivators.includes(value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setValuesAndMotivators([...valuesAndMotivators, value])
                            } else {
                              setValuesAndMotivators(valuesAndMotivators.filter(v => v !== value))
                            }
                          }}
                          className="rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-700">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Compliance & Consent */}
            <Card>
              <CardHeader>
                <CardTitle>Compliance & Consent</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Background Check Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={complianceAndConsent.background_check_consent || false}
                    onChange={(e) => {
                      setComplianceAndConsent({
                        ...complianceAndConsent,
                        background_check_consent: e.target.checked
                      })
                    }}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Background Check Consent
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I consent to background checks as required
                    </p>
                  </div>
                </div>

                {/* Data Processing Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={complianceAndConsent.data_processing_consent || false}
                    onChange={(e) => {
                      setComplianceAndConsent({
                        ...complianceAndConsent,
                        data_processing_consent: e.target.checked
                      })
                    }}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Data Processing Consent
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I consent to processing of my data for recruitment purposes
                    </p>
                  </div>
                </div>

                {/* Communication Consent */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={complianceAndConsent.communication_consent || false}
                    onChange={(e) => {
                      setComplianceAndConsent({
                        ...complianceAndConsent,
                        communication_consent: e.target.checked
                      })
                    }}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Communication Consent
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I consent to be contacted about relevant job opportunities
                    </p>
                  </div>
                </div>

                {/* Accuracy Attestation */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={complianceAndConsent.accuracy_attestation || false}
                    onChange={(e) => {
                      setComplianceAndConsent({
                        ...complianceAndConsent,
                        accuracy_attestation: e.target.checked
                      })
                    }}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Accuracy Attestation
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I confirm that all information provided is accurate
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Regulatory Tab */}
        <div className={activeTab === 'regulatory' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regulated Occupation Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-700">
                  Many professions in Canada require licensing or certification from regulatory bodies.
                </p>

                {/* Is your occupation regulated */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Is your occupation regulated in Canada? <span className="text-red-500">*</span>
                  </label>
                  <Select 
                    name="is_occupation_regulated" 
                    defaultValue={initialData?.is_occupation_regulated as string || ''}
                    required
                    onValueChange={(value) => setIsOccupationRegulated(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes - My occupation requires licensing/registration">
                        Yes - My occupation requires licensing/registration
                      </SelectItem>
                      <SelectItem value="No - My occupation is not regulated">
                        No - My occupation is not regulated
                      </SelectItem>
                      <SelectItem value="I'm not sure">
                        I'm not sure
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Conditional fields - only show if occupation is regulated */}
                {isOccupationRegulated === 'Yes - My occupation requires licensing/registration' && (
                  <>
                    {/* Regulatory/Licensing Status */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Regulatory/Licensing Status <span className="text-red-500">*</span>
                      </label>
                      <Select 
                        name="regulatory_status" 
                        defaultValue={initialData?.regulatory_status as string || ''}
                        required
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select status..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Fully Licensed">Fully Licensed</SelectItem>
                          <SelectItem value="Licensed - Pending Renewal">Licensed - Pending Renewal</SelectItem>
                          <SelectItem value="Licensed - Expired">Licensed - Expired</SelectItem>
                          <SelectItem value="In Process - Application Submitted">In Process - Application Submitted</SelectItem>
                          <SelectItem value="In Process - Credential Assessment">In Process - Credential Assessment</SelectItem>
                          <SelectItem value="Not Yet Started">Not Yet Started</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Regulatory Body Name */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Regulatory Body Name
                      </label>
                      <Input
                        type="text"
                        name="regulatory_body_name"
                        defaultValue={initialData?.regulatory_body_name as string || ''}
                        placeholder="e.g., College of Physicians and Surgeons of Ontario"
                        className="w-full"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        The provincial or national regulatory authority for your profession.
                      </p>
                    </div>

                    {/* Regulator Website URL */}
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Regulator Website URL
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="url"
                          name="regulator_website_url"
                          defaultValue={initialData?.regulator_website_url as string || ''}
                          placeholder="https://..."
                          className="flex-1"
                        />
                        <a
                          href="https://cicic.ca"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        Link to your regulatory body (find it on cicic.ca).
                      </p>
                    </div>
                  </>
                )}

                {/* Information Box */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 flex-shrink-0 mt-0.5">
                      <Info className="h-3 w-3 text-blue-800" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2">
                        About Regulated Occupations in Canada
                      </h4>
                      <p className="text-sm text-blue-800 mb-2">
                        Examples include: Doctors, Nurses, Engineers, Architects, Teachers, Lawyers, Electricians (in some provinces), Plumbers, and many healthcare professions.
                      </p>
                      <a
                        href="https://cicic.ca"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 underline"
                      >
                        View full list of regulated occupations →
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Target Groups - Self-Identification */}
            <Card>
              <CardHeader>
                <CardTitle>Target Groups - Self-Identification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-700">
                  Canada recently. This typically refers to individuals who have not yet become citizens and, in many cases, have been in Canada for less than six years, although eligibility can vary depending on the specific program and funding source (federal, provincial, or municipal).
                </p>

                {/* Newcomer to Canada */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_newcomer_to_canada"
                    checked={isNewcomer}
                    onChange={(e) => setIsNewcomer(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Newcomer to Canada
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a newcomer to Canada recently. This typically refers to individuals who have not yet become citizens and, in many cases, have been in Canada for less than six years, although eligibility can vary depending on the specific program and funding source (federal, provincial, or municipal).
                    </p>
                    {isNewcomer && (
                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Year Arrived in Canada (Optional)
                        </label>
                        <Input
                          type="number"
                          name="year_arrived_in_canada"
                          defaultValue={initialData?.year_arrived_in_canada ? String(initialData.year_arrived_in_canada) : ''}
                          placeholder="e.g., 2022"
                          min="1900"
                          max={new Date().getFullYear()}
                          className="w-full max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Youth */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_youth"
                    defaultChecked={(initialData?.is_youth as boolean) || false}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Youth
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a young worker who may benefit from youth employment programs, on-the-job training, and mentorship opportunities
                    </p>
                  </div>
                </div>

                {/* Veteran of the Canadian Armed Forces */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_veteran_of_caf"
                    checked={isVeteran}
                    onChange={(e) => setIsVeteran(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Veteran of the Canadian Armed Forces
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a Veteran of the Canadian Armed Forces and may benefit from transition support and skills translation assistance
                    </p>
                    {isVeteran && (
                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Branch of Service (Optional)
                        </label>
                        <Input
                          type="text"
                          name="branch_of_service"
                          defaultValue={initialData?.branch_of_service as string || ''}
                          placeholder="e.g., Army, Navy, Air Force"
                          className="w-full max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Indigenous Person */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_indigenous_person"
                    checked={isIndigenous}
                    onChange={(e) => setIsIndigenous(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Indigenous Person
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am an Indigenous person (First Nations, Métis, or Inuit) and may benefit from culturally appropriate support and programs
                    </p>
                    {isIndigenous && (
                      <div className="mt-3">
                        <label className="mb-1 block text-xs font-medium text-gray-700">
                          Community or Nation (Optional)
                        </label>
                        <Input
                          type="text"
                          name="community_or_nation"
                          defaultValue={initialData?.community_or_nation as string || ''}
                          placeholder="e.g., Cree Nation, Métis"
                          className="w-full max-w-xs"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Mature Worker */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_mature_worker"
                    defaultChecked={(initialData?.is_mature_worker as boolean) || false}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Mature Worker
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a mature worker and may benefit from age-appropriate support, phased retirement options, and anti-discrimination policies
                    </p>
                  </div>
                </div>

                {/* Member of a Visible Minority */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_member_of_visible_minority"
                    checked={isVisibleMinority}
                    onChange={(e) => setIsVisibleMinority(e.target.checked)}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Member of a Visible Minority
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a member of a visible minority and may benefit from diversity and inclusion programs, mentorship, and anti-discrimination policies
                    </p>
                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={() => setShowVisibleMinorityDefinition(!showVisibleMinorityDefinition)}
                        className="flex items-center gap-2 text-xs font-medium text-gray-700 hover:text-gray-900"
                      >
                        <span>Canadian Definition</span>
                        <Info className="h-3 w-3" />
                      </button>
                      {showVisibleMinorityDefinition && (
                        <div className="mt-2 rounded-lg bg-blue-50 border border-blue-200 p-3">
                          <p className="text-xs text-blue-800">
                            In Canada, "visible minority" refers to people, other than Aboriginal peoples, who are non-Caucasian in race or non-white in color, as defined by the Employment Equity Act.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Person with Disability */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="is_person_with_disability"
                    defaultChecked={(initialData?.is_person_with_disability as boolean) || false}
                    className="mt-1 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-900 cursor-pointer">
                      Person with Disability
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      I am a person with a disability and may benefit from accessibility accommodations, assistive technology support, and inclusive workplace programs
                    </p>
                  </div>
                </div>

                {/* Privacy Information */}
                <div className="rounded-lg bg-purple-50 border border-purple-200 p-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-purple-900 mb-2">
                        Your Privacy is Protected
                      </h4>
                      <p className="text-sm text-purple-800">
                        This information is confidential and used solely for job matching purposes. Employers will not see these self-identifications unless you explicitly choose to disclose them during the application process. We use this data to help you access opportunities with employers committed to diversity and inclusion.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Other Tabs - Placeholder */}
        {activeTab !== 'personal' && activeTab !== 'work_auth' && activeTab !== 'role' && activeTab !== 'location' && activeTab !== 'availability' && activeTab !== 'compensation' && activeTab !== 'skills' && activeTab !== 'preferences' && activeTab !== 'regulatory' && (
          <div className="text-center py-12">
            <p className="text-gray-500">This section is coming soon.</p>
          </div>
        )}
      </div>
    </form>
  )
}

