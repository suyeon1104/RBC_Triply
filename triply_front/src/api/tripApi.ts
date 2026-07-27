// src/api/travelApi.js
import axiosInstance from "./axiosInstance";

// 여행 추가 ("플래너 만들기" 버튼)
export const createTrip = (data: {
  tripTitle: string;
  tripPlace: string;
  startDate: string;
  endDate: string;
  groupId: number;
}) => axiosInstance.post("trip/createTrip", data);

// 여행목록 조회 ("플래너" 탭 렌더링)
export const getTripList = () => axiosInstance.get(`trip/getTripList`);

// 여행 수정
export const patchTrip = (data: {
  tripId: number;
  tripTitle: string;
  tripPlace: string;
  startDate: string;
  endDate: string;
}) => axiosInstance.put(`trip/patchTrip`, data);

// 여행 삭제
export const deleteTrip = (data: { tripId: number }) =>
  axiosInstance.delete(`/trip/deleteTrip`, { data });

// 여행에 그룹 추가(연결)
export const patchTripGroup = (data: { tripId: number; groupId: number }) =>
  axiosInstance.put(`trip/patchTripGroup`, data);

// 일정 생성
export const createSchedule = (data: {
  tripId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleTitle: string;
  schedulePlace: string;
  scheduleDetail: string;
  category: string;
}) => axiosInstance.post("trip/createSchedule", data);

// 여행 상세(일정 조회)
export const getTripDetail = (tripId: number) =>
  axiosInstance.get(`/trip/${tripId}`);

// 일정 수정
export const updateSchedule = (data: {
  scheduleId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleTitle: string;
  schedulePlace: string;
  scheduleDetail: string;
  category: string;
}) => axiosInstance.put(`trip/updateSchedule`, data);

// 일정 삭제
export const deleteSchedule = (data: { scheduleId: number }) =>
  axiosInstance.delete(`/trip/deleteSchedule`, { data });