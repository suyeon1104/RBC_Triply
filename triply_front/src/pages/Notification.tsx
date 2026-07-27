import React, { useEffect, useState } from "react";
import TopNav from "../components/Navigation/TopNav/TopNav";
import BottomNav from "../components/BottomNav";
import { getNotiList } from "../api/notiApi";
import Button from "../components/Button/Button/Button";
import { ChevronRight, Users, Wallet } from "lucide-react";
import "../styles/Notification.css";

interface Notification {
  notificationId: number;
  title: string;
  subTitle: string | null;
  content: string;
  senderName: string;
  type: "GROUP_INVITE" | "SETTLEMENT_REQUEST";
  targetId: number;
  createdAt: string;
}

const Notification = () => {
  const [activeTab, setActiveTab] = useState("none");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<Notification | null>(null);

  // 알림을 불러오기
  const fetchNotiList = async () => {
    try {
      const res = await getNotiList();
      setNotifications(res.data);
      console.log("알림 목록:", res.data);
    } catch (error) {
      console.error("알림 목록 조회 실패:", error);
    }
  };
  useEffect(() => {
    fetchNotiList();
  }, []);

  // 버튼에 걸릴 이벤트 핸들러
  const handleAccept = async () => {
    // 그룹 초대 수락 API 호출
    // 모달 닫기
    // 알림 목록 새로고침
  };

  const handleReject = async () => {
    // 그룹 초대 거절 API 호출
    // 모달 닫기
    // 알림 목록 새로고침
  };

  const handleSettlement = async () => {
    // 정산 처리(또는 정산 페이지 이동)
    // 필요하면 모달 닫기
    // 알림 목록 새로고침
  };
  return (
    <>
      <TopNav title="알림내역" />
      <main className="page">
        {/* 알림 목록을 표시할 컴포넌트를 여기에 추가 */}
        {/* <Button>정산하기</Button> */}
        {notifications.map((notification) => (
          <div
            className="notification-item"
            key={notification.notificationId}
            onClick={() => setSelectedNotification(notification)}
          >
            <div className="notification-left">
              {notification.type === "GROUP_INVITE" ? (
                <Users size={22} color="black" />
              ) : (
                <Wallet size={22} color="black" />
              )}

              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-content-text">
                  {notification.type === "GROUP_INVITE"
                    ? `${notification.senderName}님이 그룹에 초대했습니다.`
                    : `${notification.senderName}님이 정산을 요청했습니다.`}
                </p>
              </div>
            </div>

            <ChevronRight size={20} color="var(--gray-500)" />
          </div>
        ))}
      </main>
      {selectedNotification && (
        <div
          className="modal-overlay"
          onClick={() => setSelectedNotification(null)}
        >
          <div
            className="notification-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>{selectedNotification.title}</h2>

            {selectedNotification.subTitle && (
              <p className="notification-subtitle">
                {selectedNotification.subTitle}
              </p>
            )}

            <p className="notification-message">
              {selectedNotification.content}
            </p>

            {selectedNotification.type === "GROUP_INVITE" ? (
              <div className="modal-buttons">
                <Button variant="assistive" onClick={handleReject}>
                  거절
                </Button>

                <Button onClick={handleAccept}>수락</Button>
              </div>
            ) : (
              <Button onClick={handleSettlement}>정산하기</Button>
            )}
          </div>
        </div>
      )}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default Notification;
