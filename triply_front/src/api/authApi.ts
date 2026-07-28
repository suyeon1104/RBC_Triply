// src/api/authApi.js
import axiosInstance from "./axiosInstance";

export const join = (data) => axiosInstance.post("/auth/join", data);
export const login = (data) => axiosInstance.post("/auth/login", data);
export const getProfile = () => axiosInstance.get("/user/getProfile");
export const patchProfile = (data: { userName: string; userPhone: string }) =>
  axiosInstance.patch("/user/patchProfile", data);
export const patchPw = (data: { userPw: string; newUserPw: string }) =>
  axiosInstance.patch("/user/patchPw", data);
export const idCheck = (loginId: string) =>
  axiosInstance.post("user/auth/idCheck", { loginId });
export const phoneCheck = () => axiosInstance.get("/user/auth/phoneCheck");
export const logout = () => {
  localStorage.removeItem("accessToken");
};
