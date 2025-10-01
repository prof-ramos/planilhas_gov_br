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

def upload_consolidated_data_to_supabase():
    # Initialize Supabase client using environment variables
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
    supabase: Client = create_client(url, key)
    
    # Read the consolidated data
    df = pd.read_csv('consolidated_data.csv')
    
    # Clean and normalize data before upload (following best practices)
    # Replace NaN values with None (which becomes NULL in the database)
    df = df.where(pd.notnull(df), None)
    
    # Upload data in batches to handle large datasets
    batch_size = 1000
    total_uploaded = 0
    
    try:
        for i in range(0, len(df), batch_size):
            batch = df.iloc[i:i + batch_size].to_dict(orient='records')
            
            # Insert the batch into your Supabase table
            # Note: Replace 'your_table_name' with your actual table name
            response = supabase.table('government_data').insert(batch).execute()
            
            total_uploaded += len(batch)
            logger.info(f"Uploaded batch starting at row {i}, total uploaded: {total_uploaded}")
        
        logger.info(f"Successfully uploaded all {total_uploaded} records to Supabase")
        
        # Also upload to a separate table for JSON format if needed
        df_json = pd.read_json('consolidated_data.json')
        df_json = df_json.where(pd.notnull(df_json), None)
        
        for i in range(0, len(df_json), batch_size):
            batch = df_json.iloc[i:i + batch_size].to_dict(orient='records')
            response = supabase.table('government_data_json').insert(batch).execute()
            
            logger.info(f"Uploaded JSON batch starting at row {i}")
        
        logger.info("Successfully uploaded JSON data to Supabase")
        
    except Exception as e:
        logger.error(f"Error uploading data to Supabase: {str(e)}")
        raise

if __name__ == "__main__":
    upload_consolidated_data_to_supabase()