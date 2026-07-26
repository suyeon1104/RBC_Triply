import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, User } from 'lucide-react';
import IconButton from '../../Button/IconButton/IconButton';
import { getNotiCount } from '../../../api/notiApi';
import './GNB.css';

export default function GNB() {
  const navigate = useNavigate();
  const [notificationCount, setNotificationCount] = useState<number>(0);

  // useEffect 내부에서 함수를 정의하고 호출하여 호이스팅/TDZ 에러 방지
  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        const res = await getNotiCount();
        setNotificationCount(res.data.count);
      } catch (e) {
        console.error(e);
      }
    };

    fetchNotificationCount();
  }, []);

  return (
    <div className="GNB">
      <h1 className="leading" onClick={() => navigate('/main')}>
        <img src="/assets/logo.svg" alt="triply" />
      </h1>

      <div className="trailing">
        <div className="GNB-notiWrapper">
          <IconButton variant="assistive" size="l" shape="horizontal" onClick={() => navigate('/notification')} aria-label="알림">
            <Bell />
          </IconButton>

          {notificationCount > 0 && <span className="GNB-badge">{notificationCount > 99 ? '99+' : notificationCount}</span>}
        </div>

        <IconButton variant="assistive" size="l" shape="horizontal" onClick={() => navigate('/mypage')} aria-label="프로필">
          <User />
        </IconButton>
      </div>
    </div>
  );
}
