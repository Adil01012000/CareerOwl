# Company Profile Module Documentation

## Overview

The Company Profile module allows employers to create and manage comprehensive company information. This information is used to build the employer brand, verify business legitimacy, and provide detailed information to job seekers.

## Database Schema

### Table: `company_profiles`

The `company_profiles` table stores comprehensive company information including business details, hiring practices, benefits, immigration support, and recognition.

**Primary Key:** `id` (BIGSERIAL) - Links to `profiles.id` (user ID)

**Timestamps:**
- `created_at` (TIMESTAMPTZ) - Auto-set on creation
- `updated_at` (TIMESTAMPTZ) - Auto-updated via trigger

### Schema Structure

#### 1. Basic Company Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `id` | BIGSERIAL | Yes | Primary key, links to user ID |
| `company_logo` | TEXT | No | URL to company logo image |
| `legal_business_name` | VARCHAR(255) | Yes | Legal registered business name |
| `trade_name` | VARCHAR(255) | No | Trade name or "Doing Business As" (DBA) |
| `cra_business_number` | VARCHAR(100) | No | Canada Revenue Agency business number |
| `year_founded` | INT | No | Year the company was founded |
| `website_url` | VARCHAR(255) | No | Company website URL |
| `headquarters_address` | TEXT | No | Full address of headquarters |
| `primary_contact_email` | TEXT | No | Primary contact email (validated) |
| `primary_phone` | VARCHAR(50) | No | Primary contact phone number |
| `company_description` | TEXT | No | Detailed company description |

#### 2. Registration & Licensing

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `issued_by` | VARCHAR(255) | No | Authority that issued business registration |
| `registration_document` | TEXT | No | URL to registration document |
| `exempt_business_license` | BOOLEAN | No | Whether business is exempt from license requirement |
| `license_number` | VARCHAR(100) | No | Business license number |
| `issue_date` | DATE | No | License issue date |
| `expiry_date` | DATE | No | License expiry date |
| `license_document` | TEXT | No | URL to license document |

#### 3. Business Structure

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `business_type` | `business_type_enum` | No | Type of business entity |
| `company_size` | `company_size_enum` | No | Number of employees |
| `annual_revenue` | `annual_revenue_enum` | No | Annual revenue range |
| `no_of_locations` | INT | No | Number of office locations |
| `ownership_model` | `ownership_model_enum` | No | Ownership structure |
| `additional_location` | JSONB | No | Array of additional office locations |
| `primary_industry` | VARCHAR(255) | No | Primary industry sector |
| `naics_code` | VARCHAR(50) | No | North American Industry Classification System code |
| `primary_products` | TEXT | No | Description of primary products/services |
| `target_client_segment` | JSONB | No | Target client segments (B2B, B2C, etc.) |
| `regulated_industry` | BOOLEAN | No | Whether operating in a regulated industry |

#### 4. Hiring Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `actively_hiring` | `actively_hiring_enum` | No | Current hiring status |
| `annual_hiring_volume` | `annual_hiring_volume_enum` | No | Annual number of hires |
| `applicant_tracking_system` | `applicant_tracking_system_enum` | No | ATS system in use |
| `work_model` | JSONB | No | Work arrangements (remote, hybrid, on-site) |
| `dress_code` | `dress_code_enum` | No | Workplace dress code |

#### 5. Benefits & Policies

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `health_benefits` | `health_benefits_enum` | No | Health benefits availability |
| `retirement_plans` | `retirement_plans_enum` | No | Retirement plan options |
| `paid_time_off` | INT | No | Days of PTO per year |
| `flexible_hours` | `flexible_hours_enum` | No | Flexible working hours policy |
| `remote_work_support` | JSONB | No | Remote work support details |
| `learning_and_development` | JSONB | No | L&D programs and budget |
| `relocation_assistance` | `relocation_assistance_enum` | No | Relocation support policy |
| `diversity_policies` | JSONB | No | Diversity and inclusion policies |
| `company_values` | JSONB | No | Company core values |

#### 6. Immigration Support

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `lmia_employer` | `lmia_employer_enum` | No | LMIA employer status |
| `designated_learning_institution` | BOOLEAN | No | Whether company is a DLI |
| `dli_number` | INT | No | Designated Learning Institution number |
| `recognized_employer_pilot` | `rep_enum` | No | Recognized Employer Pilot status |

#### 7. Recognition & Ratings

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `glassdoor_rating` | DECIMAL(3,2) | No | Glassdoor rating (0-5) |
| `indeed_rating` | DECIMAL(3,2) | No | Indeed rating (0-5) |
| `awards_and_recognition` | TEXT | No | Awards and recognition text |
| `environmental_certification` | JSONB | No | Environmental certifications |
| `community_involvement` | JSONB | No | Community involvement programs |

