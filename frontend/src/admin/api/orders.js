import axios from "axios";

const BASE_URL = "https://seven-star-tile-vanity.onrender.com/api";

const getToken = () => sessionStorage.getItem("adminToken");
const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const getOrders = async () => {
  const response = await axios.get(`${BASE_URL}/orders`, authHeaders());
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await axios.get(`${BASE_URL}/orders/${id}`, authHeaders());
  return response.data;
};

export const updateOrder = async (id, orderData) => {
  const response = await axios.put(
    `${BASE_URL}/orders/${id}`,
    orderData,
    authHeaders(),
  );
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await axios.delete(
    `${BASE_URL}/orders/${id}`,
    authHeaders(),
  );
  return response.data;
};
