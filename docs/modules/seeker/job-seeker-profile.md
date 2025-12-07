# Job Seeker Profile Module Documentation

## Overview

The Job Seeker Profile module allows job seekers to create and manage comprehensive professional profiles. This information is used to match job seekers with relevant opportunities, verify identity, and provide detailed information to employers and recruiters.

## Database Schema

### Table: `job_seeker_profile`

The `job_seeker_profile` table stores comprehensive job seeker information including personal details, work authorization, skills, preferences, and regulatory information.

**Primary Key:** `id` (BIGSERIAL) - Links to `profiles.id` (user ID)

**Timestamps:**
- `created_at` (TIMESTAMPTZ) - Auto-set on creation
- `updated_at` (TIMESTAMPTZ) - Auto-updated via trigger

### Schema Structure

#### 1. Identity & Verification

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `id` | BIGSERIAL | Yes | Primary key, links to user ID |
| `profile_photo` | TEXT | No | URL to profile photo image |
| `show_profile_photo` | BOOLEAN | No | Whether to show photo publicly (default: true) |
| `government_issued_id_one` | TEXT | No | URL to first government-issued ID document |
| `government_issued_id_two` | TEXT | No | URL to second government-issued ID document |

#### 2. Personal Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `title` | `js_title_enum` | No | Personal title (Mr., Mrs., Ms., etc.) |
| `pronouns` | `js_pronouns_enum` | No | Preferred pronouns |
| `legal_first_name` | VARCHAR(255) | Yes | Legal first name |
| `middle_name` | VARCHAR(255) | No | Middle name |
| `legal_last_name` | VARCHAR(255) | Yes | Legal last name |
| `preferred_name` | VARCHAR(255) | No | Preferred name |
| `phone_number` | VARCHAR(50) | No | Mobile phone number |
| `city` | VARCHAR(255) | No | City of residence |
| `province` | VARCHAR(255) | No | Province/State |
| `postal_code` | VARCHAR(50) | No | Postal/ZIP code |
| `country_id` | INT | No | Country ID reference |
| `date_of_birth` | DATE | No | Date of birth |

#### 3. Demographic Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `gender` | `js_gender_enum` | No | Gender identity |
| `ethnicity` | `js_ethnicity_enum` | No | Ethnicity |
| `veteran_status` | `js_veteran_status_enum` | No | Veteran status |
| `disability_status` | `js_disability_status_enum` | No | Disability status |

#### 4. Professional Links

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `linkedin_url` | TEXT | No | LinkedIn profile URL |
| `portfolio` | TEXT | No | Portfolio/Website URL |
| `github_url` | TEXT | No | GitHub profile URL |
| `additional_email_addresses` | JSONB | No | Array of additional email addresses |

#### 5. Work Authorization

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `work_status` | TEXT | No | Current work authorization status |
| `open_work_or_restricted` | TEXT | No | Open work permit or restricted |
| `work_permit_expiry_date` | DATE | No | Work permit expiry date |
| `need_sponsorship` | TEXT | No | Whether sponsorship is needed |
| `work_permit_province` | TEXT | No | Province of work permit |
| `immigration_support_needed` | TEXT | No | Immigration support requirements |

#### 6. Role & Employment Preferences

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `target_job_titles` | JSONB | No | Array of target job titles |
| `primary_noc_code` | TEXT | No | Primary NOC code (5 digits) |
| `seniority_level` | `js_seniority_level_enum` | No | Seniority level |
| `employment_type` | JSONB | No | Preferred employment types |
| `work_setting_preference` | JSONB | No | Work setting preferences |

#### 7. Location & Availability

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `relocation_willingness` | `js_relocation_willingness_enum` | No | Willingness to relocate |
| `max_commute_time` | INT | No | Maximum commute time in minutes |
| `travel_willingness` | `js_travel_willingness_enum` | No | Travel percentage willingness |
| `driver_license_class` | JSONB | No | Driver's license classes |
| `personal_vehicle` | `js_personal_vehicle_enum` | No | Personal vehicle availability |
| `earliest_start_date` | DATE | No | Earliest available start date |
| `notice_period` | `js_notice_period_enum` | No | Notice period required |
| `weekly_availability` | JSONB | No | Weekly availability schedule |
| `shift_flexibility` | JSONB | No | Shift flexibility options |

#### 8. Compensation

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `salary_expectation` | INT | No | Expected salary |
| `salary_type` | `js_salary_type_enum` | No | Annual or hourly |
| `currency` | `js_currency_enum` | No | Currency (CAD, USD, etc.) |
| `minimum_acceptable_offer` | INT | No | Minimum acceptable salary |
| `compensation_types` | JSONB | No | Types of compensation desired |

