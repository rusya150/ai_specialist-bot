from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List
from app.core import database
from app.models import models
from app.schemas import schemas

router = APIRouter()

# --- Категорії ---
@router.get("/categories", response_model=List[schemas.Category])
def get_categories(db: Session = Depends(database.get_db)):
    return db.query(models.Category).all()

@router.post("/categories", response_model=schemas.Category)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(database.get_db)):
    db_category = models.Category(**category.dict())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category

# --- Матеріали (Items) ---
@router.get("/items", response_model=List[schemas.Item])
def get_items(category_id: int | None = None, db: Session = Depends(database.get_db)):
    query = db.query(models.Item)
    if category_id:
        query = query.filter(models.Item.category_id == category_id)
    return query.all()

@router.post("/items", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(database.get_db)):
    db_item = models.Item(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.post("/items/{item_id}/read")
def read_item(item_id: int, user_id: int, db: Session = Depends(database.get_db)):
    # 1. Перевірка користувача
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")

    # 2. Перевірка матеріалу
    item = db.query(models.Item).filter(models.Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Матеріал не знайдено")

    # 3. Перевірка, чи вже прочитано
    existing_read = db.query(models.UserReadItem).filter(
        models.UserReadItem.user_id == user_id,
        models.UserReadItem.item_id == item_id
    ).first()

    if existing_read:
        return {"message": "Вже прочитано", "points_added": 0, "total_xp": user.experience_points}

    # 4. Додавання запису про прочитання + XP
    new_read = models.UserReadItem(user_id=user_id, item_id=item_id)
    db.add(new_read)
    
    user.experience_points += 50
    
    db.commit()
    
    return {"message": "Бали нараховано", "points_added": 50, "total_xp": user.experience_points}
