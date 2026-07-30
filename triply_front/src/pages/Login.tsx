import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/useAuth';
import '../styles/Login.css';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [loginPw, setLoginPw] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // 자동 로그인 상태
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (isAuthenticated || token) {
      navigate('/main', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId || !loginPw) {
      setErrorMsg('아이디와 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await axiosInstance.post('user/auth/signin', {
        loginId,
        loginPw,
        rememberMe,
      });

      const token = res.data.token;

      // 로그인 실패 응답 처리
      if (!token) {
        setErrorMsg(res.data.msg ?? '로그인에 실패했습니다');
        return;
      }

      login(token);
      navigate('/main', { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.msg ?? '로그인에 실패했습니다';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleSubmit} className="form">
        {/* 상단 로고 및 안내 문구 */}
        <div className="logoContainer">
          {/* main400 색상의 로고 이미지 */}
          <img src="/assets/logo.svg" alt="triply logo" className="logoImg" />
          <p className="subText">트리플리 이용을 위해 로그인이 필요해요.</p>
        </div>

        {/* 아이디 입력 */}
        <div className="inputGroup">
          <label className="label">아이디</label>
          <input type="text" placeholder="아이디를 입력해주세요" value={loginId} onChange={(e) => setLoginId(e.target.value)} className="input" />
        </div>

        {/* 비밀번호 입력 */}
        <div className="inputGroup">
          <label className="label">비밀번호</label>
          <input type="password" placeholder="비밀번호를 입력해주세요" value={loginPw} onChange={(e) => setLoginPw(e.target.value)} className="input" />
        </div>

        {/* 자동 로그인 체크박스 */}
        <div className="rememberContainer">
          <label className="checkboxLabel">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="checkbox" />
            자동 로그인
          </label>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && <p className="errorText">{errorMsg}</p>}

        <button type="submit" disabled={loading} className="submitButton">
          <span>{loading ? '로그인 중...' : '로그인'}</span>
        </button>

        {/* 하단 링크 메뉴 (회원가입 | 아이디 찾기 | 비밀번호 찾기) */}
        <div className="footerLinks">
          <Link to="/join" className="link">
            회원가입
          </Link>
          <span className="divider">|</span>
          <Link to="/find-id" className="link">
            아이디 찾기
          </Link>
          <span className="divider">|</span>
          <Link to="/find-password" className="link">
            비밀번호 찾기
          </Link>
        </div>
      </form>
    </div>
  );
}
