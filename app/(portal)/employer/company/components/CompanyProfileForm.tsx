'use client'

import { useState, useTransition } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { 
  Building2, 
  Briefcase, 
  Users, 
  Heart, 
  Globe, 
  Award,
  CheckCircle2,
  Loader2,
  Lock,
  Info,
  MapPin,
  Factory,
  Search,
  ExternalLink
} from 'lucide-react'
import { updateCompanyProfile } from '../actions'
import { cn } from '@/lib/utils'

interface CompanyProfileFormProps {
  initialData: Record<string, unknown> | null
  verificationStatus?: 'verified' | 'pending' | 'rejected' | null
  verifiedDate?: string | null
}

const tabs = [
  { id: 'basic', label: 'Basics', icon: Building2 },
  { id: 'business', label: 'Business', icon: Briefcase },
  { id: 'industry', label: 'Industry', icon: Factory },
  { id: 'hiring', label: 'Recruitment', icon: Users },
  { id: 'benefits', label: 'Benefits', icon: Heart },
  { id: 'immigration', label: 'Compliance', icon: Globe },
]

export function CompanyProfileForm({ initialData, verificationStatus, verifiedDate }: CompanyProfileFormProps) {
  const [activeTab, setActiveTab] = useState('basic')
  const [isPending, startTransition] = useTransition()
  const [state, setState] = useState<{ success?: boolean; error?: string; message?: string } | null>(null)

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const result = await updateCompanyProfile(formData)
      setState(result)
      if (result.success) {
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Tabs Navigation */}
      <div className="border-b">
        <nav className="flex space-x-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                )}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            )
          })}
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
        {/* Basic Info Tab */}
        <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Company Logo Section */}
            <Card>
              <CardHeader>
                <CardTitle>Company Logo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-4">
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                    {initialData?.company_logo ? (
                      <img
                        src={initialData.company_logo as string}
                        alt="Company logo"
                        className="h-full w-full rounded-lg object-cover"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                      >
                        Choose file
                      </Button>
                      <span className="text-sm text-gray-500" id="file-name">
                        No file chosen
                      </span>
                    </div>
                    <input
                      type="file"
                      id="logo-upload"
                      name="company_logo"
                      accept="image/jpeg,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const fileName = e.target.files?.[0]?.name || 'No file chosen'
                        document.getElementById('file-name')!.textContent = fileName
                      }}
                    />
                    <p className="mt-2 text-xs text-gray-500">
                      JPG or PNG only, max 2MB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Basic Information Section */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Legal Business Name *
                  </label>
                  <Input
                    name="legal_business_name"
                    defaultValue={initialData?.legal_business_name as string || ''}
                    required
                    placeholder="Enter legal business name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Trade Name (DBA)
                  </label>
                  <Input
                    name="trade_name"
                    defaultValue={initialData?.trade_name as string || ''}
                    placeholder="Operating name if different"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    CRA Business Number (BN)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      name="cra_business_number"
                      defaultValue={initialData?.cra_business_number as string || ''}
                      placeholder="123456789"
                      maxLength={9}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement Auto-Verify functionality
                        console.log('Auto-Verify clicked')
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Auto-Verify
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        window.open('https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/registering-your-business/business-number.html', '_blank')
                      }}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    9-digit business number issued by CRA. Click Auto-Verify to check the registry.
                  </p>
                  {(() => {
                    const craNumber = initialData?.cra_business_number
                    if (craNumber && typeof craNumber === 'string' && craNumber.length > 0) {
                      return (
                        <div className="mt-2 rounded-lg bg-green-50 border border-green-200 p-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-800">
                              Business Number Verified
                            </span>
                          </div>
                          <p className="mt-1 text-xs text-green-700">
                            Status: Active
                          </p>
                        </div>
                      )
                    }
                    return null
                  })()}
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Year Founded
                  </label>
                  <Input
                    type="number"
                    name="year_founded"
                    defaultValue={initialData?.year_founded as number || ''}
                    placeholder="e.g., 2010"
                    min="1800"
                    max={new Date().getFullYear()}
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
                    placeholder="https://example.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Headquarters Address
                  </label>
                  <Input
                    name="headquarters_address"
                    defaultValue={initialData?.headquarters_address as string || ''}
                    placeholder="Enter full address"
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
                    placeholder="hr@company.com"
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
                    placeholder="+1-416-555-1000"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Company Description
                  </label>
                  <textarea
                    name="company_description"
                    defaultValue={initialData?.company_description as string || ''}
                    rows={6}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Tell us about your company..."
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Verification Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle>Business Verification Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    CareerOwl: Clean, Clear and Safe
                  </h3>
                  <p className="mb-4 text-sm text-gray-700">
                    Business verification is mandatory to protect job seekers from fraudulent employers and scams. 
                    This critical step ensures our platform remains a trusted, safe marketplace for Canadian employment.
                  </p>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">What Verification Provides:</p>
                    <ul className="ml-4 list-disc space-y-1 text-sm text-gray-700">
                      <li>
                        <strong>Trust Badge:</strong> "Verified Employer" badge on all your job postings
                      </li>
                      <li>
                        <strong>Candidate Confidence:</strong> Job seekers trust verified employers more
                      </li>
                      <li>
                        <strong>Platform Access:</strong> Required to post jobs and search candidate database
                      </li>
                      <li>
                        <strong>Fraud Prevention:</strong> Protects both employers and job seekers
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Banner */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 flex items-start gap-3">
              <Lock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong>Your Privacy:</strong> Documents are reviewed securely and used solely for verification. 
                They are never shared publicly or with candidates.
              </p>
            </div>

            {/* Verification Status Banner */}
            {verificationStatus === 'verified' && (
              <div className="rounded-lg bg-green-50 border border-green-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-semibold text-green-800">
                    Business Verified
                  </span>
                </div>
                <p className="text-sm text-green-700">
                  Your business was verified{verifiedDate ? ` on ${new Date(verifiedDate).toLocaleDateString()}` : ''}. 
                  All your job postings now display the 'Verified Employer' badge.
                </p>
              </div>
            )}

            {/* Business Registration Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  1. Business Registration <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Required Document</p>
                      <p className="text-sm text-blue-800">
                        Upload your Certificate of Incorporation or Business Registration from your provincial government 
                        or Corporations Canada. This proves your business is legally registered.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Issued By <span className="text-red-500">*</span>
                  </label>
                  <Select name="issued_by" defaultValue={initialData?.issued_by as string || ''} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select issuing authority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Corporations Canada">Corporations Canada</SelectItem>
                      <SelectItem value="Alberta">Alberta</SelectItem>
                      <SelectItem value="British Columbia">British Columbia</SelectItem>
                      <SelectItem value="Manitoba">Manitoba</SelectItem>
                      <SelectItem value="New Brunswick">New Brunswick</SelectItem>
                      <SelectItem value="Newfoundland and Labrador">Newfoundland and Labrador</SelectItem>
                      <SelectItem value="Northwest Territories">Northwest Territories</SelectItem>
                      <SelectItem value="Nova Scotia">Nova Scotia</SelectItem>
                      <SelectItem value="Nunavut">Nunavut</SelectItem>
                      <SelectItem value="Ontario">Ontario</SelectItem>
                      <SelectItem value="Prince Edward Island">Prince Edward Island</SelectItem>
                      <SelectItem value="Quebec">Quebec</SelectItem>
                      <SelectItem value="Saskatchewan">Saskatchewan</SelectItem>
                      <SelectItem value="Yukon">Yukon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Upload Registration Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('registration-doc-upload')?.click()}
                    >
                      Choose file
                    </Button>
                    <span className="text-sm text-gray-500" id="registration-file-name">
                      No file chosen
                    </span>
                  </div>
                  <input
                    type="file"
                    id="registration-doc-upload"
                    name="registration_document"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    required
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || 'No file chosen'
                      document.getElementById('registration-file-name')!.textContent = fileName
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Business Licence Section */}
            <Card>
              <CardHeader>
                <CardTitle>
                  2. Business Licence <span className="text-red-500">*</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Required Document</p>
                      <p className="text-sm text-blue-800">
                        Most businesses require a municipal or provincial business licence. If your business is exempt 
                        (e.g., certain professional services), you must provide proof of exemption.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="exempt_business_license"
                      defaultChecked={initialData?.exempt_business_license as boolean || false}
                      className="rounded border-gray-300"
                      onChange={(e) => {
                        const licenseSection = document.getElementById('license-fields-section')
                        const licenseUpload = document.getElementById('license-doc-upload') as HTMLInputElement
                        const licenseFileName = document.getElementById('license-file-name')
                        if (e.target.checked) {
                          if (licenseSection) licenseSection.style.display = 'none'
                          licenseUpload.required = false
                          if (licenseFileName) licenseFileName.textContent = 'No file chosen'
                        } else {
                          if (licenseSection) licenseSection.style.display = 'block'
                          licenseUpload.required = true
                        }
                      }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                      My business is exempt from business licence requirements
                    </span>
                  </label>
                </div>

                <div id="license-fields-section" style={{ display: initialData?.exempt_business_license ? 'none' : 'block' }}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Licence Number <span className="text-red-500">*</span>
                      </label>
                      <Input
                        name="license_number"
                        defaultValue={initialData?.license_number as string || ''}
                        placeholder="e.g., BL-2024-12345"
                        required
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Issue Date <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="date"
                        name="issue_date"
                        defaultValue={initialData?.issue_date ? new Date(initialData.issue_date as string).toISOString().split('T')[0] : ''}
                        required
                        className="[&::-webkit-calendar-picker-indicator]:cursor-pointer"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Expiry Date <span className="text-red-500">*</span>
                    </label>
                    <Input
                      type="date"
                      name="expiry_date"
                      defaultValue={initialData?.expiry_date ? new Date(initialData.expiry_date as string).toISOString().split('T')[0] : ''}
                      required
                      className="[&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                  </div>
                </div>

                <div id="license-upload-section">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Upload Licence Document <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('license-doc-upload')?.click()}
                    >
                      Choose file
                    </Button>
                    <span className="text-sm text-gray-500" id="license-file-name">
                      No file chosen
                    </span>
                  </div>
                  <input
                    type="file"
                    id="license-doc-upload"
                    name="license_document"
                    accept=".pdf,.jpg,.jpeg,.png"
                    className="hidden"
                    required={!initialData?.exempt_business_license}
                    onChange={(e) => {
                      const fileName = e.target.files?.[0]?.name || 'No file chosen'
                      document.getElementById('license-file-name')!.textContent = fileName
                    }}
                  />
                </div>

                {/* Warning Message */}
                {(() => {
                  const hasLicenseNumber = initialData?.license_number && typeof initialData.license_number === 'string' && initialData.license_number.length > 0
                  const hasIssueDate = initialData?.issue_date
                  const hasExpiryDate = initialData?.expiry_date
                  const hasLicenseDoc = false // TODO: Check if file is uploaded
                  const isExempt = initialData?.exempt_business_license as boolean || false
                  
                  if (!isExempt && (!hasLicenseNumber || !hasIssueDate || !hasExpiryDate || !hasLicenseDoc)) {
                    return (
                      <div className="rounded-lg bg-orange-50 border border-orange-200 p-4">
                        <div className="flex items-start gap-3">
                          <svg className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <div>
                            <p className="text-sm font-medium text-orange-900 mb-1">Missing Required Documents</p>
                            <p className="text-sm text-orange-800">
                              Please upload all required business documents to complete verification. 
                              This is a mandatory step to access CareerOwl's platform features.
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  }
                  return null
                })()}

                {/* Accepted Document Formats Info */}
                <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 mb-1">Accepted Document Formats</p>
                      <p className="text-sm text-blue-800">
                        PDF, JPG, PNG (Max 2MB per file). Ensure all text is clear and legible.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Business Details Tab */}
        <div className={activeTab === 'business' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Business Size & Type Section */}
            <Card>
              <CardHeader>
                <CardTitle>Business Size & Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Business Type
                    </label>
                    <Select name="business_type" defaultValue={initialData?.business_type as string || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Corporation">Corporation</SelectItem>
                        <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                        <SelectItem value="Partnership">Partnership</SelectItem>
                        <SelectItem value="Non Profit">Non Profit</SelectItem>
                        <SelectItem value="Public Sector">Public Sector</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Annual Revenue (Approx.)
                    </label>
                    <Select name="annual_revenue" defaultValue={initialData?.annual_revenue as string || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Under $500K">Under $500K</SelectItem>
                        <SelectItem value="$500K-$1M">$500K-$1M</SelectItem>
                        <SelectItem value="$1M-$5M">$1M-$5M</SelectItem>
                        <SelectItem value="$5M-$50M">$5M-$50M</SelectItem>
                        <SelectItem value="$50M+">$50M+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Ownership Model
                    </label>
                    <Select name="ownership_model" defaultValue={initialData?.ownership_model as string || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select model" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Founder Owned">Founder Owned</SelectItem>
                        <SelectItem value="Private Equity">Private Equity</SelectItem>
                        <SelectItem value="Publicly Traded">Publicly Traded</SelectItem>
                        <SelectItem value="Franchise">Franchise</SelectItem>
                        <SelectItem value="Cooperative">Cooperative</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Company Size (Employees)
                    </label>
                    <Select name="company_size" defaultValue={initialData?.company_size as string || ''}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select company size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1-10">1-10</SelectItem>
                        <SelectItem value="11-50">11-50</SelectItem>
                        <SelectItem value="51-200">51-200</SelectItem>
                        <SelectItem value="201-500">201-500</SelectItem>
                        <SelectItem value="500+">500+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2">
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Total Number of Locations
                    </label>
                    <Input
                      type="number"
                      name="no_of_locations"
                      defaultValue={initialData?.no_of_locations as number || ''}
                      placeholder="e.g., 1, 5, 20"
                      min="1"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Include headquarters in this count.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Location Section */}
            <Card>
              <CardHeader>
                <CardTitle>Business Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Main Office Card */}
                <div className="rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <Building2 className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900">Main Office</h3>
                        <Badge className="bg-primary text-white text-xs">
                          Headquarters
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {initialData?.headquarters_address as string || '100 King St W, Toronto, ON M5X 1C7'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600">
                  Set the "Total Number of Locations" to more than 1 to add additional branch locations.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Industry Tab */}
        <div className={activeTab === 'industry' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Industry & Market Focus</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Industry */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Primary Industry
                  </label>
                  <Input
                    name="primary_industry"
                    defaultValue={initialData?.primary_industry as string || ''}
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>

                {/* NAICS Code */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    NAICS Code (Industry Classification)
                  </label>
                  <div className="flex items-center gap-2">
                    <Input
                      name="naics_code"
                      defaultValue={initialData?.naics_code as string || ''}
                      placeholder="e.g., 541510"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // TODO: Implement NAICS search functionality
                        window.open('https://www.statcan.gc.ca/en/subjects/standard/naics/2017/index', '_blank')
                      }}
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Search
                    </Button>
                  </div>
                  
                  {/* NAICS Info Box */}
                  <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-blue-900 mb-1">What is a NAICS code?</p>
                        <p className="text-sm text-blue-800 mb-2">
                          The North American Industry Classification System (NAICS) is the standard used by Statistics Canada 
                          to classify business establishments. It helps categorize your business by industry sector.
                        </p>
                        <a
                          href="https://www.statcan.gc.ca/en/subjects/standard/naics/2017/index"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-700 hover:text-blue-900 underline inline-flex items-center gap-1"
                        >
                          Search NAICS by industry
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Products/Services */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Primary Products/Services
                  </label>
                  <textarea
                    name="primary_products"
                    defaultValue={initialData?.primary_products as string || ''}
                    rows={4}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="Brief description of what you offer."
                  />
                </div>

                {/* Target Client Segments */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Target Client Segments
                  </label>
                  <div className="space-y-2">
                    {['B2B', 'B2C', 'GOVERNMENT', 'NONPROFIT', 'INTERNAL', 'OTHER'].map((segment) => {
                      const segmentKey = segment.toLowerCase()
                      const targetSegments = initialData?.target_client_segment as Record<string, unknown> | null
                      const isChecked = targetSegments?.[segmentKey] === true || false
                      
                      return (
                        <label key={segment} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              // Update hidden input for form submission
                              const hiddenInput = document.getElementById(`target_segment_${segmentKey}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{segment}</span>
                          <input
                            type="hidden"
                            id={`target_segment_${segmentKey}`}
                            name={`target_segment_${segmentKey}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Regulated Industry */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Regulated Industry?
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="regulated_industry"
                      defaultChecked={initialData?.regulated_industry as boolean || false}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      This is a regulated industry (e.g., Healthcare, Finance, Aviation).
                    </span>
                  </label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recruitment Tab */}
        <div className={activeTab === 'hiring' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            {/* Recruitment Section */}
            <Card>
              <CardHeader>
                <CardTitle>Recruitment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Actively Hiring?
                  </label>
                  <Select name="actively_hiring" defaultValue={initialData?.actively_hiring as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Seasonal">Seasonal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Annual Hiring Volume
                  </label>
                  <Select name="annual_hiring_volume" defaultValue={initialData?.annual_hiring_volume as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-5">1-5</SelectItem>
                      <SelectItem value="6-20">6-20</SelectItem>
                      <SelectItem value="21-50">21-50</SelectItem>
                      <SelectItem value="50+">50+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Applicant Tracking System (ATS)
                  </label>
                  <Select name="applicant_tracking_system" defaultValue={initialData?.applicant_tracking_system as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="CareerOwl">CareerOwl</SelectItem>
                      <SelectItem value="Bamboo HR">Bamboo HR</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select the recruitment software you use to manage applications.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Culture & Work Model Section */}
            <Card>
              <CardHeader>
                <CardTitle>Culture & Work Model</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Work Model
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'onsite', label: 'Onsite' },
                      { key: 'remote_first', label: 'Remote First' },
                      { key: 'hybrid', label: 'Hybrid' },
                      { key: 'remote_optional', label: 'Remote Optional' }
                    ].map((option) => {
                      const workModel = initialData?.work_model as Record<string, unknown> | null
                      const isChecked = workModel?.[option.key] === true || false
                      
                      return (
                        <label key={option.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              const hiddenInput = document.getElementById(`work_model_${option.key}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <input
                            type="hidden"
                            id={`work_model_${option.key}`}
                            name={`work_model_${option.key}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Dress Code
                  </label>
                  <Select name="dress_code" defaultValue={initialData?.dress_code as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Formal">Formal</SelectItem>
                      <SelectItem value="Business Casual">Business Casual</SelectItem>
                      <SelectItem value="Casual">Casual</SelectItem>
                      <SelectItem value="Uniform">Uniform</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Diversity & Inclusion Policies Section */}
            <Card>
              <CardHeader>
                <CardTitle>Diversity & Inclusion Policies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { key: 'dei_policy', label: 'Dei Policy' },
                    { key: 'pay_equity_audits', label: 'Pay Equity Audits' },
                    { key: 'none', label: 'None' },
                    { key: 'employee_resource_groups', label: 'Employee Resource Groups' },
                    { key: 'accessibility_plan', label: 'Accessibility Plan' }
                  ].map((policy) => {
                    const diversityPolicies = initialData?.diversity_policies as Record<string, unknown> | null
                    const isChecked = diversityPolicies?.[policy.key] === true || false
                    
                    return (
                      <label key={policy.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={isChecked}
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            const hiddenInput = document.getElementById(`diversity_${policy.key}`) as HTMLInputElement
                            if (hiddenInput) {
                              hiddenInput.value = e.target.checked ? 'true' : 'false'
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{policy.label}</span>
                        <input
                          type="hidden"
                          id={`diversity_${policy.key}`}
                          name={`diversity_${policy.key}`}
                          defaultValue={isChecked ? 'true' : 'false'}
                        />
                      </label>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Company Values Section */}
            <Card>
              <CardHeader>
                <CardTitle>Company Values</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { key: 'integrity', label: 'Integrity' },
                    { key: 'collaboration', label: 'Collaboration' },
                    { key: 'innovation', label: 'Innovation' },
                    { key: 'sustainability', label: 'Sustainability' },
                    { key: 'impact', label: 'Impact' },
                    { key: 'other', label: 'Other' }
                  ].map((value) => {
                    const companyValues = initialData?.company_values as Record<string, unknown> | null
                    const valuesArray = companyValues?.values as string[] | null
                    const isChecked = valuesArray?.includes(value.label) || false
                    
                    return (
                      <label key={value.key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          defaultChecked={isChecked}
                          className="rounded border-gray-300"
                          onChange={(e) => {
                            const hiddenInput = document.getElementById(`company_value_${value.key}`) as HTMLInputElement
                            if (hiddenInput) {
                              hiddenInput.value = e.target.checked ? 'true' : 'false'
                            }
                          }}
                        />
                        <span className="text-sm text-gray-700">{value.label}</span>
                        <input
                          type="hidden"
                          id={`company_value_${value.key}`}
                          name={`company_value_${value.key}`}
                          defaultValue={isChecked ? 'true' : 'false'}
                        />
                      </label>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Tab */}
        <div className={activeTab === 'benefits' ? 'block' : 'hidden'}>
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-dark mb-2">General Business Benefits & Perks</h2>
              <p className="text-sm text-gray-600">
                Overview of benefits typically offered across your organization
              </p>
            </div>

            {/* Info Note */}
            <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Note about job-specific benefits</p>
                  <p className="text-sm text-blue-800">
                    These are your general business benefits. When creating individual job postings, you'll be able to 
                    specify which benefits apply to each specific role. Job-specific benefits may differ from these general 
                    benefits based on position, department, or employment type.
                  </p>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6 space-y-6">
                {/* Health & Dental Benefits */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Health & Dental Benefits
                  </label>
                  <Select name="health_benefits" defaultValue={initialData?.health_benefits as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="After Probation">After Probation</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Retirement Plans */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Retirement Plans
                  </label>
                  <Select name="retirement_plans" defaultValue={initialData?.retirement_plans as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="RRSP Match">RRSP Match</SelectItem>
                      <SelectItem value="Pension Plan">Pension Plan</SelectItem>
                      <SelectItem value="ESPP">ESPP</SelectItem>
                      <SelectItem value="None">None</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Paid Time Off */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Paid Time Off (Days per year)
                  </label>
                  <Input
                    type="number"
                    name="paid_time_off"
                    defaultValue={initialData?.paid_time_off as number || ''}
                    placeholder="e.g., 15"
                    min="0"
                  />
                </div>

                {/* Flexible Hours */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Flexible Hours
                  </label>
                  <Select name="flexible_hours" defaultValue={initialData?.flexible_hours as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Case by Case">Case by Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remote Work Support */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Remote Work Support
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'stipend', label: 'Stipend' },
                      { key: 'equipment', label: 'Equipment' },
                      { key: 'none', label: 'None' }
                    ].map((option) => {
                      const remoteWorkSupport = initialData?.remote_work_support as Record<string, unknown> | null
                      const isChecked = remoteWorkSupport?.[option.key] === true || false
                      
                      return (
                        <label key={option.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              const hiddenInput = document.getElementById(`remote_work_${option.key}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <input
                            type="hidden"
                            id={`remote_work_${option.key}`}
                            name={`remote_work_${option.key}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Learning & Development */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Learning & Development
                  </label>
                  <div className="space-y-2">
                    {[
                      { key: 'tuition_aid', label: 'Tuition Aid' },
                      { key: 'conferences', label: 'Conferences' },
                      { key: 'internal_programs', label: 'Internal Programs' },
                      { key: 'dedicated_time', label: 'Dedicated Time' },
                      { key: 'none', label: 'None' }
                    ].map((option) => {
                      const learningDev = initialData?.learning_and_development as Record<string, unknown> | null
                      const programs = learningDev?.programs as string[] | null
                      const isChecked = programs?.includes(option.label) || false
                      
                      return (
                        <label key={option.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              const hiddenInput = document.getElementById(`learning_${option.key}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{option.label}</span>
                          <input
                            type="hidden"
                            id={`learning_${option.key}`}
                            name={`learning_${option.key}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Relocation Assistance */}
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Relocation Assistance
                  </label>
                  <Select name="relocation_assistance" defaultValue={initialData?.relocation_assistance as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Case by Case">Case by Case</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Compliance Tab */}
        <div className={activeTab === 'immigration' ? 'block' : 'hidden'}>
          <div className="space-y-8">
            {/* Government Programs (Canada) Section */}
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">Government Programs (Canada)</h2>
              
              {/* Info Box */}
              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    These programs help with hiring international talent and immigration pathways.
                  </p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    LMIA Employer?
                  </label>
                  <Select name="lmia_employer" defaultValue={initialData?.lmia_employer as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Previously">Previously</SelectItem>
                      <SelectItem value="Willing">Willing</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-1 text-xs text-gray-500">
                    Labour Market Impact Assessment
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Recognized Employer Pilot
                  </label>
                  <Select name="recognized_employer_pilot" defaultValue={initialData?.recognized_employer_pilot as string || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Applied">Applied</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Designated Learning Institution (DLI)?
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="designated_learning_institution"
                      defaultChecked={initialData?.designated_learning_institution as boolean || false}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm text-gray-700">
                      We are a Designated Learning Institution
                    </span>
                  </label>
                  <p className="mt-1 text-xs text-gray-500">
                    For post-secondary educational institutions
                  </p>
                </div>
              </div>
            </div>

            {/* ESG & Impact Section */}
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">ESG & Impact</h2>
              
              <div className="space-y-6">
                {/* Environmental Certifications */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Environmental Certifications</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'b_corp', label: 'B Corp' },
                      { key: 'net_zero_pledge', label: 'Net Zero Pledge' },
                      { key: 'iso_14001', label: 'Iso 14001' },
                      { key: 'none', label: 'None' }
                    ].map((cert) => {
                      const envCert = initialData?.environmental_certification as Record<string, unknown> | null
                      const certifications = envCert?.certifications as string[] | null
                      const isChecked = certifications?.includes(cert.label) || (cert.key === 'none' && (!certifications || certifications.length === 0)) || false
                      
                      return (
                        <label key={cert.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              const hiddenInput = document.getElementById(`env_cert_${cert.key}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{cert.label}</span>
                          <input
                            type="hidden"
                            id={`env_cert_${cert.key}`}
                            name={`env_cert_${cert.key}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Community Involvement */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Community Involvement</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { key: 'volunteering', label: 'Volunteering' },
                      { key: 'sponsorships', label: 'Sponsorships' },
                      { key: 'donations', label: 'Donations' },
                      { key: 'local_sourcing', label: 'Local Sourcing' }
                    ].map((involvement) => {
                      const communityInv = initialData?.community_involvement as Record<string, unknown> | null
                      const isChecked = communityInv?.[involvement.key] === true || false
                      
                      return (
                        <label key={involvement.key} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            defaultChecked={isChecked}
                            className="rounded border-gray-300"
                            onChange={(e) => {
                              const hiddenInput = document.getElementById(`community_${involvement.key}`) as HTMLInputElement
                              if (hiddenInput) {
                                hiddenInput.value = e.target.checked ? 'true' : 'false'
                              }
                            }}
                          />
                          <span className="text-sm text-gray-700">{involvement.label}</span>
                          <input
                            type="hidden"
                            id={`community_${involvement.key}`}
                            name={`community_${involvement.key}`}
                            defaultValue={isChecked ? 'true' : 'false'}
                          />
                        </label>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Public Ratings & Recognition Section */}
            <div>
              <h2 className="text-2xl font-bold text-dark mb-4">Public Ratings & Recognition</h2>
              
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Glassdoor Rating
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      name="glassdoor_rating"
                      defaultValue={initialData?.glassdoor_rating as number || ''}
                      placeholder="e.g., 4.2"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Indeed Rating
                    </label>
                    <Input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      name="indeed_rating"
                      defaultValue={initialData?.indeed_rating as number || ''}
                      placeholder="e.g., 4.5"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Awards & Recognition
                  </label>
                  <textarea
                    name="awards_and_recognition"
                    defaultValue={initialData?.awards_and_recognition as string || ''}
                    rows={4}
                    className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    placeholder="e.g., Best Employer 2024, Top 100 Companies"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-4 border-t pt-6">
        <Button type="button" variant="outline" onClick={() => window.location.reload()}>
          Cancel
        </Button>
        <Button type="submit" className="bg-primary" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  )
}

