-- ================================
-- 0. REQUIRED TRIGGER FUNCTION
-- ================================
CREATE OR REPLACE FUNCTION moddatetime()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 1. ENUM TYPES
-- ================================

CREATE TYPE js_title_enum AS ENUM ('Mr.', 'Mrs.', 'Ms.', 'Miss.', 'Dr.', 'Prof.', 'Mx.', 'Other');

CREATE TYPE js_pronouns_enum AS ENUM ('he/him', 'she/her', 'they/them', 'Other', 'Prefer not to say');

CREATE TYPE js_gender_enum AS ENUM (
    'Male', 'Female', 'Non Binary', 'Genderqueer', 'Genderfluid', 'Agender',
    'Two Spirit', 'Transgender Male', 'Transgender Female', 'Intersex', 'Other', 
    'Prefer to self describe', 'Prefer not to say'
);

CREATE TYPE js_ethnicity_enum AS ENUM (
    'Indigenous', 'Black/African', 'Asian', 'White/Caucasian', 'Latino/Hispanic', 
    'Middle Eastern', 'Pacific Islander', 'Mixed/Multiple', 'Other', 'Prefer not to say'
);

CREATE TYPE js_veteran_status_enum AS ENUM ('Yes', 'No', 'Prefer not to say');
CREATE TYPE js_disability_status_enum AS ENUM ('Yes', 'No', 'Prefer not to say');

CREATE TYPE js_seniority_level_enum AS ENUM ('Intern', 'Junior', 'Intermediate', 'Senior', 'Lead', 'Manager', 'Director', 'VP', 'C-Suite');

CREATE TYPE js_relocation_willingness_enum AS ENUM ('Yes - Open to relocate', 'No - not willing', 'Within country only', 'Case-by-case');

CREATE TYPE js_travel_willingness_enum AS ENUM ('0% - NO Travel', '<10%', '10-25%', '25-50%', '>50%');

CREATE TYPE js_personal_vehicle_enum AS ENUM ('Yes', 'No');

CREATE TYPE js_notice_period_enum AS ENUM ('Immediate', '1 Week', '2 Weeks', '4 Weeks', 'Over 4 Weeks');

CREATE TYPE js_salary_type_enum AS ENUM ('Annual', 'Hourly');

CREATE TYPE js_currency_enum AS ENUM ('CAD', 'USD', 'GBP', 'EUR');

CREATE TYPE js_people_leadership_enum AS ENUM ('None', 'Mentored Others', 'Led 1-5 people', 'Led 6-20 people', 'Led 21+ people');

CREATE TYPE js_budget_responsibility_enum AS ENUM ('None', '<$100k', '$100k-$1M', '$1M-$10M', '$10M+');

CREATE TYPE js_team_environment_enum AS ENUM ('Independent work', 'Small team (2-10)', 'Cross-functional teams', 'Large organization');

CREATE TYPE js_management_style_enum AS ENUM ('Hands on', 'High autonomy', 'Coaching focused', 'Structured');

CREATE TYPE js_company_size_enum AS ENUM ('Startup (1-50)', 'SMB (51-200)', 'Mid-market (201-1000)', 'Enterprise (1000+)');

CREATE TYPE js_references_enum AS ENUM ('Available now', 'After offer', 'Not available');

-- ================================
-- 2. CREATE TABLE
-- ================================

CREATE TABLE job_seeker_profile (
    id BIGSERIAL PRIMARY KEY,
    
    profile_photo TEXT,
    show_profile_photo BOOLEAN DEFAULT TRUE,
    government_issued_id_one TEXT,
    government_issued_id_two TEXT,
    
    title js_title_enum,
    pronouns js_pronouns_enum,
    legal_first_name VARCHAR(255) NOT NULL,
    middle_name VARCHAR(255),
    legal_last_name VARCHAR(255) NOT NULL,
    preferred_name VARCHAR(255),
    
    phone_number VARCHAR(50),
    city VARCHAR(255),
    province VARCHAR(255),
    postal_code VARCHAR(50),
    country_id INT,
    date_of_birth DATE,
    
    gender js_gender_enum,
    ethnicity js_ethnicity_enum,
    veteran_status js_veteran_status_enum,
    disability_status js_disability_status_enum,
    
    linkedin_url TEXT,
    portfolio TEXT,
    github_url TEXT,
    additional_email_addresses JSONB,
    
    work_status TEXT,
    open_work_or_restricted TEXT,
    work_permit_expiry_date DATE,
    need_sponsorship TEXT,
    work_permit_province TEXT,
    immigration_support_needed TEXT,
    
    target_job_titles JSONB,
    primary_noc_code TEXT,
    seniority_level js_seniority_level_enum,
    employment_type JSONB,
    work_setting_preference JSONB,
    relocation_willingness js_relocation_willingness_enum,
    max_commute_time INT,
    travel_willingness js_travel_willingness_enum,
    driver_license_class JSONB,
    personal_vehicle js_personal_vehicle_enum,
    earliest_start_date DATE,
    notice_period js_notice_period_enum,
    weekly_availability JSONB,
    shift_flexibility JSONB,
    salary_expectation INT,
    salary_type js_salary_type_enum,
    currency js_currency_enum,
    minimum_acceptable_offer INT,
    compensation_types JSONB,
    years_of_experience INT,
    core_skills JSONB,
    tools_and_technologies JSONB,
    industry_experience JSONB,
    people_leadership js_people_leadership_enum,
    budget_responsibility js_budget_responsibility_enum,
    accomplishments JSONB,
    team_environment js_team_environment_enum,
    management_style js_management_style_enum,
    company_size js_company_size_enum,
    js_references js_references_enum,
    values_and_motivators JSONB,
    compliance_and_consent JSONB,
    
    is_occupation_regulated TEXT,
    regulatory_status TEXT,
    regulatory_body_name TEXT,
    regulator_website_url TEXT,
    
    is_person_with_disability BOOLEAN DEFAULT FALSE,
    is_newcomer_to_canada BOOLEAN DEFAULT FALSE,
    year_arrived_in_canada INT,
    is_youth BOOLEAN DEFAULT FALSE,
    is_veteran_of_caf BOOLEAN DEFAULT FALSE,
    branch_of_service TEXT,
    is_indigenous_person BOOLEAN DEFAULT FALSE,
    community_or_nation TEXT,
    is_mature_worker BOOLEAN DEFAULT FALSE,
    is_member_of_visible_minority BOOLEAN DEFAULT FALSE,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- 3. TRIGGER
-- ================================

CREATE TRIGGER update_job_seeker_profile_updated_at
BEFORE UPDATE ON job_seeker_profile
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
