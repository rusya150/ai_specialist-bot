from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models

# Створення таблиць (якщо ще не створені)
models.Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def add_guide(category_name, title, notion_url):
    """
    Додає гайд у базу даних.
    """
    db = SessionLocal()
    try:
        # 1. Знайти або створити категорію
        category = db.query(models.Category).filter(models.Category.name == category_name).first()
        if not category:
            print(f"⚠️ Категорія '{category_name}' не знайдена. Створюємо...")
            # Опис додаємо простий, якщо категорії немає
            description = f"Матеріали по {category_name}"
            category = models.Category(name=category_name, description=description)
            db.add(category)
            db.commit()
            db.refresh(category)
            print(f"✅ Категорія '{category_name}' створена.")
        
        # 2. Перевірити чи існує гайд
        existing_item = db.query(models.Item).filter(
            models.Item.title == title, 
            models.Item.category_id == category.id
        ).first()

        if existing_item:
            print(f"ℹ️ Гайд '{title}' вже існує. Оновлюємо URL...")
            existing_item.metadata_info = notion_url
            # Також можна оновити контент, якщо треба
            existing_item.content = f"Перейдіть за посиланням: {notion_url}"
            db.commit()
            print(f"🔄 URL оновлено.")
        else:
            # Створюємо новий
            new_item = models.Item(
                category_id=category.id,
                title=title,
                content=f"Перейдіть за посиланням: {notion_url}",
                metadata_info=notion_url
            )
            db.add(new_item)
            db.commit()
            print(f"✅ Гайд '{title}' успішно додано!")
            
    except Exception as e:
        print(f"❌ Помилка при додаванні '{title}': {e}")
        db.rollback()
    finally:
        db.close()

def main():
    print("🚀 Запуск скрипта додавання Notion гайдів...")

    # --- ТУТ ВПИСУЙТЕ ВАШІ ГАЙДИ ---
    # Приклад масиву для додавання
    guides_to_add = [
        # Категорія "ChatGPT"
        {
            "category": "ChatGPT",
            "title": "Основи ChatGPT",
            "url": "https://notion.site/guide-basics" 
        },
        {
            "category": "ChatGPT",
            "title": "Промпт-інжиніринг",
            "url": "https://notion.site/guide-prompts"
        },
        
        # Категорія "AI Сервіси"
        {
            "category": "AI Сервіси",
            "title": "Midjourney для дизайну",
            "url": "https://notion.site/guide-midjourney"
        },
        {
            "category": "AI Сервіси",
            "title": "Генерація відео (Runway/Pika)",
            "url": "https://notion.site/guide-video"
        }
    ]

    # Перебір і додавання
    for guide in guides_to_add:
        add_guide(guide["category"], guide["title"], guide["url"])

    print("🏁 Роботу завершено!")

if __name__ == "__main__":
    main()
