// src/api/settlementApi.js
import axiosInstance from "./axiosInstance";

// 결제 등록 (대시보드 "결제 등록하기")
export const createPayment = (data) => axiosInstance.post("/settlement/payment", data);
// 결제 목록 조회 (대시보드 "결제 내역")
export const getPayments = (groupId) =>
  axiosInstance.get("/settlement/payment", { params: { groupId } });
// 정산내역 청구 (개인/그룹 정산은 결제 시, 상세 정산은 목록에서)
export const requestSettlement = (data) => axiosInstance.post("/settlement/request", data);
// 정산 요약 조회 (대시보드 "정산 요약" 카드 - 정산완료/미정산/정산률)
export const getSettlementSummary = (groupId) =>
  axiosInstance.get("/settlement/summary", { params: { groupId } });