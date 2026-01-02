try:
    from pydantic import BaseModel
    print("Pydantic imported successfully.")
    
    class User(BaseModel):
        name: str
    
    u = User(name="Test")
    print(f"Model created: {u}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
