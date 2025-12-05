# Landing Page / Browse Jobs - Technical Specification

**Route:** `/` and `/jobs`  
**Auth Required:** No (Public)  
**Parent Layout:** `app/(public)/layout.tsx`  


## 2. Page Sections

### A. Hero Section
**Background:** Purple gradient (`bg-gradient-to-br from-primary to-primary-dark`)  
**Content:**
- Main heading: "Find Your Next Career in Canada"
- Subheading: "A premium job site built by CareerOwl for verified Canadian Employers and Recruiters"
- Trust badges (3 inline):
  - ✓ Canadian Employers Only
  - ✓ All Employers verified
  - ✓ More Supports for Teams

### B. Search Bar (Embedded in Hero)
**Component:** `<SearchBar />` (Client Component)  
**Fields:**
1. **Job Title/Keywords** (text input)
   - Placeholder: "Job title, keywords, or company..."
   - Icon: 🔍 (Search)
   - Full-text search on `job_posts.title` and `description_html`

2. **Location** (select dropdown)
   - Placeholder: "All Canada"
   - Options: Canadian provinces + territories
   - Maps to: `job_posts.location_province`

3. **Employment Type** (select dropdown)
   - Placeholder: "All Types"
   - Options: Full-time, Part-time, Contract, Temporary
   - Maps to: `job_posts.employment_type`

4. **Min Salary** (number input)
   - Placeholder: "Min Salary"
   - Filters: WHERE `salary_min >= input_value`

5. **Submit Button**
   - Text: "Search Jobs"
   - Style: `bg-primary text-white rounded-lg px-6 py-3`
   - Action: Calls Server Action → Updates URL params → Re-renders job list

### C. Info Bar (Below Hero)
**Content:** 
- Icon: 🛡️ (Shield)
- Text: "CareerOwl: Clean, Clear & Safe - All employers verified • Canadian businesses only • Zero tolerance for fraud"
- Link: "Learn more about our safety measures →" (future page)

### D. Main Content Area (2-Column Layout)

#### Left Sidebar (1/4 width)
**Component:** `<QuickStats />` (Server Component)  

**Quick Stats Card:**
```
📊 Quick Stats
─────────────
Active Jobs: 5
Verified Employers: 2
New This Week: 3
```

**Data Source:**
```sql
-- Active Jobs
SELECT COUNT(*) FROM job_posts WHERE status = 'published';

-- Verified Employers
SELECT COUNT(DISTINCT employer_id) FROM job_posts jp
JOIN employer_profiles ep ON jp.employer_id = ep.id
WHERE jp.status = 'published' AND ep.document_verification_status = 'verified';

-- New This Week
SELECT COUNT(*) FROM job_posts 
WHERE status = 'published' AND created_at >= NOW() - INTERVAL '7 days';
```

#### Main Content (3/4 width)
**Component:** `<JobListings />` (Server Component)

**Header Bar:**
- Left: "Showing 1-6 of 626"
- Right: Sort dropdown [Most Recent ▼] + Per-page [25] [50] [100]

**Job Cards Grid:**
- Component: `<JobCard />` (repeated, Server Component)
- Layout: Vertical stack, full width
- Spacing: `space-y-4`

---

## 3. Job Card Component Specification

### Component: `<JobCard />`

**Props:**
```typescript
interface JobCardProps {
  job: {
    id: string
    title: string
    employer: {
      legal_business_name: string
      company_logo_url: string | null
      document_verification_status: 'verified' | 'pending' | 'rejected'
    }
    location_city: string | null
    location_province: string
    employment_type: string
    salary_min: number | null
    salary_max: number | null
    salary_type: 'hourly' | 'yearly' | null
    tracking_number: number
    created_at: string
    is_esdc_compliant: boolean
  }
}
```

