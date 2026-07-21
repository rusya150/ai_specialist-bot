FROM python:3.12-slim

WORKDIR /app

# Встановлюємо необхідні системні бібліотеки для компіляції (якщо потрібно для psycopg2)
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Копіюємо файл із залежностями
COPY backend/requirements.txt .

# Встановлюємо залежності
RUN pip install --no-cache-dir -r requirements.txt

# Копіюємо весь код проекту
COPY . .

# Hugging Face Spaces вимагає, щоб додаток працював на порту 7860
ENV PORT=7860
EXPOSE 7860

# Запускаємо сервер
CMD ["uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "7860"]
