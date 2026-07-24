import axiosInstance from "./axiosInstance";

// 지갑 조회 (잔액)
export const getNotiCount = () => axiosInstance.get("/notification/count");
