// src/api/groupApi.js
import axiosInstance from "./axiosInstance";

// 그룹 생성
export const createGroup = (data) => axiosInstance.post("/group/create", data);
// 그룹 조회 (내 그룹 목록, 대시보드 "그룹" 카드용)
export const getGroups = () => axiosInstance.get("/group/list");
export const getGroupDetail = (groupId) =>
  axiosInstance.get(`/group/${groupId}`);
// 멤버 추가 (userId로 초대)
export const addGroupMember = (groupId, userId) =>
  axiosInstance.post(`/group/${groupId}/member`, { userId });
// 멤버 탈퇴
export const leaveGroupMember = (groupId, memberId) =>
  axiosInstance.delete(`/group/${groupId}/member/${memberId}`);
// 그룹 삭제
export const deleteGroup = (groupId) =>
  axiosInstance.delete(`/group/${groupId}`);
// 그룹 멤버 조회
export const getGroupMembers = (groupId) =>
  axiosInstance.get(`/group/${groupId}/members`);
