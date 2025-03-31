// src/api/userApi.js
import axiosInstance from "./axiosInstance";

export const createUser = async (userData) => {
  try {
    const response = await axiosInstance.post("/users", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
