import os
import sys
from pathlib import Path
from supabase import create_client, Client
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def apply_migration(migration_file=None):
    """
    Apply migration SQL file(s) to the database

    Args:
        migration_file: Specific migration file to apply (optional)
                       If None, applies all migrations in order
    """
    # Initialize Supabase client
    url = os.environ.get("SUPABASE_URL")
    key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")

    if not url or not key:
        logger.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY")
        return False

    # Get migration files
    project_root = Path(__file__).parent.parent
    migrations_dir = project_root / 'migrations'
    if migration_file:
        migration_files = [migrations_dir / migration_file]
    else:
        # Get all .sql files sorted by name
        migration_files = sorted(migrations_dir.glob('*.sql'))

    if not migration_files:
        logger.error(f"No migration files found in {migrations_dir}")
        return False

    # Read and combine migration SQL
    migration_sql = ""
    for mig_file in migration_files:
        logger.info(f"Reading migration: {mig_file.name}")
        with open(mig_file, 'r') as f:
            migration_sql += f"\n-- File: {mig_file.name}\n"
            migration_sql += f.read()
            migration_sql += "\n"

    logger.info(f"Applying {len(migration_files)} migration(s)...")

    try:
        # Create Supabase client
        supabase: Client = create_client(url, key)

        # Execute the migration SQL using the PostgREST SQL endpoint
        # Note: We need to use the raw SQL execution via RPC
        result = supabase.rpc('exec_sql', {'sql': migration_sql}).execute()
        logger.info("✓ Migration applied successfully!")
        return True
    except Exception as e:
        # If RPC doesn't work, try using postgrest directly
        logger.warning(f"RPC method failed: {e}")
        logger.info("Trying alternative method...")

        # Try to create table directly using table creation
        try:
            # Since Supabase Python client doesn't have direct SQL execution,
            # we'll need to use psycopg2 or the REST API
            import psycopg2

            # Get connection string from env
            conn_string = os.environ.get("POSTGRES_URL_NON_POOLING")

            # Connect and execute
            conn = psycopg2.connect(conn_string)
            cur = conn.cursor()

            # Execute migration
            cur.execute(migration_sql)
            conn.commit()

            cur.close()
            conn.close()

            logger.info("✓ Migration applied successfully using direct PostgreSQL connection!")
            return True

        except ImportError:
            logger.error("psycopg2 not installed. Installing...")
            os.system("pip install psycopg2-binary")
            logger.info("Please run this script again after psycopg2 is installed")
            return False
        except Exception as e2:
            logger.error(f"Failed to apply migration: {e2}")
            return False

if __name__ == "__main__":
    apply_migration()
