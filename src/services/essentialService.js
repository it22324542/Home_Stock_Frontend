import axios from "axios";

const API_URL = "http://localhost:5000/api/essentials"; // Adjust if needed

export const getEssentials = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const addEssential = async (essential) => {
  const response = await axios.post(API_URL, essential);
  return response.data;
};
