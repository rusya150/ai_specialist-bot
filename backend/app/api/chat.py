from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.core.ai_service import ai_service
from app.core import security
from app.schemas import schemas

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    initData: str # Дані для валідації Telegram користувача

class ChatResponse(BaseModel):
    reply: str

@router.post("/chat/completions", response_model=ChatResponse)
async def chat_interaction(request: ChatRequest):
    """
    Єдиний endpoint для чату.
    1. Валідує користувача Telegram.
    2. Викликає гібридний AI сервіс (Groq -> Gemini).
    """
    # 1. Валідація користувача
    user_data = security.validate_init_data(request.initData)
    if not user_data:
        raise HTTPException(status_code=401, detail="Невірні дані Telegram")
    
    # 2. Отримання відповіді від AI
    reply_text = await ai_service.get_response(request.message)
    
    return ChatResponse(reply=reply_text)
