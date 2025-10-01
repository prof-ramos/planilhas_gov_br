import pandas as pd
import os
import glob
from pathlib import Path

def normalize_column_headers(df):
    """
    Normalize column headers to match the Dicionário de Dados when possible.
    """
    # Standardize headers based on the Dicionário de Dados provided in the task
    header_mapping = {
        # Portuguese variations that might appear in the files
        'orgao/entidade': 'Orgao_Entidade',
        'órgão/entidade': 'Orgao_Entidade',
        'orgao': 'Orgao_Entidade',
        'órgão': 'Orgao_Entidade',
        'entidade': 'Orgao_Entidade',
        'entidade/orgao': 'Orgao_Entidade',
        'entidade/orgão': 'Orgao_Entidade',
        
        'vinculo_orgao_entidade': 'Vinculo_Orgao_Entidade',
        'vínculo órgão/entidade': 'Vinculo_Orgao_Entidade',
        'vínculo orgão/entidade': 'Vinculo_Orgao_Entidade',
        'vinculo': 'Vinculo_Orgao_Entidade',
        'vínculo': 'Vinculo_Orgao_Entidade',
        'setor': 'Setor',
        'vínculo': 'Vinculo_Orgao_Entidade',
        
        'cargos': 'Cargos',
        'cargo': 'Cargos',
        'cargos.': 'Cargos',
        'cargo.': 'Cargos',
        
        'escolaridade': 'Escolaridade',
        'esc.': 'Escolaridade',
        
        'vagas': 'Vagas',
        
        'ato oficial': 'Ato_Oficial',
        'ato_oficial': 'Ato_Oficial',
        'publicacao': 'Ato_Oficial',
        'publicação': 'Ato_Oficial',
        'norma juridica': 'Ato_Oficial',
        'norma jurídica': 'Ato_Oficial',
        
        'tipo de autorizacao': 'Tipo_Autorizacao',
        'tipo_de_autorizacao': 'Tipo_Autorizacao',
        'tipo autorizacao': 'Tipo_Autorizacao',
        'tipo autorização': 'Tipo_Autorizacao',
        'tipo de autorização': 'Tipo_Autorizacao',
        
        'd.o.u': 'DOU',
        'link dou': 'DOU',
        'link do dou': 'DOU',
        'publicação     diário oficial da união - dou': 'DOU',
        'publicação diário oficial da união - dou': 'DOU',
        'link da publicação no d.o.u.': 'DOU',
        'data provimento': 'Data_Provimento',
    }
    
    # Create a normalized column mapping
    normalized_columns = {}
    for col in df.columns:
        col_lower = str(col).lower().strip().replace(' ', '_').replace('.', '').replace('\n', '')
        if col_lower in header_mapping:
            normalized_columns[col] = header_mapping[col_lower]
        elif col_lower in [key.replace(' ', '_') for key in header_mapping.keys()]:
            # Handle cases where spaces were not replaced with underscores
            for original_key, mapped_value in header_mapping.items():
                if original_key.replace(' ', '_').lower() == col_lower:
                    normalized_columns[col] = mapped_value
                    break
        else:
            # Keep the original column name if no mapping is found
            # But clean it to ensure it's a valid identifier
            cleaned_col = str(col).strip().replace(' ', '_').replace('.', '_').replace('-', '_').replace('\n', '_')
            normalized_columns[col] = cleaned_col
    
    df = df.rename(columns=normalized_columns)
    return df


def normalize_data_values(df):
    """
    Apply data normalization following best practices of data analysis:
    1. Clean string columns (remove extra whitespace)
    2. Standardize text case
    3. Handle missing values consistently
    4. Ensure data types are appropriate
    """
    for col in df.columns:
        # Handle string columns
        if df[col].dtype == 'object':
            # Remove extra whitespace from string columns
            df[col] = df[col].apply(lambda x: x.strip() if isinstance(x, str) else x)
            
            # For specific columns that should have consistent formatting
            if col in ['Orgao_Entidade', 'Cargos', 'Vinculo_Orgao_Entidade']:
                # Apply title case to proper names
                df[col] = df[col].apply(lambda x: x.title() if isinstance(x, str) else x)
            elif col == 'Escolaridade':
                # Standardize escolaridade values, but only for scalar values
                df[col] = df[col].apply(lambda x: normalize_escolaridade(x) if not pd.isna(x) and isinstance(x, (str, int, float)) else x)
            elif col == 'Tipo_Autorizacao':
                # Standardize autorizacao types, but only for scalar values
                df[col] = df[col].apply(lambda x: normalize_tipo_autorizacao(x) if not pd.isna(x) and isinstance(x, (str, int, float)) else x)
        
        # Handle numeric columns
        if col == 'Vagas':
            # Ensure Vagas column is numeric, convert invalid values to NaN
            df[col] = pd.to_numeric(df[col], errors='coerce')

    return df

