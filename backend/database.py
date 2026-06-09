from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os

# En Docker, la DB se guarda en /app/data/ (volumen persistente)
# Fuera de Docker (desarrollo local), se guarda en ./products.db
DB_PATH = os.environ.get("DATABASE_URL", "sqlite:///./products.db")

engine = create_engine(
    DB_PATH, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()