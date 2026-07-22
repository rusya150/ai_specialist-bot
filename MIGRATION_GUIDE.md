# Міграція AI Specialist на безкоштовний хостинг

Заміна Render.com. Стек: **Hugging Face Spaces** (бекенд) + **Neon** (база) + **Vercel** (фронтенд) + **cron-job.org** (keep-warm).

---

## Чому саме так

Безкоштовного контейнерного хостингу, який ніколи не спить, у 2026 фактично немає:

| Сервіс | Засинання |
|---|---|
| Render free | 15 хв простою |
| Koyeb free | так, засинає |
| Fly.io | auto-stop машин + картка |
| Railway | безкоштовного тарифу немає |
| **HF Spaces (CPU basic)** | **48 год простою** |

Тому стратегія — хост із найбільшим вікном простою **плюс** зовнішній пінгер. Якщо cron
смикає `/health` кожні 30 хв, лічильник простою ніколи не досягає 48 год і Space не засинає.

---

## Крок 0. Прибрати витік ключів (робити ПЕРШИМ)

У git-історії Space лежить `backend/.env` із живими ключами (Telegram / Groq / Gemini),
плюс `ai_specialist.db`. Зараз Space приватний, тож назовні вони не витекли, але
Telegram Mini App вимагає **публічного** Space — у момент публікації ключі стануть доступні.

1. Видалити Space `Nick12311/ai-specialist-bot` цілком і створити наново.
   Це просто ціль деплою — історія комітів там не потрібна, а `git filter-repo` тут зайвий.
2. Ротувати HF write-токен: https://huggingface.co/settings/tokens
   (старий був вшитий у URL remote відкритим текстом).
3. Ключі більше ніколи не класти у файл — лише через Secrets (крок 2).

Публічний GitHub-репозиторій перевірено — `.env` і `*.db` у його історію не потрапляли.

---

## Крок 1. База даних (Neon)

1. Реєстрація на https://neon.tech, створити проект.
2. Скопіювати **Connection String**:
   `postgresql://user:pass@ep-xxx.eu-central-1.aws.neon.tech/neondb?sslmode=require`

Neon обов'язковий: диск HF Spaces **ефемерний**. На SQLite усі користувачі та коди
активації зникатимуть при кожному рестарті контейнера.

---

## Крок 2. Бекенд (Hugging Face Spaces)

Створити новий Space: **SDK = Docker**, **Hardware = CPU basic (free)**.

> ⚠️ Не обирати ZeroGPU. Це звичайний CRUD API, GPU йому не потрібен, а ZeroGPU
> вимагає, щоб застосунок мав форму Gradio-додатку — саме через це попередній
> деплой обріс фіктивним `@spaces.GPU` і піном `huggingface-hub<0.25`.

Settings → **Variables and secrets**:

| Змінна | Значення |
|---|---|
| `TELEGRAM_BOT_TOKEN` | токен бота (**обов'язково**, без нього застосунок не стартує) |
| `DATABASE_URL` | connection string з Neon |
| `CORS_ORIGINS` | `https://<фронт>.vercel.app,https://t.me` |
| `GROQ_API_KEY` | опційно (чат-ендпоінт не підключений) |
| `GEMINI_API_KEY` | опційно |

Пуш:

```bash
git remote set-url hf https://huggingface.co/spaces/<user>/<space>
git push hf hf_deploy:main
```

Токен вводити в промпті при запиті, **не** вшивати в URL.

Таблиці створяться і наповняться автоматично при першому старті.

---

## Крок 3. Фронтенд (Vercel)

1. https://vercel.com → Add New → Project → імпорт GitHub-репозиторію.
2. Root Directory: `frontend`.
3. Environment Variable: `VITE_API_URL` = `https://<user>-<space>.hf.space` (без слеша в кінці).
4. Deploy, потім дописати отриманий домен у `CORS_ORIGINS` на HF.

Статика на CDN не засинає взагалі.

---

## Крок 4. Keep-warm

https://cron-job.org (безкоштовно) → новий job:

* URL: `https://<user>-<space>.hf.space/health`
* Інтервал: кожні 30 хвилин

Ендпоінт `/health` уже реалізований у `backend/app/main.py`.

---

## Що вже виправлено в коді

* `Dockerfile` — був зламаний: `uvicorn backend.app.main:app` давав циклічний імпорт
  через кореневий `app.py`. Тепер `PYTHONPATH=/app/backend` і `uvicorn app.main:app`.
* `app.py` — видалено (лишок Gradio-SDK, саме він і спричиняв конфлікт імен).
* `README.md` — frontmatter переведено з `sdk: gradio` на `sdk: docker` + `app_port: 7860`.
* `config.py` — `GROQ_API_KEY` / `GEMINI_API_KEY` більше не обов'язкові.
  `TELEGRAM_BOT_TOKEN` лишається обов'язковим навмисно: порожній токен зробив би
  HMAC-перевірку `initData` обчислюваною будь-ким, тобто обхід авторизації.
* `.dockerignore` — доданий, щоб у build-контекст не лізли `node_modules`, `.env`, `*.db`.
* `.gitignore` — додано `hf_clean/` (каталог зі старою скомпрометованою git-історією).
