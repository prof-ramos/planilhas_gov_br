# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**This is the backend infrastructure for a dashboard project about Brazilian public competitions (concursos públicos).**

The backend automates processing of official government spreadsheets containing authorization and appointment data for public competitions from 2001-2025. Data is extracted, normalized, and loaded into Supabase to power a comprehensive dashboard for analyzing public sector hiring trends in Brazil.

### Data Sources
- **2001-2015**: Historical authorization tables (.xls)
- **2016-2025**: Annual authorization and appointment tables (.xlsx), regularly updated
- All data sourced from official government publications (Diário Oficial da União - DOU)

### Business Domain
The data tracks the lifecycle of public competitions:
1. **Concurso Público**: Authorization to conduct a public competition
2. **Provimento Originário**: Appointment of candidates within original vacancy count
3. **Provimento Adicional**: Additional appointments (up to +25% of original vacancies)
4. **Provimento Excepcional**: Exceptional appointments (beyond +25% of original vacancies)
5. **Contratação Temporária**: Temporary hiring authorizations

## Key Commands

### Processing Spreadsheets
```bash
python process_spreadsheets.py
```
Processes all .xls/.xlsx files in the directory, converts them to individual CSVs in `converted_csvs/`, and creates consolidated outputs (`consolidated_data.csv` and `consolidated_data.json`).

### Uploading to Supabase

**Recommended (with normalized column names):**
```bash
uv run upload_to_supabase_normalized.py
```

**Legacy (original column names):**
```bash
uv run upload_to_supabase.py
```

Both scripts upload consolidated data to Supabase. Requires `.env` file with:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `POSTGRES_URL_NON_POOLING` (for migrations)

### Database Migrations
```bash
uv run apply_migration.py
```
Applies the migration in `migrations/001_create_government_data_table.sql` to create the database schema with normalized column names.

### Installing Dependencies
```bash
uv sync
```
or
```bash
pip install pandas openpyxl xlrd supabase python-dotenv
```

## Architecture

### Two-Script Pipeline

1. **process_spreadsheets.py** - Data extraction and normalization
   - Detects data start rows dynamically using `find_data_start_row()` since government spreadsheets often have header/metadata rows before the actual data table
   - Normalizes column headers via `normalize_column_headers()` to map Portuguese variations to standard field names (Dicionário de Dados)
   - Normalizes data values via `normalize_data_values()` for text cleaning, case standardization, and type coercion
   - Handles duplicate columns and combines heterogeneous dataframes using pandas outer join
   - Error handling for corrupted files logged to `error_log.txt`

2. **upload_to_supabase.py** - Database upload
   - Batch uploads (1000 records at a time) to handle large datasets
   - Converts pandas NaN to None (SQL NULL)
   - Uploads to two tables: `government_data` (from CSV) and `government_data_json` (from JSON)

### Data Normalization Strategy

The codebase implements domain-specific normalization for Brazilian government data:

- **Header mapping** (process_spreadsheets.py:11-59): Maps ~50 Portuguese column name variations to standard fields like `Orgao_Entidade`, `Cargos`, `Vinculo_Orgao_Entidade`, `Escolaridade`, `Vagas`, `Ato_Oficial`, `Tipo_Autorizacao`, `DOU`, `Data_Provimento`
- **Value normalization functions**:
  - `normalize_escolaridade()`: Standardizes education levels (e.g., "NI" → "Nível Intermediário")
  - `normalize_tipo_autorizacao()`: Standardizes authorization types (e.g., variations → "Concurso Público")

This normalization is critical because government spreadsheets have inconsistent formatting across years and agencies.

### Data Structure Notes

- Government Excel files have irregular structures: titles, metadata rows, then actual data tables
- Column headers may span multiple rows or contain line breaks
- Data validation is defensive due to corruption/format inconsistencies in source files
- The consolidated output may have many columns due to outer join of varying file schemas

## Database Schema

A tabela `autorizacoes_uniao` armazena dados normalizados de concursos públicos federais com a seguinte estrutura:

### Core Fields (from Dicionário de Dados)

| Column | Type | Description |
|--------|------|-------------|
| `orgao_entidade` | TEXT | Organization/entity receiving the authorization |
| `vinculo_orgao_entidade` | TEXT | Acronym of parent organization |
| `setor` | TEXT | Sector/department |
| `cargos` | TEXT | Position/role being authorized |
| `escolaridade` | TEXT | Education requirement (NI = Nível Intermediário, NS = Nível Superior) |
| `vagas` | INTEGER | Number of authorized vacancies |
| `ato_oficial` | TEXT | Official act authorizing the competition (Portaria, Decreto, etc.) |
| `tipo_autorizacao` | TEXT | Authorization type (see Business Domain section) |
| `data_provimento` | TEXT | Appointment date |

### Publication Fields

| Column | Type | Description |
|--------|------|-------------|
| `dou_link` | TEXT | Link to DOU (Diário Oficial da União) publication |
| `dou_publicacao_ano` | DOUBLE PRECISION | Year of DOU publication |
| `dou_concurso_portaria` | TEXT | Competition portaria number |
| `dou_concurso_link` | TEXT | Link to competition portaria in DOU |
| `link_publicacao_dou` | TEXT | Alternative DOU publication link |

### Additional Fields

| Column | Type | Description |
|--------|------|-------------|
| `area_atuacao_governamental` | TEXT | Government area of operation |
| `observacoes` | TEXT | Observations/notes |
| `created_at` | TIMESTAMPTZ | Record creation timestamp (auto) |
| `updated_at` | TIMESTAMPTZ | Record update timestamp (auto) |

### Performance Features
- **Indexes**: `orgao_entidade`, `cargos`, `tipo_autorizacao`, `dou_publicacao_ano` for fast filtering
- **Auto-update trigger**: `updated_at` automatically maintained
- **Flexible TEXT types**: Accommodates varying government data formats across 25 years

## Dashboard Use Cases

This backend supports a comprehensive dashboard for analyzing Brazilian public competitions. Potential analytics include:

### Temporal Analysis
- Competition trends over 25 years (2001-2025)
- Seasonal patterns in authorizations and appointments
- Year-over-year vacancy growth by organization

### Organizational Insights
- Top hiring organizations by vacancy count
- Distribution of positions across government sectors
- Organization hierarchy analysis via `vinculo_orgao_entidade`

### Position Analytics
- Most in-demand positions (`cargos`)
- Education requirements trends (intermediate vs. superior)
- Vacancy allocation by skill level

### Authorization Flow Analysis
- Distribution of authorization types (público, originário, adicional, excepcional, temporário)
- Time between authorization and appointment
- Additional/exceptional appointment rates (indicates competition demand)

### Geographic & Sectoral Trends
- Government area distribution (`area_atuacao_governamental`)
- Cross-sector vacancy comparisons

## Working with This Codebase

- The hardcoded directory path in process_spreadsheets.py:302 should be updated when running in different environments
- When modifying normalization logic, test against multiple file formats (see QWEN.md for file inventory)
- The normalized upload script (`upload_to_supabase_normalized.py`) handles:
  - Duplicate column merging (e.g., multiple "DOU" columns → single `dou_link`)
  - Data type conversion (float vagas → integer)
  - NaN/inf value handling for JSON compatibility
  - Batch uploads (1000 records/batch) for performance
- Supabase table name: `autorizacoes_uniao` (dados normalizados de autorizações e provimentos)
- **Segurança RLS habilitada**:
  - Leitura pública (dados são públicos do DOU)
  - Escrita restrita ao service_role (apenas backend ETL)
- The project uses uv for dependency management (pyproject.toml exists)
