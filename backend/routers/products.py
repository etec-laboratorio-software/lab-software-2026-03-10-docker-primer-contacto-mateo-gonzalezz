# backend/routers/products.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas, database, auth

router = APIRouter(prefix="/api/products", tags=["products"])

# ==================================
# GET /api/products (Protegido)
# ==================================
@router.get("", response_model=List[schemas.Producto])
def get_products(
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)  # 🔒 Protegido
):
    productos = db.query(models.Producto).all()
    return productos

# ==================================
# POST /api/products (Protegido)
# ==================================
@router.post("", response_model=schemas.Producto)
def create_product(
    producto: schemas.ProductoCreate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)  # 🔒 Protegido
):
    # Verificar si el SKU ya existe
    db_producto = db.query(models.Producto).filter(models.Producto.sku == producto.sku).first()
    if db_producto:
        raise HTTPException(status_code=400, detail="El SKU ya existe")
    
    new_producto = models.Producto(**producto.dict())
    db.add(new_producto)
    db.commit()
    db.refresh(new_producto)
    
    return new_producto

# ==================================
# PUT /api/products/{id} (Protegido)
# ==================================
@router.put("/{id}", response_model=schemas.Producto)
def update_product(
    id: int,
    producto: schemas.ProductoUpdate,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)  # 🔒 Protegido
):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Actualizar solo los campos proporcionados
    for key, value in producto.dict(exclude_unset=True).items():
        setattr(db_producto, key, value)
    
    db.commit()
    db.refresh(db_producto)
    
    return db_producto

# ==================================
# DELETE /api/products/{id} (Protegido)
# ==================================
@router.delete("/{id}")
def delete_product(
    id: int,
    db: Session = Depends(database.get_db),
    current_user: schemas.User = Depends(auth.get_current_user)  # 🔒 Protegido
):
    db_producto = db.query(models.Producto).filter(models.Producto.id == id).first()
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    db.delete(db_producto)
    db.commit()
    
    return {"message": "Producto eliminado exitosamente"}