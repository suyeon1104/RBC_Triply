import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function MyPage() {
  const navigate = useNavigate();

    const {logout } = useAuth();
    function handleLogout() {
      logout();
      console.log("navigate 실행 직전");
      navigate("/login");
      console.log("navigate 실행 직후");
    }

  return (
    <>
      <p>!!! 마이페이지 !!!</p>
      <button onClick={handleLogout} aria-label="로그아웃">
        ❌
      </button>
    </>
  );
};