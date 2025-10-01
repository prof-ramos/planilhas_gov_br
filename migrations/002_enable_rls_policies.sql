-- Migration: Enable RLS and create access policies for government_data
-- Created: 2025-10-01
-- Description: Enables Row-Level Security with public read access (data is public from DOU)
--              and restricts write operations to service_role only (ETL backend)

-- Enable RLS on the table
ALTER TABLE government_data ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to all data
-- Justification: Data is public information from official government publications (DOU)
CREATE POLICY "Enable read access for all users"
ON government_data FOR SELECT
USING (true);

-- Policy 2: Allow insert only for service_role (backend ETL)
-- Justification: Only the backend ETL pipeline should insert new records
CREATE POLICY "Enable insert for service role only"
ON government_data FOR INSERT
TO service_role
WITH CHECK (true);

-- Policy 3: Allow update only for service_role (data corrections)
-- Justification: Only the backend should update records (e.g., data corrections)
CREATE POLICY "Enable update for service role only"
ON government_data FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 4: Allow delete only for service_role (data cleanup)
-- Justification: Only the backend should delete records (e.g., removing duplicates)
CREATE POLICY "Enable delete for service role only"
ON government_data FOR DELETE
TO service_role
USING (true);

-- Add comments documenting the security model
COMMENT ON POLICY "Enable read access for all users" ON government_data IS
  'Public read access: data originates from public government sources (Diário Oficial da União)';

COMMENT ON POLICY "Enable insert for service role only" ON government_data IS
  'Restrict insert to service_role: only the ETL backend should create records';

COMMENT ON POLICY "Enable update for service role only" ON government_data IS
  'Restrict update to service_role: only the ETL backend should modify records';

COMMENT ON POLICY "Enable delete for service role only" ON government_data IS
  'Restrict delete to service_role: only the ETL backend should remove records';
