import axios from "axios";

const BASE_URL = "https://seven-star-tile-vanity.onrender.com/api";

const getToken = () => sessionStorage.getItem("adminToken");
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getProducts = async () => {
  const response = await axios.get(`${BASE_URL}/products`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${BASE_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(
    `${BASE_URL}/products`,
    productData,
    authHeaders(),
  );
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(
    `${BASE_URL}/products/${id}`,
    productData,
    authHeaders(),
  );
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/products/${id}`,
    authHeaders(),
  );
  return response.data;
};
