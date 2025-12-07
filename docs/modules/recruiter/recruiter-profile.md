# Recruiter Profile Module Documentation

## Overview

The Recruiter Profile module allows recruiters to create and manage comprehensive recruiter profiles. This information is used to build the recruiter brand, verify professional credentials, and provide detailed information to job seekers and employers.

## Database Schema

### Table: `recruiter_profile`

The `recruiter_profile` table stores comprehensive recruiter information including professional designation, business details, provincial registration, and recruiting specialization.

**Primary Key:** `id` (BIGSERIAL) - Links to `profiles.id` (user ID)

**Timestamps:**
- `created_at` (TIMESTAMPTZ) - Auto-set on creation
- `updated_at` (TIMESTAMPTZ) - Auto-updated via trigger

### Schema Structure

#### 1. Professional Designation & Registration

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `id` | BIGSERIAL | Yes | Primary key, links to user ID |
| `professional_designation` | `recruiter_professional_designation_enum` | No | Professional designation type |
| `name_of_regulatory_body` | VARCHAR(255) | No | Name of regulatory body |
| `registration_number` | VARCHAR(100) | No | Registration ID/Membership number |
| `registration_expiry_date` | DATE | No | Registration expiry date |
| `proof_of_registration` | TEXT | No | URL to proof of registration document |

#### 2. Business Information

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `legal_business_name` | VARCHAR(255) | Yes | Legal registered business name |
| `trade_name` | VARCHAR(255) | No | Trade name or "Doing Business As" (DBA) |
| `cra_business_number` | VARCHAR(100) | No | Canada Revenue Agency business number (9 digits) |
| `primary_contact_email` | TEXT | No | Primary contact email (validated) |
| `primary_phone` | VARCHAR(50) | No | Primary contact phone number |
| `headquarters_address` | TEXT | No | Full address of headquarters |
| `website_url` | VARCHAR(255) | No | Company website URL |
| `years_in_business` | INT | No | Years in business |
| `description` | TEXT | No | Description of recruiting services and value proposition |
| `logo` | TEXT | No | URL to company logo image |

#### 3. Business Documents

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `registration_document` | TEXT | No | URL to business registration document |
| `license_document` | TEXT | No | URL to business license document |

#### 4. Provincial Registration

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `is_operating_in_provinces` | BOOLEAN | No | Whether operating in provinces requiring registration (default: false) |
| `operational_provinces` | JSONB | No | Array of provinces where recruiter operates |
| `registration_documents` | JSONB | No | Registration documents per province |

#### 5. Recruiting Specialization

| Field | Type | Required | Description |
|-------|------|----------|------------|
| `primary_industries` | JSONB | No | Array of primary industries served |
| `noc_codes` | JSONB | No | Array of specialization NOC codes |

### Enum Types

#### `recruiter_professional_designation_enum`
- `'Registered Recruiter'` - Registered with provincial employment agency regulator
- `'Lawyer'` - Licensed to practice law in Canada
- `'Paralegal'` - Licensed paralegal in Canada
- `'RCIC (Regulated Canadian Immigration Consultant)'` - Regulated Canadian Immigration Consultant

### JSONB Field Structures

#### `operational_provinces`
Array of province codes:
```json
["ontario", "british_columbia", "alberta"]
```

#### `registration_documents`
Object mapping province codes to document URLs:
```json
{
  "ontario": "https://storage.example.com/docs/ontario-registration.pdf",
  "british_columbia": "https://storage.example.com/docs/bc-registration.pdf"
}
```

#### `primary_industries`
Array of industry names:
```json
["Technology", "Healthcare", "Finance"]
```

#### `noc_codes`
Array of NOC codes:
```json
["21232", "10022", "11200"]
```

### Provincial Registration Requirements

The following provinces require registration:

1. **Ontario** - Registration required under EIPA (Employment Industry Practices Act)
2. **British Columbia** - Employment Standards Act requirements
3. **Alberta** - Employment Agency Business Licence
4. **Saskatchewan** - Employment Agencies Act registration
5. **Manitoba** - Employment Standards Code compliance

## Database Triggers

### Auto-Update Timestamp

The `updated_at` field is automatically updated whenever a row is modified using the `moddatetime()` trigger function:

```sql
CREATE TRIGGER update_recruiter_profile_updated_at
BEFORE UPDATE ON recruiter_profile
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
```

## Application Integration

### File Structure

```
app/(portal)/recruiter/profile/
├── page.tsx                    # Main page (Server Component)
├── actions.ts                  # Server actions for form submission
└── components/
    └── RecruiterProfileForm.tsx  # Client component with form sections
```

### Component Architecture

1. **Page Component** (`page.tsx`)
   - Server Component that fetches recruiter profile data
   - Displays verification status
   - Renders the form component

2. **Form Component** (`RecruiterProfileForm.tsx`)
   - Client Component with multiple card sections
   - Sections: Verification Status, Professional Designation, Proof of Registration, Business Information, Business Documents, Provincial Recruiter Registration, Recruiting Specialization
   - Uses React `useTransition` for form state management
   - Calls server action on submit

3. **Server Actions** (`actions.ts`)
   - `updateRecruiterProfile()` - Handles form submission
   - Validates and processes form data
   - Updates or inserts recruiter profile
   - Returns success/error messages

### Form Sections

#### 1. Verification Status
- Business Verification badge (verified/pending/rejected)
- Professional Status badge (verified/pending/rejected)
- Provincial Registration badge (verified/pending/rejected/not_required)

