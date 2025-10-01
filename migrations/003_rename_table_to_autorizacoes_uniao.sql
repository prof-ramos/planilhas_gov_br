-- Migration: Rename government_data to autorizacoes_uniao
-- Created: 2025-10-01
-- Description: Renames the table to a more descriptive Portuguese name

-- Rename the table
ALTER TABLE government_data RENAME TO autorizacoes_uniao;

-- Rename indexes to match new table name
ALTER INDEX idx_government_data_orgao RENAME TO idx_autorizacoes_uniao_orgao;
ALTER INDEX idx_government_data_cargo RENAME TO idx_autorizacoes_uniao_cargo;
ALTER INDEX idx_government_data_tipo_autorizacao RENAME TO idx_autorizacoes_uniao_tipo_autorizacao;
ALTER INDEX idx_government_data_ano RENAME TO idx_autorizacoes_uniao_ano;

-- Rename trigger
DROP TRIGGER IF EXISTS update_government_data_updated_at ON autorizacoes_uniao;
CREATE TRIGGER update_autorizacoes_uniao_updated_at
  BEFORE UPDATE ON autorizacoes_uniao
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update table comment
COMMENT ON TABLE autorizacoes_uniao IS 'Dados de autorizações e provimentos de concursos públicos federais brasileiros (2001-2025)';
