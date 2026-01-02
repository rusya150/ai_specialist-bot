from app.core.database import engine
from sqlalchemy import inspect
from app.models import models # Ensure models are imported so they are known to SQLAlchemy

def check_db():
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    print("Existing tables:", tables)
    
    required_tables = ["users", "items", "user_read_items", "categories", "bookmarks"]
    missing = [t for t in required_tables if t not in tables]
    
    if "users" in tables:
        columns = [c['name'] for c in inspector.get_columns("users")]
        if "telegram_id" in columns:
            print("✅ 'users' table has 'telegram_id' column.")
        else:
            print("❌ 'users' table MISSING 'telegram_id' column!")
    
    if not missing:
        print("✅ All required tables present.")
    else:
        print(f"❌ Missing tables: {missing}")

if __name__ == "__main__":
    # Ensure tables are created
    models.Base.metadata.create_all(bind=engine)
    check_db()
