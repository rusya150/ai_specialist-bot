import os
import sys

# Add the current directory to sys.path so we can import app modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

try:
    from app.core.config import settings
    print("✅ Configuration loaded.")
except ImportError as e:
    print(f"❌ Failed to import settings: {e}")
    sys.exit(1)

print(f"🔑 Groq Key provided: {'Yes' if settings.GROQ_API_KEY else 'No'} ({settings.GROQ_API_KEY[:4]}...)")
print(f"🔑 Gemini Key provided: {'Yes' if settings.GEMINI_API_KEY else 'No'} ({settings.GEMINI_API_KEY[:4]}...)")

import asyncio
from groq import Groq
import google.generativeai as genai

async def test_groq():
    print("\n--- Testing Groq ---")
    try:
        client = Groq(api_key=settings.GROQ_API_KEY)
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": "Test"}],
            model="llama3-8b-8192",
        )
        print("✅ Groq Success!")
        print(f"Response: {chat_completion.choices[0].message.content}")
    except Exception as e:
        print(f"❌ Groq Failed: {e}")

async def test_gemini():
    print("\n--- Testing Gemini ---")
    try:
        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-1.5-flash')
        response = model.generate_content("Test")
        print("✅ Gemini Success!")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"❌ Gemini Failed: {e}")

async def main():
    await test_groq()
    await test_gemini()

if __name__ == "__main__":
    asyncio.run(main())
