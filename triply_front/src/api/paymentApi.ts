import axiosInstance from "./axiosInstance";

// 결제 생성
export const paymentCreate = () =>
  axiosInstance.post("/payment/create-payment");
// 결제 조회
export const paymentGet = (paymentId: number) =>
  axiosInstance.get(`/payment/${paymentId}`);