### Enum Types

#### `business_type_enum`
- `'Corporation'`
- `'Sole Proprietorship'`
- `'Partnership'`
- `'Non Profit'`
- `'Public Sector'`
- `'Other'`

#### `company_size_enum`
- `'1-10'`
- `'11-50'`
- `'51-200'`
- `'201-500'`
- `'500+'`

#### `annual_revenue_enum`
- `'Under $500K'`
- `'$500K-$1M'`
- `'$1M-$5M'`
- `'$5M-$50M'`
- `'$50M+'`

#### `ownership_model_enum`
- `'Founder Owned'`
- `'Private Equity'`
- `'Publicly Traded'`
- `'Franchise'`
- `'Cooperative'`
- `'Other'`

#### `actively_hiring_enum`
- `'Yes'`
- `'No'`
- `'Seasonal'`

#### `annual_hiring_volume_enum`
- `'1-5'`
- `'6-20'`
- `'21-50'`
- `'50+'`

#### `applicant_tracking_system_enum`
- `'None'`
- `'CareerOwl'`
- `'Bamboo HR'`

#### `dress_code_enum`
- `'Formal'`
- `'Business Casual'`
- `'Casual'`
- `'Uniform'`

#### `health_benefits_enum`
- `'Yes'`
- `'After Probation'`
- `'No'`

#### `retirement_plans_enum`
- `'RRSP Match'`
- `'Pension Plan'`
- `'ESPP'`
- `'None'`

#### `flexible_hours_enum`
- `'Yes'`
- `'No'`
- `'Case by Case'`

#### `relocation_assistance_enum`
- `'Yes'`
- `'No'`
- `'Case by Case'`

#### `lmia_employer_enum`
- `'Yes'` - Currently an LMIA employer
- `'No'` - Not an LMIA employer
- `'Previously'` - Was an LMIA employer previously
- `'Willing'` - Willing to become an LMIA employer

#### `rep_enum` (Recognized Employer Pilot)
- `'Yes'` - Currently in REP program
- `'No'` - Not in REP program
- `'Applied'` - Application submitted

### JSONB Field Structures

#### `additional_location`
Array of location objects:
```json
[
  {
    "address": "123 Main St",
    "city": "Toronto",
    "province": "ON",
    "postal_code": "M5H 2N2",
    "phone": "+1 (416) 555-1234"
  }
]
```

#### `target_client_segment`
```json
{
  "b2b": true,
  "b2c": false,
  "government": false,
  "non_profit": false
}
```

#### `work_model`
```json
{
  "remote": true,
  "hybrid": true,
  "on_site": true,
  "flexible": true
}
```

#### `diversity_policies`
```json
{
  "equal_opportunity": true,
  "diversity_initiatives": ["Women in Tech", "Indigenous Hiring"],
  "accessibility": true,
  "inclusion_programs": []
}
```

#### `company_values`
```json
{
  "values": ["Innovation", "Integrity", "Excellence", "Diversity"],
  "mission": "To connect talent with opportunity",
  "vision": "A world where everyone finds their dream job"
}
```

#### `remote_work_support`
```json
{
  "equipment_provided": true,
  "stipend": 500,
  "co_working_access": false,
  "tech_support": true
}
```

#### `learning_and_development`
```json
{
  "budget": 1000,
  "programs": ["Training", "Conferences", "Certifications"],
  "mentorship": true,
  "tuition_reimbursement": false
}
```

#### `environmental_certification`
```json
{
  "certifications": ["ISO 14001", "LEED Certified"],
  "initiatives": ["Carbon Neutral", "Waste Reduction"],
  "sustainability_programs": []
}
```

#### `community_involvement`
```json
{
  "volunteer_programs": ["Community Cleanup", "Food Bank"],
  "donations": ["Local Charities", "Education"],
  "sponsorships": []
}
```

## Database Triggers

### Auto-Update Timestamp

The `updated_at` field is automatically updated whenever a row is modified using the `moddatetime()` trigger function:

```sql
CREATE TRIGGER update_company_profiles_updated_at
BEFORE UPDATE ON company_profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
```

## Application Integration

### File Structure

```
app/(portal)/employer/company/
├── page.tsx                    # Main page (Server Component)
├── actions.ts                  # Server actions for form submission
└── components/
    └── CompanyProfileForm.tsx  # Client component with tabbed form
```

### Component Architecture

1. **Page Component** (`page.tsx`)
   - Server Component that fetches company profile data
   - Displays verification status badge
   - Renders the form component