#### 9. Skills & Experience

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `years_of_experience` | INT | No | Total years of experience |
| `core_skills` | JSONB | No | Array of core skills with years |
| `tools_and_technologies` | JSONB | No | Array of tools/technologies with proficiency |
| `industry_experience` | JSONB | No | Array of industry experience |
| `people_leadership` | `js_people_leadership_enum` | No | People leadership experience |
| `budget_responsibility` | `js_budget_responsibility_enum` | No | Budget/P&L responsibility |
| `accomplishments` | JSONB | No | Array of top accomplishments |

#### 10. Work Preferences

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `team_environment` | `js_team_environment_enum` | No | Preferred team environment |
| `management_style` | `js_management_style_enum` | No | Preferred management style |
| `company_size` | `js_company_size_enum` | No | Preferred company size |
| `js_references` | `js_references_enum` | No | Reference availability |
| `values_and_motivators` | JSONB | No | Values and motivators |
| `compliance_and_consent` | JSONB | No | Compliance and consent flags |

#### 11. Regulatory Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `is_occupation_regulated` | TEXT | No | Whether occupation is regulated |
| `regulatory_status` | TEXT | No | Regulatory/licensing status |
| `regulatory_body_name` | TEXT | No | Name of regulatory body |
| `regulator_website_url` | TEXT | No | URL to regulator website |

#### 12. Target Groups

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `is_person_with_disability` | BOOLEAN | No | Person with disability flag |
| `is_newcomer_to_canada` | BOOLEAN | No | Newcomer to Canada flag |
| `year_arrived_in_canada` | INT | No | Year arrived in Canada |
| `is_youth` | BOOLEAN | No | Youth status flag |
| `is_veteran_of_caf` | BOOLEAN | No | Canadian Armed Forces veteran flag |
| `branch_of_service` | TEXT | No | Branch of service |
| `is_indigenous_person` | BOOLEAN | No | Indigenous person flag |
| `community_or_nation` | TEXT | No | Community or nation |
| `is_mature_worker` | BOOLEAN | No | Mature worker flag |
| `is_member_of_visible_minority` | BOOLEAN | No | Visible minority member flag |

### Enum Types

#### `js_title_enum`
- `'Mr.'`, `'Mrs.'`, `'Ms.'`, `'Miss.'`, `'Dr.'`, `'Prof.'`, `'Mx.'`, `'Other'`

#### `js_pronouns_enum`
- `'he/him'`, `'she/her'`, `'they/them'`, `'Other'`, `'Prefer not to say'`

#### `js_gender_enum`
- `'Male'`, `'Female'`, `'Non Binary'`, `'Genderqueer'`, `'Genderfluid'`, `'Agender'`, `'Two Spirit'`, `'Transgender Male'`, `'Transgender Female'`, `'Intersex'`, `'Other'`, `'Prefer to self describe'`, `'Prefer not to say'`

#### `js_ethnicity_enum`
- `'Indigenous'`, `'Black/African'`, `'Asian'`, `'White/Caucasian'`, `'Latino/Hispanic'`, `'Middle Eastern'`, `'Pacific Islander'`, `'Mixed/Multiple'`, `'Other'`, `'Prefer not to say'`

#### `js_veteran_status_enum`
- `'Yes'`, `'No'`, `'Prefer not to say'`

#### `js_disability_status_enum`
- `'Yes'`, `'No'`, `'Prefer not to say'`

#### `js_seniority_level_enum`
- `'Intern'`, `'Junior'`, `'Intermediate'`, `'Senior'`, `'Lead'`, `'Manager'`, `'Director'`, `'VP'`, `'C-Suite'`

#### `js_relocation_willingness_enum`
- `'Yes - Open to relocate'`, `'No - not willing'`, `'Within country only'`, `'Case-by-case'`

#### `js_travel_willingness_enum`
- `'0% - NO Travel'`, `'<10%'`, `'10-25%'`, `'25-50%'`, `'>50%'`

#### `js_personal_vehicle_enum`
- `'Yes'`, `'No'`

#### `js_notice_period_enum`
- `'Immediate'`, `'1 Week'`, `'2 Weeks'`, `'4 Weeks'`, `'Over 4 Weeks'`

#### `js_salary_type_enum`
- `'Annual'`, `'Hourly'`

#### `js_currency_enum`
- `'CAD'`, `'USD'`, `'GBP'`, `'EUR'`

#### `js_people_leadership_enum`
- `'None'`, `'Mentored Others'`, `'Led 1-5 people'`, `'Led 6-20 people'`, `'Led 21+ people'`

#### `js_budget_responsibility_enum`
- `'None'`, `'<$100k'`, `'$100k-$1M'`, `'$1M-$10M'`, `'$10M+'`

#### `js_team_environment_enum`
- `'Independent work'`, `'Small team (2-10)'`, `'Cross-functional teams'`, `'Large organization'`

