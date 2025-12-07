'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  User, 
  Briefcase, 
  MessageSquare,
  FileText,
  Users,
  ShieldCheck,
  Building2
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  role: 'job_seeker' | 'employer' | 'recruiter' | 'advertiser' | 'esdc_officer' | 'admin'
}

export function PortalSidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const seekerLinks = [
    { href: '/seeker/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/seeker/profile', label: 'My Profile', icon: User },
    { href: '/seeker/applications', label: 'Applications', icon: Briefcase },
    { href: '/seeker/messages', label: 'Messages', icon: MessageSquare },
  ]

  const employerLinks = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/employer/company', label: 'Company Profile', icon: Building2 },
    { href: '/employer/jobs', label: 'My Jobs', icon: Briefcase },
    { href: '/employer/jobs/new', label: 'Post New Job', icon: FileText },
    { href: '/employer/messages', label: 'Messages', icon: MessageSquare },
  ]

  const recruiterLinks = [
    { href: '/recruiter/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/recruiter/profile', label: 'My Profile', icon: User },
    { href: '/recruiter/clients', label: 'Clients', icon: Building2 },
    { href: '/recruiter/jobs', label: 'Jobs', icon: Briefcase },
    { href: '/recruiter/candidates', label: 'Candidates', icon: Users },
    { href: '/recruiter/messages', label: 'Messages', icon: MessageSquare },
  ]

  const adminLinks = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/verification', label: 'Verifications', icon: ShieldCheck },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/jobs', label: 'Jobs', icon: Briefcase },
  ]

  const links = 
    role === 'job_seeker' ? seekerLinks :
    role === 'employer' ? employerLinks :
    role === 'recruiter' ? recruiterLinks :
    adminLinks

  return (
    <aside className="w-64 border-r bg-white">
      <nav className="space-y-1 p-4">
        {links.map((link) => {
          const isActive = pathname === link.href
          const Icon = link.icon

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}