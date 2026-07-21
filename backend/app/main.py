from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from app.core.database import engine, Base, SessionLocal
from app.api import auth, content, admin, users
from app.models.models import Item
import time
import os
import sys

# Ensure backend directory is in path for imports if needed
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
try:
    from full_database_seed import seed_db
except ImportError:
    # Fallback if running from root
    from backend.full_database_seed import seed_db

# Створення таблиць бази даних
Base.metadata.create_all(bind=engine)

app = FastAPI(title="AI Specialist Hub")

# Middleware для логування часу виконання
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    print(f"Запит {request.method} {request.url.path} виконано за {process_time:.4f} сек")
    return response

# Налаштування CORS
cors_origins_str = os.environ.get("CORS_ORIGINS", "")
if cors_origins_str:
    origins = [origin.strip() for origin in cors_origins_str.split(",") if origin.strip()]
else:
    origins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "https://t.me"
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Підключення роутерів
app.include_router(auth.router, prefix="/api/v1", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/v1", tags=["Admin"])
app.include_router(content.router, prefix="/api/v1", tags=["Content"])
app.include_router(users.router, prefix="/api/v1", tags=["Users"])

@app.get("/")
def read_root():
    return {"message": "AI Specialist API працює"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.on_event("startup")
def startup_event():
    # Check if DB is empty and seed if necessary
    db = SessionLocal()
    try:
        if db.query(Item).count() == 0:
            print("Database is empty. auto-seeding...")
            seed_db()
    except Exception as e:
        print(f"Auto-seed failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=True)
