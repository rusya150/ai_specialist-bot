import random
import string
import sys
import os

# Add the current directory to sys.path so we can import app
sys.path.append(os.getcwd())

from app.core.database import SessionLocal, engine
from app.models.models import ActivationCode, Base

def generate_code():
    # Format: AI-XXXX-XXXX
    parts = [
        ''.join(random.choices(string.ascii_uppercase + string.digits, k=4)),
        ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    ]
    return f"AI-{'-'.join(parts)}"

def create_codes(n=100):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    count = 0
    created_codes = []
    
    print(f"Generating {n} unique codes...")
    
    while count < n:
        code_str = generate_code()
        exists = db.query(ActivationCode).filter(ActivationCode.code == code_str).first()
        if not exists:
            new_code = ActivationCode(code=code_str)
            db.add(new_code)
            created_codes.append(code_str)
            count += 1
    
    db.commit()
    db.close()
    
    print(f"Successfully generated {n} codes.")
    print("\nFirst 10 codes for testing:")
    for c in created_codes[:10]:
        print(c)

if __name__ == "__main__":
    create_codes()
