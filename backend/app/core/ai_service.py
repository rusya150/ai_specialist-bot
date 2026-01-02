import google.generativeai as genai
from groq import Groq
from .config import settings

class AIService:
    def __init__(self):
        # Configure Groq
        self.groq_client = Groq(api_key=settings.GROQ_API_KEY)
        
        # Configure Gemini
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.gemini_model = genai.GenerativeModel('gemini-1.5-flash')

    async def get_response(self, user_message: str) -> str:
        """
        Attempts to get a response from Groq (Llama 3). 
        If it fails, falls back to Gemini.
        """
        # 1. Try Groq
        try:
            print(f"⚡ Trying Groq (Llama 3)...")
            chat_completion = self.groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "user",
                        "content": user_message,
                    }
                ],
                model="llama3-8b-8192",
            )
            return chat_completion.choices[0].message.content
            
        except Exception as e:
            print(f"⚠️ Groq Error: {str(e)}")
            # Fallback implementation below

        # 2. Fallback to Gemini
        try:
            print(f"🔄 Falling back to Gemini...")
            response = self.gemini_model.generate_content(user_message)
            return response.text
        except Exception as e:
            print(f"❌ Gemini Exception: {str(e)}")
            return "Вибачте, всі AI системи зараз перевантажені. Спробуйте пізніше."

ai_service = AIService()
