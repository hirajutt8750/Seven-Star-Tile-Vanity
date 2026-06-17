import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};
