import React, { useEffect, useState } from 'react';
import TopNav from '../components/Navigation/TopNav/TopNav';
import BottomNav from '../components/BottomNav';
import { getNotiList } from '../api/notiApi';
import Button from '../components/Button/Button/Button';
import { ChevronRight, Users, Wallet } from 'lucide-react';
import '../styles/Notification.css';
import { completeSettlement } from '../api/settlementApi';
import { respondGroupInvitation } from '../api/groupApi';

interface Notification {
  notificationId: number;
  title: string;
  subTitle: string | null;
  content: string;
  senderName: string;
  type: 'GROUP_INVITE' | 'SETTLEMENT_REQUEST';
  targetId: number;
  createdAt: string;
}

const Notification = () => {
  const [activeTab, setActiveTab] = useState('none');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);

  // 알림을 불러오기
  const fetchNotiList = async () => {
    try {
      const res = await getNotiList();
      setNotifications(res.data);
      console.log('알림 목록:', res.data);
    } catch (error) {
      console.error('알림 목록 조회 실패:', error);
    }
  };
  useEffect(() => {
    fetchNotiList();
  }, []);

  // 버튼에 걸릴 이벤트 핸들러
  const handleAccept = async (invitationId: number) => {
    // 그룹 초대 수락 API 호출
    try {
      const res = await respondGroupInvitation(invitationId, 'ACCEPTED');
      console.log('그룹 초대 수락:', res.data);

      // 모달 닫기
      setSelectedNotification(null);

      // 목록 새로고침
      await fetchNotiList();
    } catch (error) {
      console.error('초대 수락 실패:', error);
    }
  };

  const handleReject = async (invitationId: number) => {
    // 그룹 초대 거절 API 호출
    try {
      const res = await respondGroupInvitation(invitationId, 'REJECTED');
      console.log('그룹 초대 거절:', res.data);

      // 모달 닫기
      setSelectedNotification(null);

      // 목록 새로고침
      await fetchNotiList();
    } catch (error) {
      console.error('초대 거절 실패:', error);
    }
  };

  const handleSettlement = async (settlementId: number) => {
    try {
      const res = await completeSettlement(settlementId);
      console.log('정산 완료:', res.data);

      // 모달 닫기
      setSelectedNotification(null);

      // 목록 새로고침
      await fetchNotiList();
    } catch (error) {
      console.error('정산 완료 실패:', error);
    }
  };
  return (
    <>
      <header>
        <TopNav title="알림내역" />
      </header>
      <main className="page">
        {/* 알림 목록을 표시할 컴포넌트를 여기에 추가 */}
        {/* <Button>정산하기</Button> */}
        {notifications.map((notification) => (
          <div className="notification-item" key={notification.notificationId} onClick={() => setSelectedNotification(notification)}>
            <div className="notification-left">
              {notification.type === 'GROUP_INVITE' ? <Users size={22} color="black" /> : <Wallet size={22} color="black" />}

              <div className="notification-content">
                <p className="notification-title">{notification.title}</p>
                <p className="notification-content-text">{notification.type === 'GROUP_INVITE' ? `${notification.senderName}님이 그룹에 초대했습니다.` : `${notification.senderName}님이 정산을 요청했습니다.`}</p>
              </div>
            </div>

            <ChevronRight size={20} color="var(--gray-500)" />
          </div>
        ))}
      </main>
      {selectedNotification && (
        <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
          <div className="notification-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedNotification.title}</h3>

            {selectedNotification.subTitle && <p className="notification-subtitle">{selectedNotification.subTitle}</p>}

            <p className="notification-message">{selectedNotification.content}</p>

            {selectedNotification.type === 'GROUP_INVITE' ? (
              <div className="modal-buttons">
                <Button variant="outlined" size="l" onClick={() => handleReject(selectedNotification.targetId)}>
                  거절
                </Button>

                <Button variant="primary" size="l" onClick={() => handleAccept(selectedNotification.targetId)}>
                  수락
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="l" onClick={() => handleSettlement(selectedNotification.targetId)}>
                정산하기
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;
