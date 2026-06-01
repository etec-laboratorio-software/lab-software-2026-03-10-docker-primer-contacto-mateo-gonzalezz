from sqlalchemy import Column, Integer, String, Float, ForeignKey, Enum
from sqlalchemy.orm import relationship
from .database import Base
import enum

class TipoMovimiento(enum.Enum):
    entrada = "entrada"
    salida = "salida"

class Proveedor(Base):
    __tablename__ = "proveedores"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, unique=True, index=True)

    productos = relationship("Producto", back_populates="proveedor")


class Producto(Base):
    __tablename__ = "productos"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String, unique=True, index=True)
    nombre = Column(String, index=True)
    descripcion = Column(String, nullable=True)
    precio_compra = Column(Float)
    precio_venta = Column(Float)
    stock_actual = Column(Integer, default=0)
    proveedor_id = Column(Integer, ForeignKey("proveedores.id"), nullable=True)

    proveedor = relationship("Proveedor", back_populates="productos")
    movimientos = relationship("MovimientoDeStock", back_populates="producto")


class MovimientoDeStock(Base):
    __tablename__ = "movimientos"

    id = Column(Integer, primary_key=True, index=True)
    producto_id = Column(Integer, ForeignKey("productos.id"))
    tipo = Column(Enum(TipoMovimiento))
    cantidad = Column(Integer)

    producto = relationship("Producto", back_populates="movimientos")


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)