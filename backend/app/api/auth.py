from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.core import database, security
from app.models import models
from app.schemas import schemas

router = APIRouter()

@router.post("/auth/telegram", response_model=schemas.User)
def telegram_login(auth_data: schemas.TelegramAuth, db: Session = Depends(database.get_db)):
    """
    Валідація initData Telegram та вхід/реєстрація користувача.
    """
    user_data = security.validate_init_data(auth_data.initData)
    
    if not user_data:
        raise HTTPException(status_code=401, detail="Невірні дані Telegram")
    
    telegram_id = user_data.get("id")
    if not telegram_id:
         raise HTTPException(status_code=400, detail="Неповні дані користувача")

    # Перевірка наявності користувача
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    
    if not user:
        # Створення нового користувача
        user = models.User(
            telegram_id=telegram_id,
            username=user_data.get("username"),
            first_name=user_data.get("first_name")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    
    # Перевірка статусу активації в таблиці кодів
    # Шукаємо код, використаний цим користувачем
    activation = db.query(models.ActivationCode).filter(models.ActivationCode.used_by_id == user.telegram_id).first()
    
    is_activated_in_db = True if activation else False
    
    # Оновлення статусу в моделі User, якщо він відрізняється
    if user.is_activated != is_activated_in_db:
        user.is_activated = is_activated_in_db
        db.add(user)
        db.commit()
        db.refresh(user)
    
    return user

@router.post("/auth/activate", response_model=schemas.ActivationResponse)
def activate_account(activation_data: schemas.ActivationRequest, db: Session = Depends(database.get_db)):
    """
    Активація акаунту користувача за допомогою коду.
    """
    user_data = security.validate_init_data(activation_data.initData)
    if not user_data:
        raise HTTPException(status_code=401, detail="Невірні дані Telegram")
    
    telegram_id = user_data.get("id")
    
    # Знаходимо користувача
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    if not user:
         return schemas.ActivationResponse(success=False, message="Користувача не знайдено, спробуйте перезайти")

    # Перевірка, чи вже активовано
    existing = db.query(models.ActivationCode).filter(models.ActivationCode.used_by_id == telegram_id).first()
    if existing:
         return schemas.ActivationResponse(success=True, message="Акаунт вже активовано")
    
    # Перевірка коду
    code_record = db.query(models.ActivationCode).filter(models.ActivationCode.code == activation_data.code).first()
    if not code_record:
        return schemas.ActivationResponse(success=False, message="Невірний код активації")
        
    if code_record.is_used:
        return schemas.ActivationResponse(success=False, message="Цей код вже використано іншим користувачем")
    
    # Активація
    try:
        code_record.is_used = True
        code_record.used_by_id = telegram_id
        
        # Оновлюємо статус самого юзера
        user.is_activated = True
        
        db.add(code_record)
        db.add(user)
        db.commit()
        
        return schemas.ActivationResponse(success=True, message="Успішна активація! Ласкаво просимо.")
    except Exception as e:
        db.rollback()
        return schemas.ActivationResponse(success=False, message="Помилка при збереженні даних")
