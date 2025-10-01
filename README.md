# Planilhas Gov BR - Backend

**Infraestrutura backend para dashboard de concursos públicos brasileiros.**

Este projeto automatiza a extração, transformação e carga (ETL) de planilhas oficiais do governo contendo dados de concursos públicos de 2001-2025 em um banco de dados Supabase, fornecendo a base de dados para dashboards analíticos.

## Funcionalidades

### Pipeline de Processamento de Dados
- **Suporte multi-formato**: Processa arquivos .xls (2001-2015) e .xlsx (2016-2025)
- **Detecção inteligente de cabeçalhos**: Localiza automaticamente tabelas de dados dentro de planilhas com cabeçalhos de metadados
- **Normalização de colunas**: Mapeia 50+ variações de nomes de colunas em português para esquema padronizado
- **Validação de dados**: Limpa e padroniza valores (níveis de escolaridade, tipos de autorização, etc.)
- **CSVs individuais**: Exporta cada arquivo fonte para `converted_csvs/` para auditoria
- **Saídas consolidadas**: Cria `consolidated_data.csv` e `consolidated_data.json` unificados

### Integração com Banco de Dados
- **ETL Supabase**: Upload em lote para PostgreSQL via Supabase
- **Esquema normalizado**: Nomes de colunas em snake_case com tipos de dados apropriados
- **Índices de performance**: Otimizado para consultas de dashboard em dimensões-chave
- **Tratamento de erros**: Logging abrangente para problemas de qualidade de dados

## Requisitos

- Python 3.10+
- uv (gerenciador de pacotes)
- Dependências: pandas, openpyxl, xlrd, supabase, python-dotenv, psycopg2-binary

## Guia Rápido

### 1. Instalar Dependências
```bash
uv sync
```

### 2. Processar Planilhas
```bash
python process_spreadsheets.py
```
Converte todos os arquivos .xls/.xlsx no diretório para:
- CSVs individuais em `converted_csvs/`
- `consolidated_data.csv` (dataset unificado)
- `consolidated_data.json` (formato JSON)
- `error_log.txt` (se houver falhas)

### 3. Configurar Supabase (Primeira Vez)

Crie arquivo `.env` com suas credenciais Supabase:
```env
SUPABASE_URL=sua_url_do_projeto
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_key
POSTGRES_URL_NON_POOLING=sua_string_de_conexao_postgres
```

Aplique a migração do banco de dados:
```bash
uv run apply_migration.py
```

### 4. Upload para Supabase
```bash
uv run upload_to_supabase_normalized.py
```
Envia todos os registros em lotes de 1000 para a tabela `government_data`.

## Dados de Saída

**Os dados consolidados incluem:**
- 3.691+ registros (até 2025)
- 25 anos de dados de concursos (2001-2025)
- 16 colunas normalizadas cobrindo organizações, cargos, autorizações e publicações