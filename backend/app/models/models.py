from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    telegram_id = Column(Integer, unique=True, index=True, nullable=False)
    username = Column(String, nullable=True)
    first_name = Column(String, nullable=True)
    is_activated = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    bookmarks = relationship("Bookmark", back_populates="user")
    activation_code = relationship("ActivationCode", back_populates="user", uselist=False)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True) 
    description = Column(String, nullable=True)
    
    items = relationship("Item", back_populates="category")

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"))
    title = Column(String, index=True)
    content = Column(Text) 
    metadata_info = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    category = relationship("Category", back_populates="items")
    bookmarks = relationship("Bookmark", back_populates="item")

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    item_id = Column(Integer, ForeignKey("items.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="bookmarks")
    item = relationship("Item", back_populates="bookmarks")

class ActivationCode(Base):
    __tablename__ = "activation_codes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True, nullable=False)
    is_used = Column(Boolean, default=False)
    used_by_id = Column(Integer, ForeignKey("users.telegram_id"), nullable=True) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="activation_code")
