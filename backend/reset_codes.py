import sys
import os
import random
import string
import sqlite3

# Locate Database
DB_PATH = "ai_specialist.db"
if not os.path.exists(DB_PATH):
    if os.path.exists("backend/ai_specialist.db"):
        DB_PATH = "backend/ai_specialist.db"

print(f"Using database: {DB_PATH}")

def generate_code():
    parts = [
        ''.join(random.choices(string.ascii_uppercase + string.digits, k=4)),
        ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    ]
    return f"AI-{'-'.join(parts)}"

def reset_codes():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    try:
        # Clear table
        cursor.execute("DELETE FROM activation_codes")
        print("Cleared existing codes.")
        
        # Generate and insert 5 new codes
        new_codes = []
        for _ in range(5):
            code = generate_code()
            cursor.execute("INSERT INTO activation_codes (code, is_used, created_at) VALUES (?, 0, datetime('now'))", (code,))
            new_codes.append(code)
            
        conn.commit()
        print("Successfully generated 5 new codes:")
        for code in new_codes:
            print(code)
            
    except Exception as e:
        print(f"Error: {e}")
    finally:
        conn.close()

if __name__ == "__main__":
    reset_codes()
