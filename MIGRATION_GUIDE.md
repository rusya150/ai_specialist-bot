# Міграція AI Specialist на безкоштовний хостинг

Заміна Render.com. Стек: **Koyeb** (бекенд) + **Neon** (база) + **Vercel** (фронтенд) + **cron-job.org** (keep-warm).

---

## Чому Koyeb

Безкоштовного контейнерного хостингу, який взагалі не засинає, у 2026 практично немає.
Різниця в тому, наскільки боляче це відчувається:

| Платформа | Простій до сну | Пробудження | Картка |
|---|---|---|---|
| Render free | 15 хв | 30–50 с | ні |
| **Koyeb free (Hobby)** | **1 год** | **200 мс** (light) / 1–5 с (deep) | **ні** |
| Google Cloud Run | scale-to-zero | ~1–3 с | **так** |
| Fly.io | auto-stop | ~1 с | **так** |
| HF Spaces | — | — | **Docker SDK платний** |

Koyeb дає годину простою замість 15 хвилин, а прокидається за 200 мс замість 50 секунд.
Плюс зовнішній пінгер кожні 30 хв — і сервіс не засинає взагалі.

**Hugging Face відпав:** з 2025 HF вимагає платний план для Spaces, що виконують код
(Gradio або Docker). Безкоштовними лишились тільки Static Spaces. ZeroGPU працює лише
з Gradio SDK і дає 5 хвилин GPU на добу — для постійного API не підходить.

**Ліміти free-інстансу Koyeb:** 512 MB RAM, 0.1 vCPU, 2 GB SSD, один web service,
регіони Frankfurt або Washington D.C., деплой лише з git. Томів немає — тому база
обов'язково зовнішня.

---

## Крок 0. Прибрати витік ключів (робити ПЕРШИМ)

У git-історії Space `Nick12311/ai-specialist-bot` лежить `backend/.env` із живими
ключами (Telegram / Groq / Gemini) і `ai_specialist.db`. Space приватний, тож назовні
вони не витекли, а в публічну GitHub-історію не потрапляли ніколи.

Оскільки HF більше не використовується — просто **видалити цей Space** і
**ротувати HF-токен** (https://huggingface.co/settings/tokens): старий був вшитий
у URL remote відкритим текстом.

Локальний каталог `hf_clean/` більше не потрібен, він уже в `.gitignore`.

---

## Крок 1. База даних (Neon)

1. https://neon.tech → зареєструватись, створити проект.
2. Скопіювати **Connection String**:
   `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`

Neon обов'язковий: на free-інстансі Koyeb немає томів, диск ефемерний. На SQLite усі
користувачі й коди активації зникатимуть при кожному рестарті.

Регіон Neon бажано брати європейський — тоді він поруч із Frankfurt.

---

## Крок 2. Бекенд (Koyeb)

1. https://www.koyeb.com → Sign up через GitHub (картка не потрібна).
2. Create Web Service → GitHub → репозиторій `ai_specialist-bot`, гілка `hf_deploy`.
3. Builder: **Dockerfile** (визначиться автоматично, файл у корені).
4. Instance: **Free**. Region: **Frankfurt**.
5. Port: **8000** (`Dockerfile` слухає `$PORT`, Koyeb підставляє 8000).
6. Health check path: `/health`.

Environment variables:

| Змінна | Значення |
|---|---|
| `TELEGRAM_BOT_TOKEN` | токен бота (**обов'язково**, без нього застосунок не стартує) |
| `DATABASE_URL` | connection string з Neon |
| `CORS_ORIGINS` | `https://<фронт>.vercel.app,https://t.me` |
| `GROQ_API_KEY` | опційно (чат-ендпоінт не підключений) |
| `GEMINI_API_KEY` | опційно |

Таблиці створяться і наповняться автоматично при першому старті.

---

## Крок 3. Фронтенд (Vercel)

1. https://vercel.com → Add New → Project → імпорт репозиторію.
2. Root Directory: `frontend`.
3. Environment Variable: `VITE_API_URL` = `https://<app>-<org>.koyeb.app` (без слеша в кінці).
4. Deploy, потім дописати отриманий домен у `CORS_ORIGINS` на Koyeb і передеплоїти бекенд.

Статика на CDN не засинає взагалі.

---

## Крок 4. Keep-warm

https://cron-job.org (безкоштовно) → новий job:

* URL: `https://<app>-<org>.koyeb.app/health`
* Інтервал: кожні 30 хвилин

Вікно простою в Koyeb — 1 година, тож пінг раз на 30 хв тримає сервіс живим постійно.
Ендпоінт `/health` реалізований у `backend/app/main.py`.

---

## Крок 5. Telegram

BotFather → `/newapp` → URL вказати домен з Vercel (не Koyeb — це адреса інтерфейсу).

---

## Що вже виправлено в коді

* `Dockerfile` — був зламаний: `uvicorn backend.app.main:app` давав циклічний імпорт
  через кореневий `app.py`. Тепер `PYTHONPATH=/app/backend` + `uvicorn app.main:app`,
  порт береться з `$PORT` (працює на Koyeb, Cloud Run, Fly без змін).
* `app.py` — видалено (лишок Gradio-SDK, він і спричиняв конфлікт імен).
* `README.md` — прибрано HF-frontmatter.
* `config.py` — `GROQ_API_KEY` / `GEMINI_API_KEY` більше не обов'язкові.
  `TELEGRAM_BOT_TOKEN` лишається обов'язковим навмисно: порожній токен зробив би
  HMAC-перевірку `initData` обчислюваною будь-ким, тобто обхід авторизації.
* `.dockerignore` — доданий, щоб у build-контекст не лізли `node_modules`, `.env`, `*.db`.
* `.gitignore` — додано `hf_clean/`.

---

## Якщо Koyeb не підійде

* **Google Cloud Run** — 2 млн запитів/міс, холодний старт ~1–3 с, але потрібна картка.
  Той самий `Dockerfile` заводиться без змін (Cloud Run підставляє `PORT=8080`).
* **Fly.io** — швидке пробудження, теж потрібна картка.
* **Oracle Cloud Always Free** — ARM VM 4 vCPU / 24 GB, ніколи не спить, але це вже
  адміністрування VM (nginx, systemd, SSL) і картка для верифікації.
