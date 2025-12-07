-- ================================
-- 0. REQUIRED TRIGGER FUNCTION
-- ================================

CREATE OR REPLACE FUNCTION moddatetime ()
RETURNS trigger AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ================================
-- 1. ENUM TYPES
-- ================================

CREATE TYPE business_type_enum AS ENUM 
('Corporation', 'Sole Proprietorship', 'Partnership', 'Non Profit', 'Public Sector', 'Other');

CREATE TYPE company_size_enum AS ENUM 
('1-10', '11-50', '51-200', '201-500', '500+');

CREATE TYPE annual_revenue_enum AS ENUM 
('Under $500K', '$500K-$1M', '$1M-$5M', '$5M-$50M', '$50M+');

CREATE TYPE ownership_model_enum AS ENUM 
('Founder Owned', 'Private Equity', 'Publicly Traded', 'Franchise', 'Cooperative', 'Other');

CREATE TYPE actively_hiring_enum AS ENUM 
('Yes', 'No', 'Seasonal');

CREATE TYPE annual_hiring_volume_enum AS ENUM 
('1-5', '6-20', '21-50', '50+');

CREATE TYPE applicant_tracking_system_enum AS ENUM 
('None', 'CareerOwl', 'Bamboo HR');

CREATE TYPE dress_code_enum AS ENUM
('Formal', 'Business Casual', 'Casual', 'Uniform');

CREATE TYPE health_benefits_enum AS ENUM
('Yes', 'After Probation', 'No');

CREATE TYPE retirement_plans_enum AS ENUM
('RRSP Match', 'Pension Plan', 'ESPP', 'None');

CREATE TYPE flexible_hours_enum AS ENUM
('Yes', 'No', 'Case by Case');

CREATE TYPE relocation_assistance_enum AS ENUM
('Yes', 'No', 'Case by Case');

CREATE TYPE lmia_employer_enum AS ENUM
('Yes', 'No', 'Previously', 'Willing');

CREATE TYPE rep_enum AS ENUM
('Yes', 'No', 'Applied');

-- ================================
-- 2. CREATE TABLE
-- ================================

CREATE TABLE company_profiles (
    id BIGSERIAL PRIMARY KEY,
    
    company_logo TEXT,
    legal_business_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    cra_business_number VARCHAR(100),
    year_founded INT,
    website_url VARCHAR(255),
    headquarters_address TEXT,
    primary_contact_email TEXT CHECK (primary_contact_email ~* '^[^@]+@[^@]+\.[^@]+$'),
    primary_phone VARCHAR(50),

    company_description TEXT,
    issued_by VARCHAR(255),
    registration_document TEXT,
    
    exempt_business_license BOOLEAN DEFAULT FALSE,
    license_number VARCHAR(100),
    issue_date DATE,
    expiry_date DATE,
    license_document TEXT,

    business_type business_type_enum,
    company_size company_size_enum,
    annual_revenue annual_revenue_enum,

    no_of_locations INT,
    ownership_model ownership_model_enum,

    additional_location JSONB,
    primary_industry VARCHAR(255),
    naics_code VARCHAR(50),
    primary_products TEXT,
    target_client_segment JSONB,
    
    regulated_industry BOOLEAN DEFAULT FALSE,
    
    actively_hiring actively_hiring_enum,
    annual_hiring_volume annual_hiring_volume_enum,
    applicant_tracking_system applicant_tracking_system_enum,

    work_model JSONB,

    dress_code dress_code_enum,
    
    diversity_policies JSONB,
    company_values JSONB,
    
    health_benefits health_benefits_enum,
    retirement_plans retirement_plans_enum,
    
    paid_time_off INT,
    flexible_hours flexible_hours_enum,

    remote_work_support JSONB,
    learning_and_development JSONB,

    relocation_assistance relocation_assistance_enum,
    
    lmia_employer lmia_employer_enum,

    designated_learning_institution BOOLEAN DEFAULT FALSE,
    dli_number INT,

    recognized_employer_pilot rep_enum,

    environmental_certification JSONB,
    community_involvement JSONB,

    glassdoor_rating DECIMAL(3,2),
    indeed_rating DECIMAL(3,2),

    awards_and_recognition TEXT,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- 3. TRIGGER
-- ================================

CREATE TRIGGER update_company_profiles_updated_at
BEFORE UPDATE ON company_profiles
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
