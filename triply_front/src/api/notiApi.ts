import axiosInstance from "./axiosInstance";

// 알림 개수 조회
export const getNotiCount = () => axiosInstance.get("/notification/count");
// 알림 목록 조회
export const getNotiList = () => axiosInstance.get("/notification/list");
