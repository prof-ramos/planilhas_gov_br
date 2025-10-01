import os
import pandas as pd
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def normalize_column_names(df):
    """
    Map old column names to improved normalized names, handling duplicates by merging
    """
    # First, drop unnamed columns
    unnamed_cols = [col for col in df.columns if 'Unnamed' in str(col) or col == 'Unnamed:_12']
    if unnamed_cols:
        df = df.drop(columns=unnamed_cols)

    # Define column groups that should be merged (multiple source columns -> one target)
    merge_groups = {
        'escolaridade': ['ESC_', 'Escolaridade'],
        'dou_link': ['D_O_U', 'DOU'],
        'dou_concurso_link': ['DOU_(Port__Do_Concurso)', 'DOU_1']
    }

    # Merge columns that map to the same target
    for target_col, source_cols in merge_groups.items():
        available_sources = [col for col in source_cols if col in df.columns]
        if len(available_sources) > 1:
            # Merge: take first non-null value across the columns
            df[target_col] = df[available_sources[0]]
            for col in available_sources[1:]:
                df[target_col] = df[target_col].fillna(df[col])
            # Drop the original columns
            df = df.drop(columns=available_sources)
        elif len(available_sources) == 1:
            # Just rename if only one exists
            df = df.rename(columns={available_sources[0]: target_col})

    # Now handle simple 1-to-1 mappings
    simple_mapping = {
        'Orgao_Entidade': 'orgao_entidade',
        'Vinculo_Orgao_Entidade': 'vinculo_orgao_entidade',
        'Setor': 'setor',
        'Cargos': 'cargos',
        'Vagas': 'vagas',
        'Ato_Oficial': 'ato_oficial',
        'ANO_DA_PUBLICAÇÃO': 'dou_publicacao_ano',
        'Tipo_Autorizacao': 'tipo_autorizacao',
        'PORT__DO_CONCURSO': 'dou_concurso_portaria',
        'LINK_DA_PUBLICAÇÃO_NO_D_O_U_': 'link_publicacao_dou',
        'ÁREA_DE_ATUAÇÃO_GOVERNAMENTAL': 'area_atuacao_governamental',
        'OBS_': 'observacoes',
        'Data_Provimento': 'data_provimento'
    }

    df = df.rename(columns={k: v for k, v in simple_mapping.items() if k in df.columns})

    return df

def clean_data(df):
    """
    Clean and convert data types to match database schema
    """
    # Convert vagas to Int64 (nullable integer type)
    if 'vagas' in df.columns:
        df['vagas'] = pd.to_numeric(df['vagas'], errors='coerce')
        df['vagas'] = df['vagas'].astype('Int64')  # Use nullable Int64 type

    # Convert dou_publicacao_ano to float, handling NaN and inf
    if 'dou_publicacao_ano' in df.columns:
        df['dou_publicacao_ano'] = pd.to_numeric(df['dou_publicacao_ano'], errors='coerce')
        # Replace inf and -inf with None
        df['dou_publicacao_ano'] = df['dou_publicacao_ano'].replace([float('inf'), float('-inf')], None)

    # Replace all remaining NaN values with None
    # Must be done carefully to preserve Int64 type
    for col in df.columns:
        if df[col].dtype == 'object':
            # For object columns, replace NaN with None
            df[col] = df[col].where(pd.notna(df[col]), None)
        elif df[col].dtype == 'float64':
            # For float columns, replace inf with None
            df[col] = df[col].replace([float('inf'), float('-inf')], None)
            df[col] = df[col].where(pd.notna(df[col]), None)

    return df

def upload_government_data_to_supabase():
    """
    Upload consolidated government data to Supabase with normalized column names
    """
    # Initialize Supabase client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        logger.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment variables")
        return

    supabase: Client = create_client(url, key)

    # Read the consolidated data
    logger.info("Reading consolidated data...")
    df = pd.read_csv('consolidated_data.csv')
    logger.info(f"Loaded {len(df)} records from consolidated_data.csv")

    # Normalize column names
    logger.info("Normalizing column names...")
    df = normalize_column_names(df)
    logger.info(f"Normalized columns: {list(df.columns)}")

    # Clean and convert data types
    logger.info("Cleaning and converting data types...")
    df = clean_data(df)

    # Upload data in batches
    batch_size = 1000
    total_uploaded = 0
    total_errors = 0

    import math

    try:
        for i in range(0, len(df), batch_size):
            batch_df = df.iloc[i:i + batch_size].copy()

            # Convert to records
            batch = batch_df.to_dict(orient='records')

            # Final cleanup: ensure no NaN, inf values in the batch
            # Replace all pandas NA types with None for JSON compatibility
            for record in batch:
                for key, value in list(record.items()):
                    # Check for pandas NA, NaN, inf
                    if pd.isna(value):
                        record[key] = None
                    elif isinstance(value, float) and (math.isnan(value) or math.isinf(value)):
                        record[key] = None

            try:
                response = supabase.table('autorizacoes_uniao').insert(batch).execute()
                total_uploaded += len(batch)
                logger.info(f"✓ Uploaded batch {i//batch_size + 1}: rows {i} to {i+len(batch)} (total: {total_uploaded})")
            except Exception as batch_error:
                logger.error(f"✗ Error uploading batch starting at row {i}: {str(batch_error)}")
                total_errors += len(batch)

        logger.info(f"\n{'='*60}")
        logger.info(f"Upload Complete!")
        logger.info(f"Successfully uploaded: {total_uploaded} records")
        if total_errors > 0:
            logger.warning(f"Failed to upload: {total_errors} records")
        logger.info(f"{'='*60}\n")

    except Exception as e:
        logger.error(f"Fatal error during upload: {str(e)}")
        raise

if __name__ == "__main__":
    upload_government_data_to_supabase()
