import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Sare orders lao
export const getOrders = async () => {
  const response = await axios.get(`${BASE_URL}/orders`);
  return response.data;
};

// Single order lao
export const getOrderById = async (id) => {
  const response = await axios.get(`${BASE_URL}/orders/${id}`);
  return response.data;
};

// Order update karo (status change)
export const updateOrder = async (id, orderData) => {
  const response = await axios.put(`${BASE_URL}/orders/${id}`, orderData);
  return response.data;
};

// Order delete karo
export const deleteOrder = async (id) => {
  const response = await axios.delete(`${BASE_URL}/orders/${id}`);
  return response.data;
};
