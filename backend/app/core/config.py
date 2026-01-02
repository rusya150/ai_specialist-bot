import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    TELEGRAM_BOT_TOKEN: str
    admin_ids: list[int] = [750869199]
    GROQ_API_KEY: str
    GEMINI_API_KEY: str

    class Config:
        # Load .env file from the current working directory
        env_file = os.path.join(os.getcwd(), ".env")
        env_file_encoding = 'utf-8'
        extra = 'ignore' # Ignore extra variables to prevent validation errors

settings = Settings()
