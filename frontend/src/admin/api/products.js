import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Sare products lao
export const getProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
};

// Naya product banao
export const createProduct = async (productData) => {
  const response = await axios.post(`${BASE_URL}/products`, productData);
  return response.data;
};

// Product update karo
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${BASE_URL}/products/${id}`, productData);
  return response.data;
};

// Product delete karo
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${BASE_URL}/products/${id}`);
  return response.data;
};
