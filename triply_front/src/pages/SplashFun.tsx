import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SplashFun.css';

export default function SplashFun() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/login', { replace: true });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src="/assets/logo.svg" alt="triply logo" className="splash-logo" />
        <p className="splash-subtext">여행을 심플하게, 트리플리</p>
      </div>
    </div>
  );
}
