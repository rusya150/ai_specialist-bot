import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

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
        db.refresh(user)
        print(f"SUCCESS. User {telegram_id} is now activated: {user.is_activated}")
        
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    activate_admin()