def normalize_escolaridade(value):
    """Normalize escolaridade values"""
    if pd.isna(value):
        return value
    
    if isinstance(value, str):
        value = value.strip().upper()
        # Standardize common abbreviations
        if value in ['NI', 'NIVEL INTERMEDIARIO', 'NÍVEL INTERMEDIÁRIO', 'NIVEL INTERMEDIÁRIO']:
            return 'Nível Intermediário'
        elif value in ['NS', 'NIVEL SUPERIOR', 'NÍVEL SUPERIOR', 'NIVEL SUPERIOR']:
            return 'Nível Superior'
        else:
            return value.title()  # Apply title case for other values
    return value

def normalize_tipo_autorizacao(value):
    """Normalize tipo autorizacao values"""
    if pd.isna(value):
        return value
    
    if isinstance(value, str):
        value = value.strip()
        # Standardize common variations
        if any(term in value.upper() for term in ['CONCURSO', 'PUBLICO', 'PÚBLICO']) and any(term in value.upper() for term in ['PUBLICO', 'PÚBLICO']):
            return 'Concurso Público'
        elif any(term in value.upper() for term in ['PROVIMENTO', 'ORIGINARIO', 'ORIGINÁRIO']):
            return 'Provimento Originário'
        elif any(term in value.upper() for term in ['PROVIMENTO', 'ADICIONAL']):
            return 'Provimento Adicional'
        elif any(term in value.upper() for term in ['PROVIMENTO', 'EXCEPCIONAL', 'EXCEPCIONAL']):
            return 'Provimento Excepcional'
        elif any(term in value.upper() for term in ['CONTRATACAO', 'CONTRATAÇÃO', 'TEMPORARIA', 'TEMPORÁRIA']):
            return 'Contratação Temporária'
        else:
            return value.title()  # Apply title case for other values
    return value

def find_data_start_row(df):
    """
    Attempts to find the row where the actual data begins (with column headers).
    Looks for key column names that match the Dicionário de Dados.
    """
    key_headers = [
        'orgao/entidade', 'órgão/entidade', 'orgao', 'órgão', 'entidade',
        'cargos', 'cargo', 'escolaridade', 'esc.', 'vagas', 
        'ato oficial', 'ato_oficial', 'tipo de autorizacao', 'tipo_de_autorizacao'
    ]
    
    for idx, row in df.iterrows():
        row_str = ' '.join(str(val).lower() for val in row.values if pd.notna(val))
        if any(key in row_str for key in key_headers):
            return idx
    
    # If we can't find it, default to 0
    return 0

