const API = "https://seven-star-tile-vanity.onrender.com/api/reviews";

export const getReviews = async (status) => {
  const token = sessionStorage.getItem("adminToken");
  const url = status ? `${API}/admin/all?status=${status}` : `${API}/admin/all`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
};
