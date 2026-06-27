import axios from "axios";

const BASE_URL = "https://seven-star-tile-vanity.onrender.com/api";

export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
};
