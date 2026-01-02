import uvicorn

if __name__ == "__main__":
    # Запуск сервера
    # host="127.0.0.1" - доступ тільки з локальної машини
    # port=8000 - стандартний порт для FastAPI
    # reload=True - автоматичне перезавантаження при зміні коду
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
