// frontend/src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext"; // 🔹 Importamos el auth

export default function ProductForm({ product, onSubmit }) {
  const [nombre, setNombre] = useState("");
  // ... (otros useStates)
  const [sku, setSku] = useState("");
  const [precioCompra, setPrecioCompra] = useState("");
  const [precioVenta, setPrecioVenta] = useState("");
  const [stockActual, setStockActual] = useState("");

  const { token } = useAuth(); // 🔹 Obtenemos el token

  useEffect(() => {
    if (product) {
      setNombre(product.nombre);
      setSku(product.sku);
      setPrecioCompra(product.precio_compra);
      setPrecioVenta(product.precio_venta);
      setStockActual(product.stock_actual);
    } else {
      // Limpiar formulario si 'product' es null (ej. después de editar)
      setNombre("");
      setSku("");
      setPrecioCompra("");
      setPrecioVenta("");
      setStockActual("");
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !sku || !precioCompra || !precioVenta) {
      alert("Todos los campos son obligatorios (excepto stock inicial).");
      return;
    }

    const url = product
      ? `/api/products/${product.id}`
      : "/api/products";
    const method = product ? "PUT" : "POST";

    // Criterio 5: Enviar token
    await fetch(url, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({
        nombre,
        sku,
        precio_compra: parseFloat(precioCompra),
        precio_venta: parseFloat(precioVenta),
        stock_actual: parseInt(stockActual || 0), // Default a 0 si está vacío
      }),
    });

    onSubmit(); // Llama a handleProductFormSubmit en DashboardPage
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
      {/* ... (todos tus inputs) ... */}
      <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input placeholder="SKU" value={sku} onChange={(e) => setSku(e.target.value)} />
      <input placeholder="Precio Compra" type="number" step="0.01" value={precioCompra} onChange={(e) => setPrecioCompra(e.target.value)} />
      <input placeholder="Precio Venta" type="number" step="0.01" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} />
      <input placeholder="Stock Actual (default 0)" type="number" value={stockActual} onChange={(e) => setStockActual(e.target.value)} />
      <button type="submit">{product ? "Actualizar" : "Crear"}</button>
    </form>
  );
}