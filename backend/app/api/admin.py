from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.core import database, security, config
from app.models import models
from app.schemas import schemas

router = APIRouter()

def get_current_admin(auth_data: schemas.TelegramAuth, db: Session = Depends(database.get_db)) -> models.User:
    """
    Залежність (Dependency) для перевірки прав адміністратора.
    """
    user_data = security.validate_init_data(auth_data.initData)
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Невірні дані Telegram"
        )
    
    telegram_id = user_data.get("id")
    # Using lowercase admin_ids as defined in Settings
    if not telegram_id or telegram_id not in config.settings.admin_ids:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Немає доступу до панелі адміністратора"
        )
        
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Адміністратора не знайдено в БД")
        
    return user

@router.post("/admin/users", response_model=List[schemas.User])
def get_all_users(
    auth_data: schemas.TelegramAuth, 
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """
    Отримати список всіх користувачів.
    """
    users = db.query(models.User).order_by(models.User.id.desc()).all()
    return users

@router.post("/admin/users/{user_id}/deactivate")
def deactivate_user(
    user_id: int, 
    auth_data: schemas.TelegramAuth,
    admin: models.User = Depends(get_current_admin), 
    db: Session = Depends(database.get_db)
):
    """
    Деактивувати користувача (встановлює is_activated = False).
    """
    target_user = db.query(models.User).filter(models.User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
        
    # Знайти запис активації
    activation = db.query(models.ActivationCode).filter(models.ActivationCode.used_by_id == target_user.telegram_id).first()
    
    if activation:
        # Відв'язуємо код від користувача
        activation.used_by_id = None
        activation.is_used = False 
        db.commit()
    
    return {"message": f"Користувача {target_user.username} деактивовано"}

@router.post("/admin/codes", response_model=List[str])
def get_free_codes(
    auth_data: schemas.TelegramAuth,
    admin: models.User = Depends(get_current_admin),
    db: Session = Depends(database.get_db)
):
    """
    Отримати список вільних кодів активації.
    """
    codes = db.query(models.ActivationCode).filter(models.ActivationCode.is_used == False).limit(50).all()
    return [c.code for c in codes]
