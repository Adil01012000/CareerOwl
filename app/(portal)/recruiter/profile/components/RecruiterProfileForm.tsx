'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Save,
  Loader2,
  CheckCircle2,
  Info,
  Lightbulb,
  Calendar,
  Upload,
  Zap,
  Plus
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { updateRecruiterProfile } from '../actions'
import { cn } from '@/lib/utils'

interface RecruiterProfileFormProps {
  initialData: Record<string, unknown> | null
  verificationStatus: {
    businessVerification: 'verified' | 'pending' | 'rejected'
    professionalStatus: 'verified' | 'pending' | 'rejected'
    provincialRegistration: 'verified' | 'pending' | 'rejected' | 'not_required'
  }
}

export function RecruiterProfileForm({ initialData, verificationStatus }: RecruiterProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)
  const [selectedDesignation, setSelectedDesignation] = useState<string>(
    (initialData?.professional_designation as string) || ''
  )

  // State for provincial registration
  const getInitialProvinces = (): string[] => {
    if (!initialData?.operational_provinces) return []
    try {
      const provinces = initialData.operational_provinces
      if (Array.isArray(provinces)) {
        return provinces as string[]
      }
      if (typeof provinces === 'string') {
        return JSON.parse(provinces)
      }
      return []
    } catch {
      return []
    }
  }

  const [operatingInProvinces, setOperatingInProvinces] = useState<boolean>(
    (initialData?.is_operating_in_provinces as boolean) || false
  )
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>(getInitialProvinces())
  const [registrationDocuments, setRegistrationDocuments] = useState<Array<{ province: string; file: File | null; fileName: string }>>([])

  // State for industries and NOC codes (comma-separated strings)
  const getInitialIndustries = (): string => {
    if (!initialData?.primary_industries) return ''
    try {
      const industries = initialData.primary_industries
      if (Array.isArray(industries)) {
        return (industries as string[]).join(', ')
      }
      if (typeof industries === 'string') {
        const parsed = JSON.parse(industries)
        if (Array.isArray(parsed)) {
          return parsed.join(', ')
        }
      }
      return ''
    } catch {
      return ''
    }
  }

  const getInitialNocCodes = (): string => {
    if (!initialData?.noc_codes) return ''
    try {
      const codes = initialData.noc_codes
      if (Array.isArray(codes)) {
        return (codes as string[]).join(', ')
      }
      if (typeof codes === 'string') {
        const parsed = JSON.parse(codes)
        if (Array.isArray(parsed)) {
          return parsed.join(', ')
        }
      }
      return ''
    } catch {
      return ''
    }
  }

  const [primaryIndustries, setPrimaryIndustries] = useState<string>(getInitialIndustries())
  const [nocCodes, setNocCodes] = useState<string>(getInitialNocCodes())

  const provinces = [
    { code: 'ontario', name: 'Ontario', requirement: 'Registration required under EIPA' },
    { code: 'british_columbia', name: 'British Columbia', requirement: 'Employment Standards Act requirements' },
    { code: 'alberta', name: 'Alberta', requirement: 'Employment Agency Business Licence' },
    { code: 'saskatchewan', name: 'Saskatchewan', requirement: 'Employment Agencies Act registration' },
    { code: 'manitoba', name: 'Manitoba', requirement: 'Employment Standards Code compliance' },
  ]

  const handleProvinceToggle = (provinceCode: string) => {
    setSelectedProvinces(prev => {
      const newProvinces = prev.includes(provinceCode)
        ? prev.filter(p => p !== provinceCode)
        : [...prev, provinceCode]
      
      // Update hidden input for form submission
      const hiddenInput = document.getElementById(`province_${provinceCode}_hidden`) as HTMLInputElement
      if (hiddenInput) {
        hiddenInput.value = newProvinces.includes(provinceCode) ? 'true' : 'false'
      }
      
      return newProvinces
    })
  }

  const handleAddRegistration = (provinceCode: string) => {
    const province = provinces.find(p => p.code === provinceCode)
    if (province) {
      setRegistrationDocuments(prev => [...prev, { province: provinceCode, file: null, fileName: '' }])
    }
  }

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateRecruiterProfile(formData)
      setState(result)
      if (result.success) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  const getVerificationBadge = (status: 'verified' | 'pending' | 'rejected' | 'not_required') => {
    if (status === 'verified') {
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          <CheckCircle2 className="mr-1 h-3 w-3" />
          verified
        </Badge>
      )
    }
    if (status === 'rejected') {
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          rejected
        </Badge>
      )
    }
    if (status === 'not_required') {
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          not required
        </Badge>
      )
    }
    return (
      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
        pending
      </Badge>
    )
  }

  const getDesignationSubtitle = (designation: string) => {
    switch (designation) {
      case 'Registered Recruiter':
        return 'Registered with provincial employment agency regulator'
      case 'Lawyer':
        return 'Licensed to practice law in Canada'
      case 'Paralegal':
        return 'Licensed paralegal in Canada'
      case 'RCIC (Regulated Canadian Immigration Consultant)':
        return 'Regulated Canadian Immigration Consultant'
      default:
        return ''
    }
  }

  const getRegulatoryBodySubtitle = (designation: string) => {
    switch (designation) {
      case 'Registered Recruiter':
        return 'Registered with: Provincial Regulator'
      case 'Lawyer':
        return 'Registered with: Provincial Law Society'
      case 'Paralegal':
        return 'Registered with: Provincial Law Society'
      case 'RCIC (Regulated Canadian Immigration Consultant)':
        return 'Registered with: ICCRC (Immigration Consultants of Canada Regulatory Council)'
      default:
        return ''
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Header with Save and Publish Buttons */}
      <div className="flex justify-end gap-3 mb-6">
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
        <Button type="button" variant="outline">
          Publish
        </Button>
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

      {/* Verification Status */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle>Verification Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Business Verification</span>
              {getVerificationBadge(verificationStatus.businessVerification)}
            </div>
            <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Professional Status</span>
              {getVerificationBadge(verificationStatus.professionalStatus)}
            </div>
            <div className="flex items-center justify-between p-3 border border-purple-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Provincial Registration</span>
              {getVerificationBadge(verificationStatus.provincialRegistration)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Designation */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Professional Designation <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Information Box */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-200 flex-shrink-0 mt-0.5">
                <Info className="h-3 w-3 text-blue-800" />
              </div>
              <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-2">
                  Required Professional Credential
                </h4>
                <p className="text-sm text-blue-800 mb-2">
                  To operate as a recruiter on CareerOwl, you must be a <strong>Registered Recruiter, Lawyer, Paralegal, or RCIC</strong>. Your registration will be verified via AI using your registration ID.
                </p>
                <p className="text-sm text-blue-800">
                  <strong>Why this matters:</strong> CareerOwl ensures all recruiters are properly regulated professionals to protect both job seekers and employers.
                </p>
              </div>
            </div>
          </div>

          {/* Select Professional Designation */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Select Your Professional Designation <span className="text-red-500">*</span>
            </label>
            <Select 
              name="professional_designation" 
              defaultValue={initialData?.professional_designation as string || ''}
              required
              onValueChange={(value) => setSelectedDesignation(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select designation..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Registered Recruiter">Registered Recruiter</SelectItem>
                <SelectItem value="Lawyer">Lawyer</SelectItem>
                <SelectItem value="Paralegal">Paralegal</SelectItem>
                <SelectItem value="RCIC (Regulated Canadian Immigration Consultant)">RCIC (Regulated Canadian Immigration Consultant)</SelectItem>
              </SelectContent>
            </Select>
            {selectedDesignation && (
              <p className="mt-1 text-xs text-gray-500">
                {getDesignationSubtitle(selectedDesignation)}
              </p>
            )}
          </div>

          {/* Selected Designation Display */}
          {selectedDesignation && (
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm font-semibold text-gray-900 mb-1">
                Selected: {selectedDesignation}
              </p>
              <p className="text-xs text-gray-600">
                {getRegulatoryBodySubtitle(selectedDesignation)}
              </p>
            </div>
          )}

          {/* Name of Regulatory Body */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name of Regulatory Body <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="name_of_regulatory_body"
              defaultValue={initialData?.name_of_regulatory_body as string || ''}
              placeholder="e.g., ARI - Association of Recruiting & Staffing Professionals"
              required
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              Provide the full name of the regulatory body you're registered with
            </p>
          </div>

          {/* Registration ID / Membership Number */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Registration ID / Membership Number <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="registration_number"
              defaultValue={initialData?.registration_number as string || ''}
              placeholder="e.g., ARI-ON-98765"
              required
              className="w-full"
            />
            <p className="mt-1 text-xs text-gray-500">
              <strong>Important:</strong> This ID will be used for AI auto-verification with your regulatory body
            </p>
          </div>

          {/* Registration Expiry Date */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Registration Expiry Date
            </label>
            <div className="relative">
              <Input
                type="date"
                name="registration_expiry_date"
                defaultValue={initialData?.registration_expiry_date 
                  ? new Date(initialData.registration_expiry_date as string).toISOString().split('T')[0] 
                  : ''}
                className="w-full pr-10"
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Proof of Registration */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle>Proof of Registration <span className="text-red-500">*</span></CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Upload certificate, membership card, or official letter from regulatory body
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('proof-upload')?.click()}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Proof
            </Button>
            <span className="text-sm text-gray-500" id="proof-file-name">
              No file chosen
            </span>
          </div>
          <input
            type="file"
            id="proof-upload"
            name="proof_of_registration"
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden"
            required
            onChange={(e) => {
              const fileName = e.target.files?.[0]?.name || 'No file chosen'
              document.getElementById('proof-file-name')!.textContent = fileName
            }}
          />
          <p className="text-xs text-gray-500">
            Accepted formats: PDF, JPG, PNG (Max 5MB)
          </p>
          
          {/* AI Auto-Verification Info Box */}
          <div className="rounded-lg bg-green-50 border border-green-200 p-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-green-800">
                  <strong>AI Auto-Verification Enabled.</strong> Once you save, our AI will verify your registration ID with {selectedDesignation ? getRegulatoryBodySubtitle(selectedDesignation).replace('Registered with: ', '') : 'Provincial Regulator'}. Verification typically completes within minutes.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle>Business Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Legal Business Name <span className="text-red-500">*</span>
            </label>
            <Input
              type="text"
              name="legal_business_name"
              defaultValue={initialData?.legal_business_name as string || ''}
              placeholder="e.g., Elite Talent Solutions Inc."
              required
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Trade Name / DBA
            </label>
            <Input
              type="text"
              name="trade_name"
              defaultValue={initialData?.trade_name as string || ''}
              placeholder="e.g., Elite Talent Solutions"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CRA Business Number (9 digits)
            </label>
            <Input
              type="text"
              name="cra_business_number"
              defaultValue={initialData?.cra_business_number as string || ''}
              placeholder="e.g., 111222333"
              maxLength={9}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Primary Contact Email
            </label>
            <Input
              type="email"
              name="primary_contact_email"
              defaultValue={initialData?.primary_contact_email as string || ''}
              placeholder="e.g., info@elitetalent.ca"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Primary Phone
            </label>
            <Input
              type="tel"
              name="primary_phone"
              defaultValue={initialData?.primary_phone as string || ''}
              placeholder="e.g., +1-416-555-5000"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Headquarters Address
            </label>
            <Textarea
              name="headquarters_address"
              defaultValue={initialData?.headquarters_address as string || ''}
              placeholder="Enter full address"
              className="w-full"
              rows={3}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <Input
              type="url"
              name="website_url"
              defaultValue={initialData?.website_url as string || ''}
              placeholder="e.g., https://elitetalent.ca"
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Years in Business
            </label>
            <Input
              type="number"
              name="years_in_business"
              defaultValue={initialData?.years_in_business as number || ''}
              placeholder="e.g., 8"
              min={0}
              className="w-full"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              About Your Recruiting Business
            </label>
            <Textarea
              name="description"
              defaultValue={initialData?.description as string || ''}
              placeholder="Describe your recruiting services, specializations, and value proposition..."
              className="w-full"
              rows={6}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Logo
            </label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Logo
              </Button>
              <span className="text-sm text-gray-500" id="logo-file-name">
                No file chosen
              </span>
            </div>
            <input
              type="file"
              id="logo-upload"
              name="logo"
              accept="image/jpeg,image/png"
              className="hidden"
              onChange={(e) => {
                const fileName = e.target.files?.[0]?.name || 'No file chosen'
                document.getElementById('logo-file-name')!.textContent = fileName
              }}
            />
            <p className="mt-2 text-xs text-gray-500">
              JPG or PNG only, max 2MB
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Business Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Business Documents</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Business Registration Document
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Upload your business registration certificate or incorporation document
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('registration-doc-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <span className="text-sm text-gray-500" id="registration-doc-file-name">
                No file chosen
              </span>
            </div>
            <input
              type="file"
              id="registration-doc-upload"
              name="registration_document"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const fileName = e.target.files?.[0]?.name || 'No file chosen'
                document.getElementById('registration-doc-file-name')!.textContent = fileName
              }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Business License Document
            </label>
            <p className="text-sm text-gray-600 mb-3">
              Upload your business license or permit (if applicable)
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('license-doc-upload')?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
              <span className="text-sm text-gray-500" id="license-doc-file-name">
                No file chosen
              </span>
            </div>
            <input
              type="file"
              id="license-doc-upload"
              name="license_document"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => {
                const fileName = e.target.files?.[0]?.name || 'No file chosen'
                document.getElementById('license-doc-file-name')!.textContent = fileName
              }}
            />
            <p className="mt-2 text-xs text-gray-500">
              Accepted formats: PDF, JPG, PNG (Max 5MB)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Provincial Recruiter Registration */}
      <Card>
        <CardHeader>
          <CardTitle>Provincial Recruiter Registration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provincial Registration Requirements Info */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-blue-800">
                  Several Canadian provinces require employment agencies and recruiters to be registered and licensed. Select the provinces where you operate and provide registration details.
                </p>
                <p className="text-sm text-blue-800 mt-2">
                  <strong>Common requirements:</strong> Ontario (EIPA), BC (Employment Standards), Alberta (Business Licence), Saskatchewan (Employment Agencies Act), Manitoba (Employment Standards)
                </p>
              </div>
            </div>
          </div>

          {/* Operating in Provinces Checkbox */}
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={operatingInProvinces}
                onChange={(e) => setOperatingInProvinces(e.target.checked)}
                className="rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">
                Yes, I operate in provinces with registration requirements
              </span>
              <input
                type="hidden"
                name="is_operating_in_provinces"
                value={operatingInProvinces ? 'true' : 'false'}
              />
            </label>
          </div>

          {/* Province Selection Grid */}
          {operatingInProvinces && (
            <div>
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Select provinces where you operate and require registration:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {provinces.map((province) => {
                  const isChecked = selectedProvinces.includes(province.code)
                  return (
                    <div key={province.code} className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleProvinceToggle(province.code)}
                          className="mt-1 rounded border-gray-300"
                        />
                        <div className="flex-1">
                          <span className="text-sm font-medium text-gray-900 block">
                            {province.name}
                          </span>
                          <span className="text-xs text-gray-600 block mt-1">
                            {province.requirement}
                          </span>
                          <input
                            type="hidden"
                            id={`province_${province.code}_hidden`}
                            name={`province_${province.code}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </div>
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Registration Documents */}
          {operatingInProvinces && selectedProvinces.length > 0 && (
            <div>
              <div className="flex items-start gap-3 mb-3">
                <Info className="h-5 w-5 text-gray-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-600 flex-1">
                  Add registration documents for each province where you operate.
                </p>
              </div>
              <div className="space-y-3">
                {selectedProvinces.map((provinceCode) => {
                  const province = provinces.find(p => p.code === provinceCode)
                  return (
                    <div key={provinceCode} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">
                          {province?.name} Registration Document
                        </span>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById(`province-${provinceCode}-upload`)?.click()}
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          Upload
                        </Button>
                      </div>
                      <input
                        type="file"
                        id={`province-${provinceCode}-upload`}
                        name={`registration_doc_${provinceCode}`}
                        accept=".pdf,.jpg,.jpeg,.png"
                        className="hidden"
                        onChange={(e) => {
                          const fileName = e.target.files?.[0]?.name || 'No file chosen'
                          const fileNameSpan = document.getElementById(`province-${provinceCode}-file-name`)
                          if (fileNameSpan) {
                            fileNameSpan.textContent = fileName
                          }
                        }}
                      />
                      <span className="text-sm text-gray-500" id={`province-${provinceCode}-file-name`}>
                        No file chosen
                      </span>
                      <p className="mt-1 text-xs text-gray-500">
                        Accepted formats: PDF, JPG, PNG (Max 5MB)
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recruiting Specialization */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiting Specialization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Primary Industries Served
            </label>
            <Input
              type="text"
              value={primaryIndustries}
              onChange={(e) => setPrimaryIndustries(e.target.value)}
              placeholder="Comma-separated (e.g., Technology, Healthcare, Finance)"
              className="w-full"
            />
            <input
              type="hidden"
              name="primary_industries"
              value={primaryIndustries}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter industries separated by commas
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Specialization NOC Codes
            </label>
            <Input
              type="text"
              value={nocCodes}
              onChange={(e) => setNocCodes(e.target.value)}
              placeholder="Comma-separated (e.g., 21232, 10022, 11200)"
              className="w-full"
            />
            <input
              type="hidden"
              name="noc_codes"
              value={nocCodes}
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter NOC codes separated by commas
            </p>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}

