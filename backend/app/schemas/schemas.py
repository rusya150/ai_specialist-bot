from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# --- User Schemas ---
class UserBase(BaseModel):
    telegram_id: int
    username: Optional[str] = None
    first_name: Optional[str] = None

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: int
    created_at: datetime
    is_activated: bool = False

    class Config:
        orm_mode = True

# --- Category Schemas ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        orm_mode = True

# --- Item (Guide/Prompt/Service) Schemas ---
class ItemBase(BaseModel):
    title: str
    content: str
    metadata_info: Optional[str] = None # JSON string
    category_id: int

class ItemCreate(ItemBase):
    pass

class Item(ItemBase):
    id: int
    created_at: datetime

    class Config:
        orm_mode = True

# --- Bookmark Schemas ---
class BookmarkBase(BaseModel):
    item_id: int

class BookmarkCreate(BookmarkBase):
    pass

class Bookmark(BookmarkBase):
    id: int
    user_id: int
    created_at: datetime
    item: Optional[Item] = None

    class Config:
        orm_mode = True

# --- Auth Schema ---
class TelegramAuth(BaseModel):
    initData: str

class ActivationRequest(BaseModel):
    code: str
    initData: str

class ActivationResponse(BaseModel):
    success: bool
    message: str
