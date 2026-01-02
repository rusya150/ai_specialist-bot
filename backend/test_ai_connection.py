import asyncio
import sys
import os

# Add project root to python path to ensure imports work
sys.path.append(os.getcwd())

try:
    from app.core.ai_service import ai_service
except ImportError as e:
    print(f"❌ Import Failed: {e}")
    sys.exit(1)

async def main():
    print("📡 Testing AI Connection...")
    try:
        response = await ai_service.get_response("Тест зв'язку")
        print(f"✅ AI Response Received:\n{response}")
    except Exception as e:
        print(f"❌ Connection Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
