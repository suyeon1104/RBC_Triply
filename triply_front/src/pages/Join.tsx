// src/pages/Join.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance"; // 또는 기존 axios 설정 유지
import { useAuth } from "../contexts/useAuth";
import { idCheck, phoneCheck } from "../api/authApi.ts"

type checkType = "beforeChecked" | "confirmedValue" | "wrongValue";

export default function Join() {
  const [userName, setUserName] = useState("");
  const [loginId, setLoginId] = useState("");
  const [isLoginIdChecked, setIsLoginIdChecked] = useState<checkType>("beforeChecked");
  const [isPhoneNumAvailable, setIsPhoneNumAvailable] = useState<checkType>("beforeChecked");
  const [loginPw, setLoginPw] = useState("");
  const [userPhone, setUserPhone] = useState("");

  const [serverVerificationCode, setServerVerificationCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  const [msg, setMsg] = useState("");
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { _, isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (isAuthenticated || token) {
      // navigate("/main", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!userName || !loginId || !loginPw || !userPhone) {
      setMsg("모든 필드를 입력해주세요");
      return;
    }

    if (isLoginIdChecked !== "confirmedValue") {
      setMsg("아이디 중복 확인을 진행해주세요.");
      return;
    }

    if (!isPhoneVerified) {
      setMsg("휴대폰 번호 인증을 진행해주세요.");
      return;
    }


    const data = {
      loginId,
      loginPw,
      userName,
      userPhone,
    };

    setLoading(true);
    setMsg("");

    try {
      const response = await axiosInstance.post("/user/auth/join", { ...data });
      // console.log(response.data);
      alert(response.data);
      setMsg("회원가입이 완료되었습니다");
      setResult(true);
      
      // 가입 완료 후 홈 페이지로 이동
      setTimeout(() => {
        navigate("/main");
      }, 1500);
    } catch (error: any) {
      console.error(error);
      setMsg(error.response?.data?.msg ?? "회원가입에 실패했습니다");
      setResult(false);
    } finally {
      setLoading(false);
    }
  }

  const handleCheckId = async () => {
    // loginId = null 로 초기화
    if (!loginId) {
      setMsg("아이디를 입력해주세요.");
      return;
    }
    try {
      // axios API 통신 (login ID 존재하는지 확인)
      const res = await idCheck(loginId);
      
      if (!res.data) return;

      if (res.data.result) {
        setIsLoginIdChecked("confirmedValue");
        setMsg("사용 가능한 아이디입니다.");
      } else {
        setIsLoginIdChecked("wrongValue");
        setMsg("이미 사용 중인 아이디입니다.");
      }
    }
    catch (err) {
      // setIsLoginIdChecked("confirmedValue");
      // setMsg("사용 가능한 아이디입니다.");
    }
  };

const handleRequestPhoneAuth = async () => {
  if (!userPhone) {
    setMsg("휴대폰 번호를 입력해주세요.");
    return;
  }
  try {
    const res = await phoneCheck(userPhone);

    if (!res.data) return;
    
    const code = res.data.code ?? "999999"; 
    setServerVerificationCode(code);
    setIsPhoneVerified(true);
    setMsg(`인증번호가 발송되었습니다.`);
    } catch (err) {
      const mockCode = "123456"; // 백엔드 미구현 시 테스트용
      setServerVerificationCode(mockCode);
      setIsPhoneVerified(true);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate(-1)} style={styles.backButton}>
          &lt;
        </button>
        <h2 style={styles.headerTitle}>회원가입</h2>
        <div style={{ width: "24px" }} /> {/* 좌우 균형 맞춤용 빈 공간 */}
      </div>

      <form onSubmit={handleJoin} style={styles.form}>
        <div style={styles.titleContainer}>
          <h1 style={styles.mainTitle}>
            트리플리 이용을 위해<br />회원정보를 입력해주세요.
          </h1>
        </div>

        {/* 이름 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>이름<span style={styles.required}>*</span></label>
          <input
            type="text"
            placeholder="이름을 입력해주세요"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 아이디 입력 + 중복 확인 버튼 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>아이디<span style={styles.required}>*</span></label>
          <div style={styles.inlineGroup}>
        <input
          type="text"
          value={loginId}
          onChange={(e) => {
            setLoginId(e.target.value);
            setIsLoginIdChecked("beforeChecked"); // 수정 시 재검증 유도
          }} />
        <button type="button" onClick={handleCheckId}>아이디 중복 확인</button>
            { isLoginIdChecked === "confirmedValue" ? <p>통과</p> :
            isLoginIdChecked === "wrongValue" ? <p>불통</p> : <p>아이디 확인이나 해라ㅋ</p>}
          </div>
        </div>

        {/* 비밀번호 입력 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>비밀번호<span style={styles.required}>*</span></label>
          <input
            type="password"
            placeholder="비밀번호를 입력해주세요"
            value={loginPw}
            onChange={(e) => setLoginPw(e.target.value)}
            style={styles.input}
          />
        </div>

        {/* 휴대폰 번호 입력 + 인증 버튼 */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>휴대폰 번호<span style={styles.required}>*</span></label>
          <div style={styles.inlineGroup}>
            <input
              type="text"
              placeholder="숫자만 입력해주세요"
              value={userPhone}
              onChange={(e) => setUserPhone(e.target.value)}
              style={{ ...styles.input, flex: 1, marginBottom: 0 }}
            />
            <button type="button" style={styles.subActionButton} onClick={handleRequestPhoneAuth}>
              휴대폰 번호 인증
            </button>
            { isPhoneNumAvailable === "confirmedValue" ? <p>통과</p> :
            isPhoneNumAvailable === "wrongValue" ? <p>불통</p> : <p>폰번 확인이나 해라ㅋ</p>}
          </div>
        </div>

        {/* 메시지 표시 (에러 및 성공) */}
        {msg && (
          <p style={{ color: result ? "#5b86e5" : "#ff4d4f", fontSize: "13px", marginBottom: "16px" }}>
            {msg}
          </p>
        )}
        {isPhoneVerified && (
          <div style={{ marginTop: "8px", padding: "10px", backgroundColor: "#f1f3f5", borderRadius: "8px" }}>
            📩 서버에서 전송된 인증번호: <strong style={{ color: "#5b86e5" }}>{serverVerificationCode}</strong>
          </div>
        )}
        {/* 하단 가입 버튼 */}
        <button type="submit" disabled={loading} style={styles.submitButton}>
          {loading ? "가입 중..." : "가입하고 서비스 이용하기"}
        </button>
      </form>
    </div>
  );
}

// 디자인 시안을 반영한 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#ffffff",
    padding: "20px",
    maxWidth: "480px",
    margin: "0 auto",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
  },
  backButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#333333",
  },
  headerTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
    color: "#333333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  titleContainer: {
    marginBottom: "30px",
  },
  mainTitle: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#222222",
    lineHeight: "1.4",
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
  required: {
    color: "#5b86e5",
    marginLeft: "2px",
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
  inlineGroup: {
    display: "flex",
    gap: "10px",
  },
  subActionButton: {
    padding: "0 16px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#f5f5f5",
    color: "#555555",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
    whiteSpace: "nowrap",
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
    marginTop: "auto",
    marginBottom: "20px",
  },
};
