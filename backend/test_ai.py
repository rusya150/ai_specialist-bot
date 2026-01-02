import asyncio
import os
import sys

# Ensure we can import 'app'
sys.path.append(os.getcwd())

from app.core.ai_service import ai_service

async def main():
    print("🤖 Testing AI Service...")
    try:
        response = await ai_service.get_response("Привіт, ти працюєш?")
        print(f"✅ Response received:\n{response}")
    except Exception as e:
        print(f"❌ Error during test: {e}")

if __name__ == "__main__":
    asyncio.run(main())
