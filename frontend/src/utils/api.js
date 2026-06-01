// src/utils/api.js
const API_BASE_URL = 'http://192.168.46.11:8000';

// Función helper para hacer peticiones autenticadas
export const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  // Añadir token si existe
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  // Si el token expiró, redirigir al login
  if (response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('Sesión expirada');
  }
  
  return response;
};

// Ejemplos de uso:
export const getProducts = async () => {
  const response = await fetchWithAuth('/api/products');
  return response.json();
};

export const createProduct = async (productData) => {
  const response = await fetchWithAuth('/api/products', {
    method: 'POST',
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const updateProduct = async (id, productData) => {
  const response = await fetchWithAuth(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(productData),
  });
  return response.json();
};

export const deleteProduct = async (id) => {
  const response = await fetchWithAuth(`/api/products/${id}`, {
    method: 'DELETE',
  });
  return response.json();
};