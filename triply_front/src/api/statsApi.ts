// src/api/statsApi.js
import axiosInstance from "./axiosInstance";

// 가계부 및 통계: db 설계가 아직 확정 전이라고 하셨으니, 우선 형태만 잡아둡니다
export const getLedgerSummary = (groupId) =>
  axiosInstance.get("/stats/ledger", { params: { groupId } });