#### `js_management_style_enum`
- `'Hands on'`, `'High autonomy'`, `'Coaching focused'`, `'Structured'`

#### `js_company_size_enum`
- `'Startup (1-50)'`, `'SMB (51-200)'`, `'Mid-market (201-1000)'`, `'Enterprise (1000+)'`

#### `js_references_enum`
- `'Available now'`, `'After offer'`, `'Not available'`

### JSONB Field Structures

#### `additional_email_addresses`
Array of email objects:
```json
[
  {
    "email": "personal@example.com",
    "label": "Personal"
  },
  {
    "email": "work@example.com",
    "label": "Work"
  }
]
```

#### `target_job_titles`
Array of strings:
```json
["Software Engineer", "Full Stack Developer", "Tech Lead"]
```

#### `employment_type`
Array of strings:
```json
["Full Time", "Part Time", "Contract", "Freelance"]
```

#### `work_setting_preference`
Array of strings:
```json
["Onsite", "Hybrid", "Remote"]
```

#### `driver_license_class`
Array of strings:
```json
["G", "G2", "M"]
```

#### `weekly_availability`
Array of strings:
```json
["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
```

#### `shift_flexibility`
Array of strings:
```json
["Day Shift", "Evening Shift", "Night Shift", "Weekend"]
```

#### `compensation_types`
Array of strings:
```json
["Base", "Bonus", "Commission", "Overtime", "Equity"]
```

#### `core_skills`
Array of skill objects:
```json
[
  {
    "skill": "JavaScript",
    "years": 5
  },
  {
    "skill": "React",
    "years": 3
  }
]
```

#### `tools_and_technologies`
Array of tool objects:
```json
[
  {
    "tool": "VS Code",
    "level": "Expert",
    "years": 5
  },
  {
    "tool": "Git",
    "level": "Advanced",
    "years": 4
  }
]
```

#### `industry_experience`
Array of industry objects:
```json
[
  {
    "industry": "Technology",
    "years": 5
  },
  {
    "industry": "Finance",
    "years": 2
  }
]
```

#### `accomplishments`
Array of strings:
```json
[
  "Led team of 10 developers",
  "Increased revenue by 30%",
  "Launched 5 successful products"
]
```

#### `values_and_motivators`
Array of strings:
```json
["Innovation", "Work-Life Balance", "Growth", "Impact"]
```

#### `compliance_and_consent`
Object with boolean flags:
```json
{
  "background_check_consent": true,
  "credit_check_consent": false,
  "drug_test_consent": true,
  "data_sharing_consent": true
}
```

## Database Triggers

### Auto-Update Timestamp

The `updated_at` field is automatically updated whenever a row is modified using the `moddatetime()` trigger function:

```sql
CREATE TRIGGER update_job_seeker_profile_updated_at
BEFORE UPDATE ON job_seeker_profile
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
```

## Application Integration

### File Structure

```
app/(portal)/seeker/profile/
├── page.tsx                    # Main page (Server Component)
├── actions.ts                  # Server actions for form submission
└── components/
    └── SeekerProfileForm.tsx  # Client component with tabbed form
```

### Component Architecture

1. **Page Component** (`page.tsx`)
   - Server Component that fetches job seeker profile data
   - Renders the form component with initial data

2. **Form Component** (`SeekerProfileForm.tsx`)
   - Client Component with tabbed interface
   - Ten tabs: Personal, Work Auth, Role, Location, Availability, Compensation, Skills, Preferences, Regulatory, Target Groups
   - Uses React `useTransition` for form state management
   - Calls server action on submit

3. **Server Actions** (`actions.ts`)
   - `updateSeekerProfile()` - Handles form submission
   - Validates and processes form data
   - Updates or inserts job seeker profile
   - Returns success/error messages

### Form Tabs

#### 1. Personal
- Profile photo upload and visibility
- Identity verification (AI verification info)
- Government-issued ID documents
- Personal information (name, pronouns, title)
- Location information
- Demographic information
- Professional links (LinkedIn, GitHub, Portfolio)
- Account & security (email addresses, password reset)

#### 2. Work Auth
- Work authorization status dropdown
- Information about Canadian work authorization
- Privacy information

#### 3. Role
- Target job titles (multiple)
- Primary NOC code
- Seniority level
- Employment type preferences
- Work setting preferences

#### 4. Location
- Relocation willingness
- Max commute time
- Travel willingness
- Driver's license class
- Personal vehicle availability

#### 5. Availability
- Earliest start date
- Notice period
- Weekly availability
- Shift flexibility

#### 6. Compensation
- Salary expectation
- Salary type (Annual/Hourly)
- Currency
- Minimum acceptable offer
- Compensation types

#### 7. Skills
- Years of total experience
- Core skills (with years)
- Tools & technologies (with level and years)
- Industry experience (with years)
- People leadership
- Budget/P&L responsibility
- Top 3 accomplishments

