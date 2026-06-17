const BASE_URL = "http://localhost:5000/api/contact";

export const getMessages = async () => {
  const res = await fetch(BASE_URL);
  const data = await res.json();
  return data.data;
};

export const markMessageAsRead = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/read`, { method: "PUT" });
  const data = await res.json();
  return data.data;
};

export const deleteMessage = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const data = await res.json();
  return data;
};