def process_spreadsheets(directory_path):
    """
    Process all Excel files in the given directory, convert each to CSV,
    and create consolidated CSV and JSON files.

    Args:
        directory_path (str): Path to directory containing Excel files
    """
    # Define directory path (project root)
    project_root = Path(directory_path)

    # Find all Excel files in data/raw directory
    raw_data_dir = project_root / 'data' / 'raw'
    excel_files = list(raw_data_dir.glob('*.xls')) + list(raw_data_dir.glob('*.xlsx'))

    # Create output directory for individual CSVs
    processed_dir = project_root / 'data' / 'processed'
    output_dir = processed_dir / 'converted_csvs'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # List to store all dataframes for consolidation
    dataframes = []
    error_log = []
    
    # Process each Excel file
    for excel_file in excel_files:
        print(f"Processing {excel_file.name}...")
        
        try:
            # First, read the Excel file with no header to determine actual data start
            temp_df = pd.read_excel(excel_file, sheet_name=0, header=None)
            
            # Check if the dataframe has meaningful content
            if temp_df.empty or temp_df.shape[0] == 0 or temp_df.shape[1] == 0:
                print(f"Skipping {excel_file.name} - empty file")
                continue
                
            # Find the row where actual data (with headers) starts
            data_start_row = find_data_start_row(temp_df)
            
            # Read the Excel file again with the correct header row
            df = pd.read_excel(excel_file, sheet_name=0, header=data_start_row)
            
            # Check again after reading with headers
            if df.empty:
                print(f"Skipping {excel_file.name} - no meaningful data after reading headers")
                continue
            
            # Skip rows that are just for formatting or information
            if data_start_row > 0:
                # We already used the header row, so we don't need to skip any rows
                pass
            
            # Normalize the column headers to standardize them
            df = normalize_column_headers(df)
            
            # Apply data normalization following best practices, but with error handling
            try:
                df = normalize_data_values(df)
            except Exception as e:
                print(f"Warning: Could not normalize data for {excel_file.name}: {str(e)}. Using original data.")
                # Continue with original (non-normalized) dataframe
            
            # Create a CSV filename based on the original Excel file
            csv_filename = output_dir / f"{excel_file.stem}.csv"
            
            # Save the dataframe to CSV with 100% data fidelity
            df.to_csv(csv_filename, index=False, encoding='utf-8')
            print(f"Saved: {csv_filename}")
            
            # Add to list for consolidation
            dataframes.append(df)
            
        except Exception as e:
            print(f"Error processing {excel_file.name}: {str(e)}")
            error_log.append({
                'filename': excel_file.name,
                'error': str(e)
            })
    
    # Create consolidated CSV and JSON if there are valid dataframes
    if dataframes:
        # Ensure columns are uniquely named across dataframes to avoid reindexing errors
        for i, df in enumerate(dataframes):
            # Check for duplicate column names within each dataframe
            if df.columns.duplicated().any():
                print(f"DataFrame {i} has duplicate columns: {df.columns[df.columns.duplicated()]}")
                # Handle duplicate columns within the dataframe by adding a suffix
                cols = pd.Series(df.columns)
                for dup in cols[cols.duplicated()].unique():
                    # Find all positions of the duplicated column name
                    dup_locs = cols[cols == dup].index.tolist()
                    # Rename all but the first occurrence
                    for j, loc in enumerate(dup_locs[1:], 1):
                        new_name = f"{dup}_{j}"
                        # Ensure the new name is unique within this dataframe
                        while new_name in cols.values:
                            j += 1
                            new_name = f"{dup}_{j}"
                        cols.iloc[loc] = new_name
                df.columns = cols
                dataframes[i] = df  # Update the dataframe in the list
        
        # Combine all dataframes, aligning columns
        combined_df = pd.concat(dataframes, ignore_index=True, sort=False, join='outer')

        # Save consolidated CSV
        consolidated_csv_path = processed_dir / 'consolidated_data.csv'
        combined_df.to_csv(consolidated_csv_path, index=False, encoding='utf-8')
        print(f"Consolidated CSV saved: {consolidated_csv_path}")

        # Save consolidated JSON
        consolidated_json_path = processed_dir / 'consolidated_data.json'
        combined_df.to_json(consolidated_json_path, orient='records', date_format='iso', indent=2, force_ascii=False)
        print(f"Consolidated JSON saved: {consolidated_json_path}")

    # Log error for corrupted files
    if error_log:
        error_log_path = processed_dir / 'error_log.txt'
        with open(error_log_path, 'w', encoding='utf-8') as f:
            f.write("Error Log for Corrupted Files:\n")
            f.write("="*40 + "\n")
            for err in error_log:
                f.write(f"File: {err['filename']}\n")
                f.write(f"Error: {err['error']}\n")
                f.write("-"*40 + "\n")
        print(f"Error log saved: {error_log_path}")
    
    print("Processing complete!")

# Run the function on the current directory
if __name__ == "__main__":
    # Get project root (parent of scripts directory)
    project_root = Path(__file__).parent.parent
    process_spreadsheets(project_root)