#### 8. Preferences
- Work preferences (team environment, management style, company size, references)
- Values & motivators
- Compliance & consent

#### 9. Regulatory
- Regulated occupation status
- Regulatory/licensing status
- Regulatory body information
- Target groups section (within Regulatory tab)

#### 10. Target Groups
- Newcomer to Canada
- Youth
- Veteran of the Canadian Armed Forces
- Indigenous Person
- Mature Worker
- Member of a Visible Minority
- Person with Disability
- Privacy information

### Data Flow

1. User navigates to `/seeker/profile`
2. Server Component fetches job seeker profile from `job_seeker_profile` table
3. Form Component renders with existing data (if any)
4. User fills out form across multiple tabs and submits
5. Server Action processes form data:
   - Validates required fields
   - Parses JSONB fields
   - Updates or inserts record
6. Page revalidates and shows success/error message

### Validation Rules

- `legal_first_name` - Required field
- `legal_last_name` - Required field
- `primary_noc_code` - Should be 5 digits if provided
- `salary_expectation` - Must be positive integer if provided
- `years_of_experience` - Must be non-negative integer
- JSONB fields - Must be valid JSON (parsed on server)

### Relationship to Other Tables

- **`profiles`**: One-to-one relationship via `id` field
- **`applicant_profiles`**: May be used as an alias or separate table (implementation-specific)

## Security Considerations

### Row Level Security (RLS)

The `job_seeker_profile` table should have RLS policies:

1. **Job seekers can view/edit their own profile:**
   ```sql
   CREATE POLICY "Job seekers can view own profile"
   ON job_seeker_profile FOR SELECT
   USING (auth.uid() = id);
   
   CREATE POLICY "Job seekers can update own profile"
   ON job_seeker_profile FOR UPDATE
   USING (auth.uid() = id);
   ```

2. **Employers/Recruiters can view limited fields:**
   ```sql
   CREATE POLICY "Employers can view job seeker profiles"
   ON job_seeker_profile FOR SELECT
   USING (true);
   -- Note: May want to restrict sensitive fields like ID documents
   ```

### Data Privacy

- Profile photos should be stored in public bucket (if visibility enabled)
- Government-issued ID documents should be stored in private bucket
- Sensitive demographic information should be handled carefully
- Email addresses should be protected

## Future Enhancements

1. **File Uploads**
   - Profile photo upload to Supabase Storage
   - Government ID document uploads
   - Document verification workflow

2. **Validation**
   - NOC code validation
   - Phone number formatting
   - Email validation
   - URL validation for professional links

3. **Public Profile View**
   - Display job seeker profile to employers
   - Privacy controls for what's visible

4. **Matching Algorithm**
   - Use profile data for job matching
   - Skills-based matching
   - Preference-based filtering

5. **Analytics**
   - Track profile completion rate
   - Monitor which fields are most commonly filled
   - Profile views by employers

## Migration Notes

When migrating from other profile tables:

1. The `job_seeker_profile` table is comprehensive and replaces basic profile information
2. Data migration script may be needed to copy basic info from other tables
3. TypeScript types need to be regenerated after table creation

## API Reference

### Server Action: `updateSeekerProfile`

**Parameters:**
- `formData: FormData` - Form data containing all job seeker profile fields

**Returns:**
```typescript
{
  error?: string
  success?: boolean
  message?: string
}
```

**Example Usage:**
```typescript
const formData = new FormData()
formData.append('legal_first_name', 'John')
formData.append('legal_last_name', 'Doe')
// ... other fields

const result = await updateSeekerProfile(formData)
if (result.success) {
  // Show success message
}
```

## Testing

### Test Cases

1. **Create New Profile**
   - Submit form with all required fields
   - Verify record is created in database
   - Check timestamps are set correctly

2. **Update Existing Profile**
   - Load existing profile
   - Modify fields across different tabs
   - Submit and verify updates
   - Check `updated_at` is updated

3. **Validation**
   - Submit without required fields
   - Submit invalid JSON in JSONB fields
   - Verify error messages

4. **Tab Navigation**
   - Switch between tabs
   - Verify data persists (using CSS visibility, not conditional rendering)
   - Submit from different tabs

5. **JSONB Fields**
   - Submit valid JSON arrays
   - Submit valid JSON objects
   - Submit empty JSONB fields

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - Regenerate Supabase types after creating table
   - Use type assertions temporarily if types not updated

2. **JSONB Parsing Errors**
   - Ensure JSON is valid before submission
   - Handle parsing errors gracefully on server

3. **RLS Policy Issues**
   - Verify RLS policies are correctly set
   - Check user authentication status

4. **Form State Issues**
   - Ensure CSS visibility is used (not conditional rendering) to preserve form state
   - Check server action return values

