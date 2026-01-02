import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.getcwd())

try:
    from app.core.ai_service import ai_service
except ImportError as e:
    print(f"❌ Import Error: {e}")
    print(f"Current Path: {sys.path}")
    sys.exit(1)

async def main():
    print("🤖 Testing AI Service (Groq with Gemini Fallback)...")
    question = "Привіт, хто ти?"
    print(f"❓ Question: {question}")
    
    try:
        response = await ai_service.get_response(question)
        print(f"\n✅ AI Response:\n{response}")
    except Exception as e:
        print(f"\n❌ Critical Error in check_ai: {e}")

if __name__ == "__main__":
    asyncio.run(main())
