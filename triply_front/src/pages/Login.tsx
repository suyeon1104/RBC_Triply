// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../contexts/useAuth";

export default function Login() {
  const [loginId, setLoginId] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth(); // 이전에 만든 AuthContext의 login 함수

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginId || !loginPw) {
      setErrorMsg("아이디와 비밀번호를 입력해주세요");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await axiosInstance.post("/auth/login", {
        loginId,
        loginPw,
      });

      const token = res.data.token; // 명세상 응답 필드명
      login(token); // AuthContext: localStorage 저장 + isAuthenticated 갱신
      navigate("/"); // 로그인 후 이동할 페이지
    } catch (err) {
      const message = err.response?.data?.msg ?? "로그인에 실패했습니다";
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 320, margin: "60px auto" }}>
      <h2>로그인</h2>

      <input
        type="text"
        placeholder="아이디"
        value={loginId}
        onChange={(e) => setLoginId(e.target.value)}
        style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={loginPw}
        onChange={(e) => setLoginPw(e.target.value)}
        style={{ display: "block", width: "100%", padding: 8, marginBottom: 8 }}
      />

      {errorMsg && <p style={{ color: "red", fontSize: 13 }}>{errorMsg}</p>}

      <button type="submit" disabled={loading} style={{ width: "100%", padding: 10 }}>
        {loading ? "로그인 중..." : "로그인"}
      </button>
    </form>
  );
}
