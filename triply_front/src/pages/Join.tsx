import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/useAuth";
import { idCheck, loginUser, phoneCheck } from "../api/authApi";

import "../styles/Join.css";

import TopNav from "../components/Navigation/TopNav/TopNav";
import Button from "../components/Button/Button/Button";

type checkType = "beforeChecked" | "confirmedValue" | "wrongValue";

// 비밀번호 정규식: 영문, 숫자, 특수문자를 포함한 8~20자
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,20}$/;

export default function Join() {
  const { login } = useAuth();
  const [userName, setUserName] = useState("");
  const [loginId, setLoginId] = useState("");

  const [isLoginIdChecked, setIsLoginIdChecked] =
    useState<checkType>("beforeChecked");

  const [loginPw, setLoginPw] = useState("");
  const [userPhone, setUserPhone] = useState("");

  // 휴대폰 인증
  const [serverVerificationCode, setServerVerificationCode] = useState("");
  const [inputCode, setInputCode] = useState("");
  const [showPhoneInput, setShowPhoneInput] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);

  // 팝업
  const [showPhonePopup, setShowPhonePopup] = useState(false);

  // 메시지
  const [idMsg, setIdMsg] = useState("");
  const [phoneMsg, setPhoneMsg] = useState("");
  const [joinMsg, setJoinMsg] = useState("");
  const [pwMsg, setPwMsg] = useState("");

  const [isPwValid, setIsPwValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (isAuthenticated || token) {
      // navigate("/main");
    }
  }, [isAuthenticated]);

  // 회원가입
  const handleJoin = async () => {
    if (!userName || !loginId || !loginPw || !userPhone) {
      setJoinMsg("모든 필드를 입력해주세요.");
      return;
    }

    if (isLoginIdChecked !== "confirmedValue") {
      setJoinMsg("아이디 중복 확인을 진행해주세요.");
      return;
    }

    if (!isPwValid) {
      setJoinMsg("비밀번호 조건을 확인해주세요.");
      return;
    }

    if (!isPhoneVerified) {
      setJoinMsg("휴대폰 번호 인증을 진행해주세요.");
      return;
    }

    const data = {
      loginId,
      loginPw,
      userName,
      userPhone,
    };

    setLoading(true);
    setJoinMsg("");

    try {
      // 1. 회원가입
      await axiosInstance.post("/user/auth/join", data);

      // 2. 로그인
      const loginResponse = await loginUser({
        loginId,
        loginPw,
      });

      // 3. 토큰 저장
      login(loginResponse.data.token);

      alert("회원가입이 완료되었습니다.");

      navigate("/main");
    } catch (error: any) {
      setJoinMsg(error.response?.data?.msg ?? "회원가입에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 아이디 중복 확인
  const handleCheckId = async () => {
    if (!loginId) {
      setIdMsg("아이디를 입력해주세요.");
      return;
    }

    try {
      const res = await idCheck(loginId);

      if (res.data.result) {
        setIsLoginIdChecked("confirmedValue");
        setIdMsg("사용 가능한 아이디입니다.");
      } else {
        setIsLoginIdChecked("wrongValue");
        setIdMsg("이미 사용 중인 아이디입니다.");
      }
    } catch {
      setIsLoginIdChecked("wrongValue");
      setIdMsg("아이디 확인 중 오류가 발생했습니다.");
    }
  };

  // 휴대폰 인증번호 요청
  const handleRequestPhoneAuth = async () => {
    if (!userPhone) {
      setPhoneMsg("휴대폰 번호를 입력해주세요.");
      return;
    }

    try {
      const res = await phoneCheck();

      const code = String(res.data.code ?? "999999");

      setServerVerificationCode(code);

      // 인증번호 입력창 표시
      setShowPhoneInput(true);

      // 인증 완료 상태 초기화
      setIsPhoneVerified(false);

      // 팝업 표시
      setShowPhonePopup(true);

      setTimeout(() => {
        setShowPhonePopup(false);
      }, 5000);

      setPhoneMsg("인증번호가 발송되었습니다.");
    } catch {
      setPhoneMsg("인증번호 발송에 실패했습니다.");
    }
  };

  // 인증번호 확인
  const handleCheckPhoneCode = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setInputCode(value);

    if (value === serverVerificationCode) {
      setIsPhoneVerified(true);
      setPhoneMsg("휴대폰 인증이 완료되었습니다.");
    } else {
      setIsPhoneVerified(false);

      if (value.length === 6) {
        setPhoneMsg("인증번호가 일치하지 않습니다.");
      }
    }
  };
  // 전화번호 포맷함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 11);

    if (numbers.length < 4) return numbers;
    if (numbers.length < 8) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;

    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };
  return (
    <>
      <header>
        <TopNav title="회원가입" />
      </header>

      <div className="join-form">
        {/* 인증 팝업 */}
        {showPhonePopup && (
          <div className="phone-popup">
            <div className="popup-title">🔔 인증번호 도착</div>

            <div className="popup-content">
              인증번호
              <strong>{serverVerificationCode}</strong>를 입력해주세요.
            </div>
          </div>
        )}

        <div className="join-title-container">
          <h1 className="join-main-title">
            트리플리 이용을 위해
            <br />
            회원정보를 입력해주세요.
          </h1>
        </div>

        {/* 이름 */}
        <div className="join-input-group">
          <label className="join-label">
            이름<span>*</span>
          </label>

          <input
            className="join-input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />

          <p className="join-msg-space"></p>
        </div>

        {/* 아이디 */}
        <div className="join-input-group">
          <label className="join-label">
            아이디<span>*</span>
          </label>

          <div className="join-inline-group">
            <input
              className="join-input"
              value={loginId}
              onChange={(e) => {
                setLoginId(e.target.value);
                setIsLoginIdChecked("beforeChecked");
                setIdMsg("");
              }}
            />

            <Button
              variant={
                isLoginIdChecked === "confirmedValue" ? "primary" : "assistive"
              }
              onClick={handleCheckId}
            >
              {isLoginIdChecked === "confirmedValue"
                ? "확인 완료"
                : "아이디 중복 확인"}
            </Button>
          </div>

          <p
            className={
              isLoginIdChecked === "confirmedValue"
                ? "join-msg-space success"
                : "join-msg-space error"
            }
          >
            {idMsg}
          </p>
        </div>

        {/* 비밀번호 */}
        <div className="join-input-group">
          <label className="join-label">
            비밀번호<span>*</span>
          </label>

          <input
            className="join-input"
            type="password"
            value={loginPw}
            onChange={(e) => {
              const value = e.target.value;

              setLoginPw(value);

              if (passwordRegex.test(value)) {
                setPwMsg("사용 가능한 비밀번호입니다.");

                setIsPwValid(true);
              } else {
                setPwMsg(
                  "영문, 숫자, 특수문자를 포함한 8~20자로 입력해주세요.",
                );

                setIsPwValid(false);
              }
            }}
          />

          <p
            className={
              isPwValid ? "join-msg-space success" : "join-msg-space error"
            }
          >
            {pwMsg}
          </p>
        </div>

        {/* 휴대폰 */}
        <div className="join-input-group">
          <label className="join-label">
            휴대폰 번호<span>*</span>
          </label>

          <div className="join-inline-group">
            <input
              type="tel"
              className="join-input"
              inputMode="numeric"
              value={formatPhoneNumber(userPhone)}
              onChange={(e) => {
                const numbers = e.target.value.replace(/\D/g, "").slice(0, 11);

                setUserPhone(numbers);

                setPhoneMsg("");
                setIsPhoneVerified(false);
                setShowPhoneInput(false);
              }}
            />

            <Button
              variant={isPhoneVerified ? "primary" : "assistive"}
              onClick={() => {
                if (isPhoneVerified) return;

                handleRequestPhoneAuth();
              }}
            >
              {isPhoneVerified ? "인증 완료" : "휴대폰 번호 인증"}
            </Button>
          </div>

          <p
            className={
              isPhoneVerified
                ? "join-msg-space success"
                : "join-msg-space error"
            }
          >
            {phoneMsg}
          </p>

          {showPhoneInput && (
            <input
              className="join-input"
              placeholder="인증번호 입력...."
              value={inputCode}
              onChange={handleCheckPhoneCode}
            />
          )}
        </div>

        <p className="join-msg-space error">{joinMsg || " "}</p>

        {/* <Button onClick={handleJoin}>
          {loading ? "가입 중..." : "가입하고 서비스 이용하기"}
        </Button> */}

        <div className="edit-profile-bottom">
          <Button className="edit-profile-submit" onClick={handleJoin}>
            {loading ? "가입 중..." : "가입하고 서비스 이용하기"}
          </Button>
        </div>
      </div>
    </>
  );
}
