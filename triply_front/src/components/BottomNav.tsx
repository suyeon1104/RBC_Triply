import { useNavigate } from "react-router-dom";
import "../styles/BottomNav.css";

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: Props) {
  const navigate = useNavigate();

  return (
    <nav className="bottom-nav">
      <button
        className={activeTab === "main" ? "active" : ""}
        onClick={() => {
          setActiveTab("main");
          navigate("/main");
        }}
      >
        🏠
        <span>홈</span>
      </button>

      <button
        className={activeTab === "wallet" ? "active" : ""}
        onClick={() => {
          setActiveTab("wallet");
          navigate("/wallet");
        }}
      >
        💳
        <span>지갑</span>
      </button>

      <button
        className={activeTab === "planner" ? "active" : ""}
        onClick={() => {
          setActiveTab("planner");
          navigate("/planner");
        }}
      >
        📖
        <span>플래너</span>
      </button>

      <button
        className={activeTab === "group" ? "active" : ""}
        onClick={() => {
          setActiveTab("group");
          navigate("/group");
        }}
      >
        👥
        <span>그룹</span>
      </button>
    </nav>
  );
}
