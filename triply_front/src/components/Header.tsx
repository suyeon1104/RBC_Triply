import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header>
      <button onClick={handleLogout}>로그아웃</button>
    </header>
  );
}