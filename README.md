---
title: Ai Specialist Bot
emoji: 😻
colorFrom: red
colorTo: green
sdk: docker
app_port: 7860
pinned: false
---
# AI Specialist - Educational Hub (Telegram Mini App)

Цей проект є освітнім хабом для AI спеціалістів, реалізованим як Telegram Mini App.
Включає Backend на **FastAPI** та Frontend на **React** (Cyberpunk стиль).

## ⚠️ Важливо: Вимоги до системи
Для коректної роботи Backend частини **необхідно використовувати Python 3.10, 3.11 або 3.12**.
Версія Python 3.14 наразі **не підтримується** багатьма бібліотеками (Pydantic, SQLAlchemy).

### Як встановити правильний Python (Windows):
1.  Перейдіть на офіційний сайт: [Python 3.12.1 Downloads](https://www.python.org/downloads/release/python-3121/)
2.  Завантажте **Windows installer (64-bit)**.
3.  Запустіть інсталятор.
4.  **ОБОВ'ЯЗКОВО** поставте галочку **"Add Python to PATH"** внизу першого вікна.
5.  Натисніть "Install Now".

---

## 🚀 Інструкція із запуску

### 1. Налаштування Backend (Сервер)
Відкрийте термінал (CMD або PowerShell) у папці проекту:

```bash
cd "d:\програми antigravity\ai specialist"
```

Встановіть залежності (використовуючи Python Launcher для вибору версії 3.12):
```bash
# Перевірка версії
py -3.12 --version 

# Встановлення бібліотек
py -3.12 -m pip install -r backend/requirements.txt
```

Запустіть сервер:
```bash
py -3.12 -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --reload
```
*Документація API буде доступна за адресою: http://localhost:8000/docs*

### 2. Налаштування Frontend (Інтерфейс)
Відкрийте **новий** термінал у тій самій папці:

```bash
cd frontend
npm run dev
```
*Інтерфейс відкриється за адресою: http://localhost:5173 (або 5174)*

---

## 📱 Інтеграція з Telegram (BotFather)
Щоб це працювало як Mini App:
1.  Створіть бота через [@BotFather](https://t.me/BotFather).
2.  Отримайте токен бота.
3.  Використайте команду `/newapp` у BotFather.
4.  Коли він запитає URL, вкажіть вашу публічну HTTPS адресу (для локальної розробки потрібен тунель, наприклад **ngrok**).
    *   Приклад з ngrok: `ngrok http 5173` -> скопіюйте HTTPS посилання.

## 📂 Структура проекту
*   `backend/` - Серверна частина (FastAPI, SQLite, Models)
*   `frontend/` - Клієнтська частина (React, Tailwind, Telegram SDK)
