import axios from "axios";

const API_URL = "http://localhost:5000/api/essentials";

// Get all essentials
export const getEssentials = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Add new essential
export const addEssential = async (essential) => {
  const response = await axios.post(API_URL, essential);
  return response.data;
};

// Delete an essential
export const deleteEssential = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

// Update an essential
export const updateEssential = async (id, updatedData) => {
  const response = await axios.put(`${API_URL}/${id}`, updatedData);
  return response.data;
};
