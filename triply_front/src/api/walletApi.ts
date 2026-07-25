// src/api/walletApi.js
import axiosInstance from "./axiosInstance";

// 지갑 조회 (잔액)
export const getWallet = () => axiosInstance.get("/wallet");
// 계좌인증
export const verifyAccount = () => axiosInstance.get("/wallet/verify-account");
// 지갑 생성
export const createWallet = () => axiosInstance.post("/wallet/create-wallet");
// 충전 (계좌인증)
export const chargeWallet = (data) =>
  axiosInstance.post("/wallet/charge", data);
// 송금 (정산/직접송금)
export const transferWallet = (data) =>
  axiosInstance.post("/wallet/transfer", data);
// 지갑 최근 내역
export const getWalletHistory = () => axiosInstance.get("/wallet/history");
