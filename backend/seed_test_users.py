from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models
import random

def seed_test_users():
    db = SessionLocal()
    try:
        # Create 5 test users
        for i in range(5):
            xp = random.randint(20, 150)
            user = models.User(
                telegram_id=1000 + i,
                username=f"test_user_{i}",
                first_name=f"Bot Anabolik {i}",
                photo_url=None,
                experience_points=xp,
                is_activated=True
            )
            # Check if user exists (by telegram_id fallback) needed? 
            # We'll just try/except or query
            existing = db.query(models.User).filter(models.User.telegram_id == user.telegram_id).first()
            if not existing:
                db.add(user)
                print(f"Added {user.first_name} with {xp} XP")
            else:
                print(f"User {user.first_name} already exists")
        
        db.commit()
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_users()
