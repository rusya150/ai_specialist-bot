import sqlite3
import os

DB_PATH = "ai_specialist.db" # In root or backend? Run command CWD is root, list_dir showed it in root.

# Check location
if not os.path.exists(DB_PATH):
    # Try backend folder
    DB_PATH = "backend/ai_specialist.db"

if not os.path.exists(DB_PATH):
    print(f"Database not found at {DB_PATH}")
    exit(1)

print(f"Fixing database at: {DB_PATH}")

conn = sqlite3.connect(DB_PATH)
cursor = conn.cursor()

def add_column_if_not_exists(table, column, definition):
    try:
        cursor.execute(f"ALTER TABLE {table} ADD COLUMN {column} {definition}")
        print(f"Added column {column} to {table}")
    except sqlite3.OperationalError as e:
        if "duplicate column name" in str(e):
            print(f"Column {column} already exists in {table}")
        else:
            print(f"Error adding {column}: {e}")

# Fix Users table
add_column_if_not_exists("users", "experience_points", "INTEGER DEFAULT 0")
add_column_if_not_exists("users", "is_activated", "BOOLEAN DEFAULT 0")

conn.commit()
conn.close()

print("Database schema patched.")

# Now run the original manual activation logic manually here to save a step
import sys
sys.path.append(os.getcwd())
# Re-importing models/db might be tricky if we just modified the file underneath, but usually OK for new connections.
# Let's just run the previous script again via the shell command for cleanliness, 
# or copy the logic here. Let's copy logic to be robust.

from app.core.database import SessionLocal
from app.models.models import User

def activate_admin(telegram_id=750869199):
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.telegram_id == telegram_id).first()
        
        if user:
            user.is_activated = True
            print(f"User found: {user.first_name} (ID: {user.telegram_id})")
            print("Updating status to ACTIVATED...")
        else:
            print(f"User with ID {telegram_id} not found. Creating new admin user...")
            user = User(
                telegram_id=telegram_id,
                username="admin_manual",
                first_name="Admin",
                is_activated=True
            )
            db.add(user)
        
        db.commit()
        print(f"SUCCESS. User {telegram_id} is now activated.")
        
    except Exception as e:
        print(f"Error in activation: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    activate_admin()