#### 2. Professional Designation
- Information box explaining required professional credentials
- Professional designation dropdown (Registered Recruiter, Lawyer, Paralegal, RCIC)
- Dynamic subtitles based on selected designation
- Selected designation display card
- Name of Regulatory Body input
- Registration ID / Membership Number input
- Registration Expiry Date input
- Proof of Registration file upload

#### 3. Proof of Registration
- Upload instructions
- File upload button
- AI Auto-Verification information box
- File name display

#### 4. Business Information
- Legal Business Name (required)
- Trade Name / DBA
- CRA Business Number (9 digits)
- Primary Contact Email
- Primary Phone
- Headquarters Address (textarea)
- Website URL
- Years in Business
- About Your Recruiting Business (textarea)
- Logo upload section

#### 5. Business Documents
- Business Registration Document upload
- Business License Document upload
- File name displays

#### 6. Provincial Recruiter Registration
- Information box about provincial requirements
- Checkbox: "Yes, I operate in provinces with registration requirements"
- Province selection grid with checkboxes:
  - Ontario (EIPA)
  - British Columbia (Employment Standards)
  - Alberta (Business Licence)
  - Saskatchewan (Employment Agencies Act)
  - Manitoba (Employment Standards)
- Registration document upload per selected province

#### 7. Recruiting Specialization
- Primary Industries Served (comma-separated input, converted to JSONB array)
- Specialization NOC Codes (comma-separated input, converted to JSONB array)

### Data Flow

1. User navigates to `/recruiter/profile`
2. Server Component fetches recruiter profile from `recruiter_profile` table
3. Form Component renders with existing data (if any)
4. User fills out form and submits
5. Server Action processes form data:
   - Validates required fields
   - Parses JSONB fields
   - Converts comma-separated values to arrays
   - Updates or inserts record
6. Page revalidates and shows success/error message

### Validation Rules

- `legal_business_name` - Required field
- `professional_designation` - Required if operating as recruiter
- `name_of_regulatory_body` - Required if professional designation selected
- `registration_number` - Required if professional designation selected
- `proof_of_registration` - Required if professional designation selected
- `primary_contact_email` - Must be valid email format (enforced by database CHECK constraint)
- `cra_business_number` - Should be 9 digits if provided
- JSONB fields - Must be valid JSON (parsed on server)

### Relationship to Other Tables

- **`profiles`**: One-to-one relationship via `id` field
- Verification status may come from a separate verification table or metadata

## Security Considerations

### Row Level Security (RLS)

The `recruiter_profile` table should have RLS policies:

1. **Recruiters can view/edit their own profile:**
   ```sql
   CREATE POLICY "Recruiters can view own profile"
   ON recruiter_profile FOR SELECT
   USING (auth.uid() = id);
   
   CREATE POLICY "Recruiters can update own profile"
   ON recruiter_profile FOR UPDATE
   USING (auth.uid() = id);
   ```

2. **Public can view limited fields:**
   ```sql
   CREATE POLICY "Public can view recruiter profiles"
   ON recruiter_profile FOR SELECT
   USING (true);
   -- Note: May want to restrict certain sensitive fields
   ```

### Data Privacy

- Email addresses should be handled carefully
- Business license and registration documents should be stored in private storage bucket
- Company logos can be stored in public bucket
- Registration documents per province should be private

## Future Enhancements

1. **File Uploads**
   - Company logo upload to Supabase Storage
   - Business license document upload
   - Registration document upload
   - Proof of registration upload
   - Provincial registration documents upload

2. **Validation**
   - CRA business number validation
   - Website URL validation
   - Phone number formatting
   - Registration number validation with regulatory bodies

3. **AI Auto-Verification**
   - Implement AI verification for registration IDs
   - Integration with regulatory body databases
   - Automatic verification status updates

4. **Public Profile View**
   - Display recruiter profile to job seekers
   - Show verification badges
   - Display specialization and industries

5. **Analytics**
   - Track profile completion rate
   - Monitor which fields are most commonly filled
   - Profile views by job seekers

## Migration Notes

When setting up the recruiter profile:

1. The `recruiter_profile` table is comprehensive and stores all recruiter information
2. Ensure all enum types are created before creating the table
3. TypeScript types need to be regenerated after table creation
4. RLS policies should be set up before going to production

## API Reference

### Server Action: `updateRecruiterProfile`

**Parameters:**
- `formData: FormData` - Form data containing all recruiter profile fields

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
formData.append('legal_business_name', 'Elite Talent Solutions')
formData.append('professional_designation', 'Registered Recruiter')
formData.append('name_of_regulatory_body', 'ARI - Association of Recruiting & Staffing Professionals')
formData.append('registration_number', 'ARI-ON-98765')
// ... other fields

const result = await updateRecruiterProfile(formData)
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

4. **Provincial Registration**
   - Select provinces requiring registration
   - Upload registration documents
   - Verify documents are stored correctly

5. **JSONB Fields**
   - Submit comma-separated industries (converted to array)
   - Submit comma-separated NOC codes (converted to array)
   - Submit province selections (converted to array)

## Troubleshooting

### Common Issues

1. **TypeScript Errors**
   - Regenerate Supabase types after creating table
   - Use type assertions temporarily if types not updated

2. **JSONB Parsing Errors**
   - Ensure JSON is valid before submission
   - Handle parsing errors gracefully on server
   - Check comma-separated value parsing

3. **RLS Policy Issues**
   - Verify RLS policies are correctly set
   - Check user authentication status

4. **File Upload Issues**
   - Ensure file upload handlers are implemented
   - Check Supabase Storage bucket permissions
   - Verify file size limits

5. **Provincial Registration**
   - Verify province codes match expected values
   - Check registration document upload per province
   - Ensure JSONB structure is correct