2. **Form Component** (`CompanyProfileForm.tsx`)
   - Client Component with tabbed interface
   - Six tabs: Basic Info, Business Details, Hiring Info, Benefits & Policies, Immigration Support, Recognition
   - Uses React `useFormState` for form state management
   - Calls server action on submit

3. **Server Actions** (`actions.ts`)
   - `updateCompanyProfile()` - Handles form submission
   - Validates and processes form data
   - Updates or inserts company profile
   - Returns success/error messages

### Form Tabs

#### 1. Basic Info
- Company Information (legal name, trade name, CRA number, year founded, website, address)
- Contact Information (email, phone, description)

#### 2. Business Details
- Business Structure (type, size, revenue, ownership model, locations)
- Industry & Products (industry, NAICS code, products, regulated industry flag)

#### 3. Hiring Info
- Hiring Information (actively hiring, annual volume, ATS, dress code)
- Work Model (JSON field for work arrangements)

#### 4. Benefits & Policies
- Benefits (health, retirement, PTO, flexible hours, relocation)
- Policies & Culture (diversity policies, company values, remote work support, L&D)

#### 5. Immigration Support
- Immigration Support (LMIA status, DLI, REP status)
- Additional Information (locations, client segments)

#### 6. Recognition
- Ratings & Reviews (Glassdoor, Indeed ratings)
- Awards & Certifications (awards text, environmental certs, community involvement)

### Data Flow

1. User navigates to `/employer/company`
2. Server Component fetches company profile from `company_profiles` table
3. Form Component renders with existing data (if any)
4. User fills out form and submits
5. Server Action processes form data:
   - Validates required fields
   - Parses JSONB fields
   - Updates or inserts record
6. Page revalidates and shows success/error message

### Validation Rules

- `legal_business_name` - Required field
- `primary_contact_email` - Must be valid email format (enforced by database CHECK constraint)
- `year_founded` - Must be between 1800 and current year
- `glassdoor_rating` / `indeed_rating` - Must be between 0 and 5
- JSONB fields - Must be valid JSON (parsed on server)

### Relationship to Other Tables

- **`profiles`**: One-to-one relationship via `id` field
- **`employer_profiles`**: Separate table for verification status (legacy)
  - Verification status is checked from `employer_profiles.document_verification_status`
  - Company profile data is stored in `company_profiles`

## Security Considerations

### Row Level Security (RLS)

The `company_profiles` table should have RLS policies:

1. **Employers can view/edit their own profile:**
   ```sql
   CREATE POLICY "Employers can view own profile"
   ON company_profiles FOR SELECT
   USING (auth.uid() = id);
   
   CREATE POLICY "Employers can update own profile"
   ON company_profiles FOR UPDATE
   USING (auth.uid() = id);
   ```

2. **Public can view limited fields:**
   ```sql
   CREATE POLICY "Public can view company profiles"
   ON company_profiles FOR SELECT
   USING (true);
   -- Note: May want to restrict certain sensitive fields
   ```

### Data Privacy

- Email addresses should be handled carefully
- Business license documents should be stored in private storage bucket
- Company logos can be stored in public bucket

## Future Enhancements

1. **File Uploads**
   - Company logo upload
   - Business license document upload
   - Registration document upload

2. **Validation**
   - CRA business number validation
   - Website URL validation
   - Phone number formatting

3. **Public Profile View**
   - Display company profile on job postings
   - Company profile page for job seekers

4. **Analytics**
   - Track profile completion rate
   - Monitor which fields are most commonly filled

5. **Integration**
   - Link to job postings
   - Display on employer dashboard
   - Use in job search filters

## Migration Notes

When migrating from `employer_profiles` to `company_profiles`:

1. The new `company_profiles` table is more comprehensive
2. `employer_profiles` is still used for verification status
3. Data migration script may be needed to copy basic info from `employer_profiles` to `company_profiles`
4. TypeScript types need to be regenerated after table creation

## API Reference

### Server Action: `updateCompanyProfile`

**Parameters:**
- `formData: FormData` - Form data containing all company profile fields

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
formData.append('legal_business_name', 'Acme Corp')
formData.append('business_type', 'Corporation')
// ... other fields

const result = await updateCompanyProfile(formData)
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
   - Modify fields
   - Submit and verify updates
   - Check `updated_at` is updated

3. **Validation**
   - Submit without required fields
   - Submit invalid email
   - Submit invalid JSON in JSONB fields
   - Verify error messages

4. **Tab Navigation**
   - Switch between tabs
   - Verify data persists
   - Submit from different tabs

5. **JSONB Fields**
   - Submit valid JSON
   - Submit invalid JSON
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
   - Ensure `useFormState` is properly configured
   - Check server action return values

