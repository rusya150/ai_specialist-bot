import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

from app.core.database import SessionLocal
from app.models.models import ActivationCode

def get_codes():
    db = SessionLocal()
    try:
        codes = db.query(ActivationCode).filter(ActivationCode.is_used == False).limit(5).all()
        print("Generated Activation Codes (Unused):")
        for c in codes:
            print(f"- {c.code}")
        
        if not codes:
            print("No unused codes found. Run generate_codes.py first.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    get_codes()
