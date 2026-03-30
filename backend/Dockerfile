FROM python:3.11-slim

WORKDIR /app

# Copiamos dependencias primero
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiamos todo el backend
COPY . .

# Puerto FastAPI
EXPOSE 8000

# Comando para correr la API
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]