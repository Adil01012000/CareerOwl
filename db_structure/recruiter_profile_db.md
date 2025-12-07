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
CREATE TYPE recruiter_professional_designation_enum AS ENUM (
    'Registered Recruiter',
    'Lawyer',
    'Paralegal',
    'RCIC (Regulated Canadian Immigration Consultant)'
);

-- ================================
-- 2. CREATE TABLE
-- ================================
CREATE TABLE recruiter_profile (
    id BIGSERIAL PRIMARY KEY,

    professional_designation recruiter_professional_designation_enum,
    name_of_regulatory_body VARCHAR(255),
    registration_number VARCHAR(100),
    registration_expiry_date DATE,
    proof_of_registration TEXT,

    legal_business_name VARCHAR(255) NOT NULL,
    trade_name VARCHAR(255),
    cra_business_number VARCHAR(100),
    primary_contact_email TEXT CHECK (primary_contact_email ~* '^[^@]+@[^@]+\.[^@]+$'),
    primary_phone VARCHAR(50),
    headquarters_address TEXT,
    website_url VARCHAR(255),
    
    years_in_business INT,
    description TEXT,
    logo TEXT,
    registration_document TEXT,
    license_document TEXT,

    is_operating_in_provinces BOOLEAN DEFAULT FALSE,
    operational_provinces JSONB,
    registration_documents JSONB,
    primary_industries JSONB,
    noc_codes JSONB,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- ================================
-- 3. TRIGGER
-- ================================
CREATE TRIGGER update_recruiter_profile_updated_at
BEFORE UPDATE ON recruiter_profile
FOR EACH ROW
EXECUTE FUNCTION moddatetime();
