import axiosInstance from "./axiosInstance";

// 지갑 조회 (잔액)
export const paymentCreate = () =>
  axiosInstance.post("/payment/create-payment");
