import Link from 'next/link'
import { 
  User, 
  Building2, 
  Users, 
  Check
} from 'lucide-react'

const accountTypes = [
  {
    id: 'job_seeker',
    title: 'Job Seeker',
    description: 'Find your next career opportunity in Canada',
    icon: User,
    iconColor: 'bg-blue-500',
    features: [
      'Browse verified jobs',
      'Track applications',
      'Get matched with employers'
    ],
    href: '/register?role=job_seeker'
  },
  {
    id: 'employer',
    title: 'Employer',
    description: 'Post jobs and find qualified Canadian talent',
    icon: Building2,
    iconColor: 'bg-purple-500',
    features: [
      'Post job openings',
      'Search candidate database',
      'Manage applications'
    ],
    href: '/register?role=employer'
  },
  {
    id: 'recruiter',
    title: 'Recruiter',
    description: 'Manage multiple employer clients and placements',
    icon: Users,
    iconColor: 'bg-purple-400',
    features: [
      'Manage employer clients',
      'Post on behalf of clients',
      'Access candidate database'
    ],
    href: '/register?role=recruiter'
  },
//   {
//     id: 'advertiser',
//     title: 'Advertiser',
//     description: 'Promote your business with banner advertising',
//     icon: Megaphone,
//     iconColor: 'bg-pink-500',
//     features: [
//       'Banner ad campaigns',
//       'Performance analytics',
//       'Targeted advertising'
//     ],
//     href: '/register?role=advertiser'
//   },
//   {
//     id: 'esdc_officer',
//     title: 'ESDC Officer',
//     description: 'Access job posting data for LMIA verification',
//     icon: Shield,
//     iconColor: 'bg-green-500',
//     features: [
//       'Job lookup access',
//       'LMIA verification',
//       'Compliance reporting'
//     ],
//     href: '/register?role=esdc_officer'
//   }
]

export default function RoleSelectionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Content */}
        <div className="mx-auto max-w-6xl">
          {/* Title Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-4xl font-bold text-gray-900">
              Choose Your Account Type
            </h2>
            <p className="text-lg text-gray-600">
              Select the portal you want to access
            </p>
          </div>

          {/* Account Type Cards */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accountTypes.map((accountType) => {
              const IconComponent = accountType.icon
              return (
                <Link
                  key={accountType.id}
                  href={accountType.href}
                  className="group"
                >
                  <div className="h-full rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-lg hover:scale-[1.02]">
                    {/* Icon */}
                    <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg ${accountType.iconColor} text-white`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* Title */}
                    <h3 className="mb-2 text-xl font-bold text-gray-900">
                      {accountType.title}
                    </h3>

                    {/* Description */}
                    <p className="mb-4 text-sm text-gray-600">
                      {accountType.description}
                    </p>

                    {/* Features */}
                    <ul className="space-y-2">
                      {accountType.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

