import uvicorn
import os
from backend.app.main import app

# Hugging Face Spaces Gradio SDK автоматично шукає app.py
# Ми запускаємо наш FastAPI додаток на порту 7860, як того вимагає платформа

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=7860)
