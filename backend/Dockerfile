FROM python:3.11-slim

WORKDIR /app

# Copiamos todo el backend
COPY . /app/backend

RUN pip install --no-cache-dir -r /app/backend/requirements.txt

# Puerto FastAPI
EXPOSE 8000

# Comando para correr la API
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]