// src/api/settlementApi.js
import axiosInstance from "./axiosInstance";

// 결제 등록 (대시보드 "결제 등록하기")
export const createPayment = (data) =>
  axiosInstance.post("/settlement/payment", data);
// 결제 목록 조회 (대시보드 "결제 내역")
export const getPayments = (groupId) =>
  axiosInstance.get("/settlement/payment", { params: { groupId } });
// 정산내역 청구
export const requestSettlement = (data) =>
  axiosInstance.post("/settlement/request", data);
// 정산 요약 조회 (대시보드 "정산 요약" 카드 - 정산완료/미정산/정산률)
export const getSettlementSummary = (groupId) =>
  axiosInstance.get("/settlement/summary", { params: { groupId } });
// 정산 가능 여부 확인 (결제 완료 후, 정산하기 버튼 클릭 시)
export const checkSettlement = (paymentId: number) =>
  axiosInstance.get(`/settlement/check/${paymentId}`);
// 정산 완료 처리 (정산하기 버튼 클릭 시)
export const completeSettlement = (settlementId: number) =>
  axiosInstance.patch(`/settlement/${settlementId}/complete`);
