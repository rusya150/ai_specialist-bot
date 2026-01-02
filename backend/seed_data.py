import sys
if sys.platform == 'win32':
    # Fix for Windows console encoding
    sys.stdout.reconfigure(encoding='utf-8')

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models

# Create tables if they don't exist (though main app usually does this)
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    try:
        categories = [
            {"name": "CHATGPT", "description": "ChatGPT guides and resources"},
            {"name": "НАВЧАННЯ", "description": "Educational materials"},
            {"name": "ПРОМПТИ", "description": "Collection of prompts"},
            {"name": "AI СЕРВІСИ", "description": "Various AI services reviews and links"},
            {"name": "АВТОМАТИЗАЦІЯ", "description": "Automation tutorials"},
            {"name": "РЕЙТИНГ", "description": "Leaderboards and stats"}
        ]
        
        for cat in categories:
            exists = db.query(models.Category).filter(models.Category.name == cat["name"]).first()
            if not exists:
                print(f"Adding category: {cat['name']}")
                new_cat = models.Category(name=cat["name"], description=cat["description"])
                db.add(new_cat)
            else:
                print(f"Category already exists: {cat['name']}")
        
        db.commit()
    except Exception as e:
        print(f"Error seeding data: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()
