-- Migration: Create government_data table with normalized column names
-- Created: 2025-10-01
-- Description: Stores Brazilian government personnel data from spreadsheets

CREATE TABLE IF NOT EXISTS government_data (
  id BIGSERIAL PRIMARY KEY,

  -- Organization and Entity Information
  orgao_entidade TEXT,
  vinculo_orgao_entidade TEXT,
  setor TEXT,

  -- Position Information
  cargos TEXT,
  escolaridade TEXT,
  vagas INTEGER,

  -- Official Documentation
  ato_oficial TEXT,
  tipo_autorizacao TEXT,
  data_provimento TEXT,

  -- Publication Information
  dou_link TEXT,
  dou_publicacao_ano DOUBLE PRECISION,
  dou_concurso_portaria TEXT,
  dou_concurso_link TEXT,
  link_publicacao_dou TEXT,

  -- Additional Information
  area_atuacao_governamental TEXT,
  observacoes TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_government_data_orgao ON government_data(orgao_entidade);
CREATE INDEX IF NOT EXISTS idx_government_data_cargo ON government_data(cargos);
CREATE INDEX IF NOT EXISTS idx_government_data_tipo_autorizacao ON government_data(tipo_autorizacao);
CREATE INDEX IF NOT EXISTS idx_government_data_ano ON government_data(dou_publicacao_ano);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_government_data_updated_at
  BEFORE UPDATE ON government_data
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add table comment
COMMENT ON TABLE government_data IS 'Brazilian government personnel data including public competitions, appointments, and authorizations from 2001-2025';
