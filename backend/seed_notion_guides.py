from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine
from app.models import models

def seed_notion_guides():
    db: Session = SessionLocal()
    try:
        print("🌱 Початок наповнення бази даних...")

        # 1. Створення категорій
        categories_to_create = [
            {"name": "ChatGPT", "description": "Гайди, туторіали, статті по роботі з СhatGPT"},
            {"name": "AI Сервіси", "description": "Гайди, туторіали, статті по роботі з AI сервісами"}
        ]
        
        categories_map = {}

        for cat_data in categories_to_create:
            existing = db.query(models.Category).filter(models.Category.name == cat_data["name"]).first()
            if not existing:
                new_cat = models.Category(name=cat_data["name"], description=cat_data["description"])
                db.add(new_cat)
                db.commit()
                db.refresh(new_cat)
                categories_map[new_cat.name] = new_cat.id
                print(f"✅ Категорія створена: {new_cat.name}")
            else:
                categories_map[existing.name] = existing.id
                print(f"🔹 Категорія вже існує: {existing.name}")

        # 2. Дані для наповнення (МАСИВ ДЛЯ РЕДАГУВАННЯ)
        # Додавайте сюди ваші посилання
        guides_data = [
            {
                "category": "ChatGPT",
                "title": "Основи роботи з ChatGPT",
                "url": "https://notion.so/your-link-here",
                "content": "Базовий гайд для новачків"
            },
            {
                "category": "AI Сервіси",
                "title": "Огляд Midjourney",
                "url": "https://notion.so/your-link-here-2",
                "content": "Як генерувати зображення"
            }
        ]

        # 3. Додавання матеріалів
        for item in guides_data:
            cat_id = categories_map.get(item["category"])
            if not cat_id:
                print(f"⚠️ Категорію не знайдено: {item['category']}")
                continue

            # Перевірка на дублікати за URL (у полі metadata_info)
            # Якщо URL може бути None, краще перевіряти за назвою
            existing_item = db.query(models.Item).filter(models.Item.title == item["title"]).first()
            
            if not existing_item:
                new_item = models.Item(
                    category_id=cat_id,
                    title=item["title"],
                    content=item["content"],
                    metadata_info=item["url"] # Зберігаємо URL тут
                )
                db.add(new_item)
                print(f"✅ Матеріал додано: {item['title']}")
            else:
                # Оновлюємо URL якщо змінився
                if existing_item.metadata_info != item["url"]:
                    existing_item.metadata_info = item["url"]
                    print(f"🔄 Матеріал оновлено: {item['title']}")
                else:
                    print(f"🔹 Матеріал вже існує: {item['title']}")

        db.commit()
        print("🎉 Наповнення завершено успішно!")

    except Exception as e:
        print(f"❌ Помилка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_notion_guides()
