// frontend/src/components/StockMovementForm.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // 🔹 Importamos el auth

const MOVEMENT_API_URL = "/api/stock/movements";

export default function StockMovementForm({ products, onMovementSubmit }) {
  const [searchTerm, setSearchTerm] = useState("");
  // ... (otros useStates)
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [tipo, setTipo] = useState("entrada");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { token } = useAuth(); // 🔹 Obtenemos el token

  const handleSearch = (e) => {
    // ... (lógica de búsqueda existente, no cambia)
    e.preventDefault();
    setError("");
    if (!searchTerm) {
      setSelectedProduct(null);
      return;
    }
    const found = products.find(
      (p) =>
        p.sku.toLowerCase() === searchTerm.toLowerCase() ||
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (found) {
      setSelectedProduct(found);
    } else {
      setError("Producto no encontrado.");
      setSelectedProduct(null);
    }
  };

  const handleSubmitMovement = async (e) => {
    e.preventDefault();
    if (!selectedProduct) return;

    setSubmitting(true);
    setError("");

    try {
      // Criterio 5: Enviar token
      const res = await fetch(MOVEMENT_API_URL, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          producto_id: selectedProduct.id,
          cantidad: parseInt(cantidad),
          tipo: tipo,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Error al registrar movimiento");
      }

      onMovementSubmit(); // Llama a fetchProducts en DashboardPage
      
      // Limpiar formulario
      setSelectedProduct(null);
      setSearchTerm("");
      setCantidad(1);
      setTipo("entrada");

    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: "10px", border: "1px solid #444", borderRadius: "8px", marginBottom: "20px" }}>
      {/* ... (todo el JSX/render existente) ... */}
      <h3>Registrar Movimiento de Stock</h3>
      <form onSubmit={handleSearch} style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Buscar por Nombre o SKU"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {selectedProduct && (
        <form
          onSubmit={handleSubmitMovement}
          style={{ borderTop: "1px dashed #555", paddingTop: "10px" }}
        >
          <h4>
            Producto: {selectedProduct.nombre} (Stock actual:{" "}
            {selectedProduct.stock_actual})
          </h4>
          <input
            type="number"
            value={cantidad}
            onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value)))}
            min="1"
          />
          <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
            <option value="entrada">Entrada</option>
            <option value="salida">Salida</option>
          </select>
          <button type="submit" disabled={submitting}>
            {submitting ? "Registrando..." : "Registrar Movimiento"}
          </button>
        </form>
      )}
    </div>
  );
}