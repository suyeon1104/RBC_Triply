// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const join = (data) => axiosInstance.post("/auth/join", data);
export const login = (data) => axiosInstance.post("/auth/login", data);
export const getProfile = () => axiosInstance.get("/getProfile");
export const patchProfile = (data) => axiosInstance.patch("/patchProfile", data);
export const idCheck = (loginId) => axiosInstance.post("user/auth/idCheck", { loginId });
export const phoneCheck = () => axiosInstance.get("/user/auth/phoneCheck");
export const logout = () => {
  localStorage.removeItem("accessToken");
};
