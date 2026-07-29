import { useNavigate } from 'react-router-dom';
import { Home, Wallet, BookHeart, Users } from 'lucide-react';
import '../styles/BottomNav.css';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'main', label: '홈', path: '/main', icon: Home },
    { id: 'wallet', label: '지갑', path: '/wallet', icon: Wallet },
    { id: 'planner', label: '플래너', path: '/planner', icon: BookHeart }, // 적용완료
    { id: 'group', label: '그룹', path: '/group', icon: Users },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(item.id);
                navigate(item.path);
              }}
            >
              <IconComponent size={24} className="nav-icon" />
              <span className="nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
