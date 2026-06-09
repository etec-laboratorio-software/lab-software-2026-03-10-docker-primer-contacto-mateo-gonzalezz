FROM python:3.11-slim

WORKDIR /app

# Copiar dependencias primero (mejor cache de Docker)
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código del backend
COPY . ./backend/

# Puerto FastAPI
EXPOSE 8000

# Correr como módulo de paquete (necesario para los imports relativos con ".")
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]