import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Без дефолта навмисно: порожній токен зробив би HMAC-перевірку initData
    # обчислюваною будь-ким (обхід авторизації). Краще не стартувати взагалі.
    TELEGRAM_BOT_TOKEN: str
    admin_ids: list[int] = [750869199]
    # Використовуються лише в ai_service.py, який тягне chat.py — а той не
    # підключений у main.py. Відсутній ключ не має валити старт усього API.
    GROQ_API_KEY: str = ""
    GEMINI_API_KEY: str = ""

    class Config:
        # Load .env file from the current working directory
        env_file = os.path.join(os.getcwd(), ".env")
        env_file_encoding = 'utf-8'
        extra = 'ignore' # Ignore extra variables to prevent validation errors

settings = Settings()
