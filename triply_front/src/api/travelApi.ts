// src/api/travelApi.js
import axiosInstance from "./axiosInstance";

// 여행계획 추가 (대시보드 "일정 추가" 버튼)
export const createTravelPlan = (data) => axiosInstance.post("/travel/plan", data);
// 여행계획 조회 (대시보드 "여행 일정" 카드, 날짜별 필터)
export const getTravelPlans = (groupId) =>
  axiosInstance.get(`/travel/plan`, { params: { groupId } });
// 여행계획 변경
export const updateTravelPlan = (planId, data) =>
  axiosInstance.put(`/travel/plan/${planId}`, data);
// 여행계획 삭제
export const deleteTravelPlan = (planId) => axiosInstance.delete(`/travel/plan/${planId}`);