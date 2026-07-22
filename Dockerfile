FROM python:3.12-slim

WORKDIR /app

# libpq потрібен для psycopg2 (підключення до Neon Postgres)
RUN apt-get update && apt-get install -y --no-install-recommends gcc libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо лише бекенд: фронтенд деплоїться окремо (Vercel/Cloudflare Pages)
COPY backend/ ./backend/

# Модулі імпортуються як "app.core...", а не "backend.app.core...",
# тому саме backend/ має бути коренем пакетів.
ENV PYTHONPATH=/app/backend
WORKDIR /app/backend

ENV PORT=7860
EXPOSE 7860

CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-7860}"]
