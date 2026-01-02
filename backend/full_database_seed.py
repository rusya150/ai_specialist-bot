import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.models.models import Category, Item

def seed_db():
    db_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ai_specialist.db")
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Clear existing data to ensure clean state as requested
        print("Clearing old data...")
        db.query(Item).delete()
        db.query(Category).delete()
        db.commit()

        print("Creating categories...")
        # 1. Create Categories
        # 1: ChatGPT
        # 2: AI Сервіси (Single link)
        # 3: Навчальні матеріали (Guides moved here)
        categories_data = [
            {"id": 1, "name": "ChatGPT Матеріали", "description": "Гайди та інструкції по роботі з ChatGPT"},
            {"id": 2, "name": "AI Сервіси", "description": "База корисних AI інструментів"},
            {"id": 3, "name": "Навчальні матеріали", "description": "Гайди та туторіали"},
            {"id": 4, "name": "Промпти", "description": "База промптів"}
        ]
        
        for cat_data in categories_data:
            category = Category(id=cat_data["id"], name=cat_data["name"], description=cat_data["description"])
            db.add(category)
            print(f"Created category: {cat_data['name']}")
        
        db.commit()
        
        # 2. Add Items for Category 1 (ChatGPT) - Same as before
        cat1_items = [
            {"title": "ChatGPT: огляд та покрокова реєстрація", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-18c8be6cf0cb81eda836d8b9b172286a", "desc": "Дізнайтеся, як зареєструватися та почати роботу."},
            {"title": "Огляд інтерфейсу ChatGPT", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-18c8be6cf0cb819ab2b6dc1a8e0378e2", "desc": "Детальний огляд основних елементів інтерфейсу."},
            {"title": "Як штучний інтелект може спростити ваше життя? (Ч. 1)", "url": "https://tiny-relish-c9b.notion.site/1-18c8be6cf0cb8117adbffab9ed4d5e3f", "desc": "Вступ до можливостей ШІ у повсякденному житті."},
            {"title": "Спрощуємо побут із ChatGPT. Теорія (Ч. 2)", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-2-18b8be6cf0cb8022ac82e9e1c2ea227d", "desc": "Теоретичні основи використання ChatGPT для побутових задач."},
            {"title": "Як спростити побут: практикум (Ч. 3)", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-3-18e8be6cf0cb80e8a5e0c552671cca0f", "desc": "Практичні кейси спрощення побуту."},
            {"title": "Пишемо тексти з ChatGPT (Ч. 4)", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-4-1918be6cf0cb807b871ac590176ede61", "desc": "Навчимося генерувати якісні тексти."},
            {"title": "Генеруємо ідеї з ChatGPT (Ч. 5)", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-5-1928be6cf0cb806f8451d7101a335b9b", "desc": "Брейнштормінг та креатив з ШІ."},
            {"title": "Працюємо з даними в ChatGPT (Ч. 6)", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-6-19a8be6cf0cb80b3bf64fcb5702a435d", "desc": "Аналіз та обробка даних."},
            {"title": "Гайд: Як зробити відповіді ChatGPT людяними", "url": "https://tiny-relish-c9b.notion.site/ChatGPT-2428be6cf0cb8072b6b1ef034365d784", "desc": "Тонкі налаштування тону та стилю."},
            {"title": "ДЗ: Аналіз та генерація ідей", "url": "https://tiny-relish-c9b.notion.site/3-5-24e8be6cf0cb8050b084f62e3ad48b8f", "desc": "Домашнє завдання для закріплення матеріалу."},
            {"title": "Prompt Master AI", "url": "https://prompt-master-ai-99482.surge.sh/", "desc": "Зовнішній інструмент."}
        ]
        
        print("Seeding ChatGPT items...")
        for item_data in cat1_items:
            new_item = Item(
                category_id=1,
                title=item_data["title"],
                content=item_data["desc"],
                metadata_info=item_data["url"]
            )
            db.add(new_item)

        # 3. Add Items for Category 3 (Навчальні матеріали)
        cat3_items = [
            {"title": "ДЗ: Генерація зображень, fliki.ai та opus.pro", "url": "https://tiny-relish-c9b.notion.site/3-3-AI-3-4-fliki-ai--2a58be6cf0cb80988061e1f101c656e3", "desc": "Робота з генерацією медіа."},
            {"title": "Посібник з використання Sora 2", "url": "https://tiny-relish-c9b.notion.site/Sora-2-28c8be6cf0cb803ea579c1bbc2d5b0c5", "desc": "Інструкція до Sora 2."},
            {"title": "Midjourney V7: огляд можливостей", "url": "https://tiny-relish-c9b.notion.site/Midjourney-V7-1e98be6cf0cb8093b794c99507fc535b", "desc": "Що нового у версії V7."},
            {"title": "Midjourney: як створювати різноманітних людей", "url": "https://tiny-relish-c9b.notion.site/Midjourney-2328be6cf0cb804ca037ee9f70562bbf", "desc": "Техніки промптингу персонажів."},
            {"title": "Midjourney V7: Remix, Tile та Enhance", "url": "https://tiny-relish-c9b.notion.site/Midjourney-V7-Remix-Tile-Enhance-1e98be6cf0cb80768d5df0ed8bf097c4", "desc": "Просунуті інструменти Midjourney."},
            {"title": "Omni-Reference у Midjourney V7", "url": "https://tiny-relish-c9b.notion.site/Omni-Reference-Midjourney-V7-1e98be6cf0cb807d8b27ce40853d7fce", "desc": "Використання референсів."},
            {"title": "AI-фотографія: ракурси та кути огляду", "url": "https://tiny-relish-c9b.notion.site/AI-1ac8be6cf0cb8133a3cfd6fd0d788728", "desc": "Основи композиції в AI Art."},
            {"title": "Nano Banana: Від селфі до обкладинки у стилі Forbes за 10 хвилин", "url": "https://tiny-relish-c9b.notion.site/Nano-Banana-Forbes-10-2a28be6cf0cb80e490a2fe288d80b379", "desc": "Створення професійних обкладинок."},
            {"title": "Пояснення до виконання домашнього завдання «Аналіз та генерація нових ідей для контенту»", "url": "https://www.notion.so/3-5-24e8be6cf0cb8050b084f62e3ad48b8f", "desc": "Додаткові пояснення до ДЗ."}
        ]
        
        print("Seeding Learning Materials items (Cat 3)...")
        for item_data in cat3_items:
             new_item = Item(
                category_id=3,
                title=item_data["title"],
                content=item_data["desc"],
                metadata_info=item_data["url"]
            )
             db.add(new_item)

        # 4. Add Items for Category 2 (AI Services)
        cat2_items = [
            {"title": "База нейронок (Notion)", "url": "https://tiny-relish-c9b.notion.site/1ac8be6cf0cb81108586da9560de4291", "desc": "Повна база інструментів."}
        ]
        
        print("Seeding AI Services items (Cat 2)...")
        for item_data in cat2_items:
             new_item = Item(
                category_id=2,
                title=item_data["title"],
                content=item_data["desc"],
                metadata_info=item_data["url"]
            )
             db.add(new_item)

        # 5. Add Items for Category 4 (Prompts)
        cat4_items = [
             {"title": "БАЗА ПРОМПТІВ", "url": "https://tiny-relish-c9b.notion.site/2dc8be6cf0cb81e684cbfee85ee90e62", "desc": "Велика колекція перевірених промптів."}
        ]
        
        print("Seeding Prompts items (Cat 4)...")
        for item_data in cat4_items:
             new_item = Item(
                category_id=4,
                title=item_data["title"],
                content=item_data["desc"],
                metadata_info=item_data["url"]
            )
             db.add(new_item)

        db.commit()
        print("Database seeded successfully!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
