import asyncio
import sys
import os

# Додаємо кореневу папку проєкту до шляху імпорту
# Припускаємо, що ми запускаємо скрипт з backend/
sys.path.append(os.getcwd())

try:
    from app.core.ai_service import ai_service
except ImportError as e:
    print(f"❌ Помилка імпорту: {e}")
    print(f"Поточний шлях: {sys.path}")
    sys.exit(1)

async def main():
    print("🤖 Тестування прямим підключенням...")
    question = "Привіт, ти працюєш?"
    print(f"❓ Питання: {question}")
    
    try:
        response = await ai_service.get_response(question)
        print(f"\n✅ Відповідь від AI:\n{response}")
    except Exception as e:
        print(f"\n❌ Критична помилка: {e}")

if __name__ == "__main__":
    asyncio.run(main())
