# backend/main.py
from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

# Importar los módulos locales
# 🔹 Importamos 'auth' y los nuevos routers
from . import models, database, schemas, auth 
from .routers import products, auth as auth_router

# 🔹 Crear las tablas (AHORA INCLUYE 'users')
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(redirect_slashes=False)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =Criterio 3: Proteger rutas =========================
# 🔹 Incluimos los routers
app.include_router(products.router)
app.include_router(auth_router.router) # Router de Login/Registro

@app.get("/")
def root():
    return {"message": "API de Gestión de Stock"}

# ==================================
# 🔹 Protegemos la ruta de Movimientos
# ==================================
@app.post("/api/stock/movements")
def create_movement(
    movimiento: schemas.MovimientoCreate, 
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user) # Protegido
):
    producto = db.query(models.Producto).filter(models.Producto.id == movimiento.producto_id).first()
    if not producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")

    if movimiento.tipo not in ["entrada", "salida"]:
        raise HTTPException(status_code=400, detail="Tipo debe ser 'entrada' o 'salida'")

    if movimiento.tipo == "salida" and movimiento.cantidad > producto.stock_actual:
        raise HTTPException(status_code=400, detail="Stock insuficiente")

    if movimiento.tipo == "entrada":
        producto.stock_actual += movimiento.cantidad
    else:
        producto.stock_actual -= movimiento.cantidad

    tipo_enum = models.TipoMovimiento.entrada if movimiento.tipo == "entrada" else models.TipoMovimiento.salida
    nuevo_movimiento = models.MovimientoDeStock(
        producto_id=producto.id,
        cantidad=movimiento.cantidad,
        tipo=tipo_enum
    )

    try:
        db.add(nuevo_movimiento)
        db.commit()
        db.refresh(nuevo_movimiento)
        db.refresh(producto)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error al registrar movimiento: {str(e)}")

    return {"producto": producto, "movimiento": nuevo_movimiento}