// src/pages/Login.tsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/useAuth";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // 자동 로그인 상태
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (isAuthenticated || token) {
      navigate("/main", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginId || !loginPw) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("user/auth/signin", {
        loginId,
        loginPw,
        rememberMe, // API 명세에 맞춰 필요한 경우 함께 전송
      });

      const token = res.data.token;
      login(token);
      navigate("/main", { replace: true });
    } catch (err: any) {
      const message = err.response?.data?.msg ?? "로그인에 실패했습니다";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        {/* 상단 로고 및 안내 문구 */}
        <div style={styles.logoContainer}>
          <h1 style={styles.logoText}>triply</h1>
          <p style={styles.subText}>트리플리 이용을 위해 로그인이 필요해요.</p>
        </div>

        {/* 아이디 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>아이디</label>
          <input
            type="text"
            placeholder="아이디를 입력해주세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>비밀번호</label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 자동 로그인 체크박스 */}
        <div style={styles.rememberContainer}>
          <label style={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              style={styles.checkbox}
            />
            자동 로그인
          </label>
        </div>

        {/* 에러 메시지 */}
        {errorMsg && <p style={styles.errorText}>{errorMsg}</p>}

        {/* 로그인 버튼 */}
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "로그인 중..." : "로그인"}
        </button>

        {/* 하단 링크 메뉴 (회원가입 | 아이디 찾기 | 비밀번호 찾기) */}
        <div style={styles.footerLinks}>
          <Link to="/join" style={styles.link}>회원가입</Link>
          <span style={styles.divider}>|</span>
          <Link to="/find-id" style={styles.link}>아이디 찾기</Link>
          <span style={styles.divider}>|</span>
          <Link to="/find-password" style={styles.link}>비밀번호 찾기</Link>
        </div>
      </form>
    </div>
  );
}

// 디자인 시안을 반영한 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
  },
  form: {
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
  },
  logoContainer: {
    textAlign: "center",
    marginBottom: "40px",
  },
  logoText: {
    color: "#5b86e5", // 시안의 블루 톤 컬러
    fontSize: "42px",
    fontWeight: "bold",
    margin: "0 0 10px 0",
    letterSpacing: "-1px",
  },
  subText: {
    color: "#8c8c8c",
    fontSize: "14px",
    margin: 0,
  },
  inputGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontSize: "14px",
    color: "#333333",
    marginBottom: "8px",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    fontSize: "15px",
    outline: "none",
    backgroundColor: "#fafafa",
    boxSizing: "border-box",
  },
  rememberContainer: {
    marginBottom: "24px",
    display: "flex",
    alignItems: "center",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    fontSize: "14px",
    color: "#555555",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    marginRight: "8px",
    accentColor: "#5b86e5",
    cursor: "pointer",
  },
  errorText: {
    color: "#ff4d4f",
    fontSize: "13px",
    marginBottom: "16px",
    textAlign: "center",
  },
  submitButton: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: "#5b86e5",
    color: "#ffffff",
    border: "none",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(91, 134, 229, 0.3)",
    marginBottom: "24px",
  },
  footerLinks: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "13px",
    color: "#8c8c8c",
  },
  link: {
    color: "#8c8c8c",
    textDecoration: "none",
  },
  divider: {
    margin: "0 16px",
    color: "#d9d9d9",
  },
};

