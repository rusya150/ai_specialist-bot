import sys
try:
    from app.api import content
    print("Import successful")
except Exception as e:
    print(f"Import failed: {e}")
    sys.exit(1)
