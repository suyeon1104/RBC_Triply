import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';
import { useEffect, useState } from 'react';
import { getNotiCount } from '../api/notiApi';

export default function Header() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState(0);

  useEffect(() => {
    fetchNotificationCount();
  }, []);

  const fetchNotificationCount = async () => {
    try {
      const res = await getNotiCount();
      setNotificationCount(res.data.count);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <header className="header">
      <h1 className="logo">triply</h1>

      <div className="header-icons">
        <div className="notification-wrapper">
          <button className="icon-button" aria-label="알림" onClick={() => navigate('/notification')}>
            🔔
          </button>

          {notificationCount > 0 && <span className="notification-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>}
        </div>

        <button className="icon-button" aria-label="프로필" onClick={() => navigate('/mypage')}>
          👤
        </button>
      </div>
    </header>
  );
}