**Visual Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│ [Logo] Title                          💰 Salary Range       │
│        Company Name                    🎯 Employment Type    │
│        ✅ Verified  JOB-2025-005                             │
│                                                              │
│ 📍 Location                            [View Details →]     │
│ ⏰ Employment Type                                           │
│ 🏷️ [Skill] [Skill] [Skill]                                  │
│                                                              │
│ ⏱️ Posted {relative_time}                                    │
│ [LMIA Approved] (if applicable)                             │
└─────────────────────────────────────────────────────────────┘
```

**Styling:**
- Background: `bg-white`
- Border: `border border-gray-200 rounded-lg`
- Shadow: `shadow-sm hover:shadow-md transition-shadow`
- Padding: `p-6`

**Field Rendering Logic:**

| Field | Display Rule |
|-------|-------------|
| Logo | Show if exists, else show initials in colored circle |
| Verified Badge | Show `✅ Verified` only if `document_verification_status = 'verified'` |
| Tracking Number | Format: `JOB-{tracking_number}` |
| Salary | If both min/max: "$60,000 - $80,000/yr". If only min: "Starting at $60,000". If null: omit |
| Location | Format: "City, Province" or just "Province" if city is null |
| Employment Type | Badge style: `bg-blue-100 text-blue-800 px-3 py-1 rounded-full` |
| Posted Date | Relative: "2 days ago", "3 weeks ago" using `date-fns` |
| LMIA Badge | Show pink badge if `is_esdc_compliant = true` |

**Skills Tags:**
- Extract from job description (future: separate `skills` column)
- Display first 4-5 tags max
- Style: `bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm`

---

## 4. Database Queries

### Query 1: Fetch Published Jobs (with Filters)

**Server Action:** `app/(public)/actions.ts::searchJobs()`

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'

export interface JobSearchParams {
  search?: string
  province?: string
  employmentType?: string
  minSalary?: number
  page?: number
  perPage?: number
}

export async function searchJobs(params: JobSearchParams) {
  const supabase = await createClient()
  
  const {
    search = '',
    province,
    employmentType,
    minSalary,
    page = 1,
    perPage = 25
  } = params

  let query = supabase
    .from('job_posts')
    .select(`
      id,
      title,
      location_city,
      location_province,
      employment_type,
      salary_min,
      salary_max,
      salary_type,
      tracking_number,
      created_at,
      is_esdc_compliant,
      employer_profiles!inner (
        legal_business_name,
        company_logo_url,
        document_verification_status
      )
    `)
    .eq('status', 'published')

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,description_html.ilike.%${search}%`)
  }

  if (province) {
    query = query.eq('location_province', province)
  }

  if (employmentType) {
    query = query.eq('employment_type', employmentType)
  }

  if (minSalary) {
    query = query.gte('salary_min', minSalary)
  }

  // Sorting and pagination
  const offset = (page - 1) * perPage
  query = query
    .order('created_at', { ascending: false })
    .range(offset, offset + perPage - 1)

  const { data, error, count } = await query

  if (error) {
    console.error('Job search error:', error)
    return { jobs: [], total: 0, error: error.message }
  }

  return { jobs: data, total: count || 0 }
}
```

### Query 2: Get Quick Stats

**Server Action:** `app/(public)/actions.ts::getQuickStats()`

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'

export async function getQuickStats() {
  const supabase = await createClient()

  // Active Jobs
  const { count: activeJobs } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Verified Employers (with published jobs)
  const { data: verifiedEmployers } = await supabase
    .from('job_posts')
    .select('employer_id, employer_profiles!inner(document_verification_status)')
    .eq('status', 'published')
    .eq('employer_profiles.document_verification_status', 'verified')

  const uniqueEmployers = new Set(verifiedEmployers?.map(j => j.employer_id)).size

  // New This Week
  const weekAgo = new Date()
  weekAgo.setDate(weekAgo.getDate() - 7)

  const { count: newThisWeek } = await supabase
    .from('job_posts')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')
    .gte('created_at', weekAgo.toISOString())

  return {
    activeJobs: activeJobs || 0,
    verifiedEmployers: uniqueEmployers,
    newThisWeek: newThisWeek || 0
  }
}
```

---

## 5. Component Architecture

```
app/(public)/
├── layout.tsx              // Header + Footer wrapper
├── page.tsx                // Landing page (hero + search + listings)
│
└── jobs/
    ├── page.tsx            // Job listings (same as landing, different route)
    │
    └── components/
        ├── SearchBar.tsx   // Client Component (form with state)
        ├── QuickStats.tsx  // Server Component (stats display)
        ├── JobCard.tsx     // Server Component (job card UI)
        └── Pagination.tsx  // Client Component (page controls)
```

---

## 6. Styling Guide

### Colors (From Design System)
- **Primary CTA:** `bg-primary hover:bg-primary-dark text-white`
- **Verified Badge:** `bg-secondary/20 text-secondary-dark`
- **Job Card Border:** `border-gray-200`
- **Hero Background:** `bg-gradient-to-br from-primary to-primary-dark`

### Typography
- **Hero Title:** `text-5xl font-bold text-white`
- **Job Title:** `text-xl font-semibold text-dark`
- **Company Name:** `text-gray-600`
- **Body Text:** `text-gray-700`

### Spacing
- **Hero Section:** `py-20 px-4`
- **Search Bar:** `max-w-4xl mx-auto`
- **Job Cards:** `space-y-4`
- **Card Padding:** `p-6`

---

## 7. Responsive Breakpoints

- **Mobile (< 768px):**
  - Stack search filters vertically
  - Hide sidebar (show stats at top)
  - Single column job cards

- **Tablet (768px - 1024px):**
  - 2-column search form
  - Sidebar collapses to top bar

- **Desktop (> 1024px):**
  - Full layout with sidebar
  - Multi-column search form

---

## 8. Success Criteria

- [ ] Hero section matches Base44 colors exactly
- [ ] Search bar filters jobs correctly
- [ ] Job cards display all required fields
- [ ] Verified badge shows only for verified employers
- [ ] Quick stats update dynamically
- [ ] Pagination works (25/50/100 per page)
- [ ] Sorting works (most recent, salary, etc.)
- [ ] Responsive on mobile/tablet/desktop
- [ ] No layout shift on load

---

## 9. Dependencies

**Required:**
- `docs/01-design-system.md` (colors, typography)
- `components/Header.tsx` (public header)
- `components/ui/badge.tsx`, `card.tsx`, `input.tsx`, `select.tsx` (Shadcn)

**External Packages:**
```bash
npm install date-fns  # For relative time formatting
```

---

## 10. Cursor Prompt Template

```
@docs/01-design-system.md @docs/modules/public/landing-page.md 

Build the landing page (/jobs route) with the following:

1. Hero section with purple gradient background
2. Search bar (Client Component) with filters: keywords, location, type, salary
3. Quick stats sidebar (Server Component) showing active jobs, verified employers, new this week
4. Job cards grid (Server Component) displaying published jobs
5. Each job card should show: logo, title, company, location, salary, employment type, verified badge, tracking number, posted date
6. Use Tailwind classes from design system (bg-primary, text-dark, etc.)
7. Create Server Actions in app/(public)/actions.ts for searchJobs and getQuickStats
8. Make it responsive (mobile-first)


---

## End of Specification