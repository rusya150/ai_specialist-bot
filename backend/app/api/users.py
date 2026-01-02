from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from app.core import database, security
from app.models import models
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

@router.post("/users/profile")
def get_profile(initData: str = Body(..., embed=True), db: Session = Depends(database.get_db)):
    """
    Отримує статистику профілю (спрощена версія).
    """
    user_data = security.validate_init_data(initData)
    if not user_data:
        raise HTTPException(status_code=401, detail="Невірні дані Telegram")

    telegram_id = user_data.get("id")
    user = db.query(models.User).filter(models.User.telegram_id == telegram_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Користувача не знайдено")
        
    return {
        "first_name": user.first_name,
        "role": "Студент курсу",
        "registration_date": "На курсі з: січня 2026" # Hardcoded as requested or could format user.created_at
    }
