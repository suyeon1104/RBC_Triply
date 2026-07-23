// src/pages/Main.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";

export default function Main() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("main"); // 하단 네비게이션 상태

const {logout } = useAuth();
  function handleLogout() {
    logout();
     console.log("navigate 실행 직전");
  navigate("/login");
  console.log("navigate 실행 직후");
  }

  return (
    <div style={styles.container}>
      {/* 1. 상단 헤더 (로고 및 알림/프로필 아이콘) */}
      <header style={styles.header}>
        <h1 style={styles.logo}>triply</h1>
        <div style={styles.headerIcons}>
          <button style={styles.iconButton} aria-label="알림">
            🔔
          </button>
          <button style={styles.iconButton} aria-label="프로필">
            👤
          </button>
          <button onClick={handleLogout} style={styles.iconButton} aria-label="로그아웃">
            ❌
          </button>
        </div>
      </header>

      {/* 스크롤 영역 (하단 네비게이션에 가리지 않도록 여백 확보) */}
      <main style={styles.mainContent}>
        {/* 2. 상단 둥근 배너 영역 */}
        <section style={styles.banner}>
          <div style={styles.bannerTextContainer}>
            <span style={styles.bannerDate}>Today is 2026.07.13(월)</span>
            <h2 style={styles.bannerTitle}>Make your<br />Destination</h2>
            <p style={styles.bannerSubtitle}>멤버들과 함께 여행을 떠나보세요.</p>
          </div>
          <button 
            style={styles.planButton}
            onClick={() => navigate("/planner/create")} // 필요에 따라 라우팅 경로 수정
          >
            여행 계획 만들기 <span style={styles.plusIcon}>+</span>
          </button>
        </section>

        {/* 3. 나의 지갑 카드 섹션 */}
        <section style={styles.walletCard}>
          <div style={styles.walletHeader}>
            <h3 style={styles.walletTitle}>나의 지갑</h3>
            <button style={styles.moreButton}>전체보기 &gt;</button>
          </div>
          <div style={styles.walletBody}>
            <div style={styles.balance}>450,000원</div>
            <div style={styles.accountInfo}>국민은행 12345678-912-345</div>
          </div>
          <div style={styles.walletActions}>
            <button style={styles.chargeButton}>충전하기</button>
            <button style={styles.payButton}>결제하기</button>
          </div>
        </section>

        {/* 4. 정산 안내 배너 */}
        <section style={styles.settlementBanner}>
          <div style={styles.settlementText}>
            <span style={styles.highlightText}>2건</span>의 정산이 남아 있어요~~
          </div>
          <button style={styles.settlementMoreButton}>확인하기 &gt;</button>
        </section>
      </main>

      {/* 5. 하단 네비게이션 바 */}
      <nav style={styles.bottomNav}>
        <button 
          style={{ ...styles.navItem, color: activeTab === "main" ? "#5b86e5" : "#8c8c8c" }}
          onClick={() => setActiveTab("main")}
        >
          <span style={styles.navIcon}>🏠</span>
          <span style={styles.navText}>홈</span>
        </button>
        <button 
          style={{ ...styles.navItem, color: activeTab === "wallet" ? "#5b86e5" : "#8c8c8c" }}
          onClick={() => {
            setActiveTab("wallet");
            navigate("/wallet");
          }}
        >
          <span style={styles.navIcon}>💳</span>
          <span style={styles.navText}>지갑</span>
        </button>
        <button 
          style={{ ...styles.navItem, color: activeTab === "planner" ? "#5b86e5" : "#8c8c8c" }}
          onClick={() => {
            setActiveTab("planner");
            navigate("/planner");
          }}
        >
          <span style={styles.navIcon}>📖</span>
          <span style={styles.navText}>플래너</span>
        </button>
        <button 
          style={{ ...styles.navItem, color: activeTab === "group" ? "#5b86e5" : "#8c8c8c" }}
          onClick={() => {
            setActiveTab("group");
            navigate("/group");
          }}
        >
          <span style={styles.navIcon}>👥</span>
          <span style={styles.navText}>그룹</span>
        </button>
      </nav>
    </div>
  );
}

// 디자인 시안을 반영한 스타일 객체
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    backgroundColor: "#f8f9fa",
    maxWidth: "480px",
    margin: "0 auto",
    position: "relative",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    backgroundColor: "#ffffff",
  },
  logo: {
    color: "#5b86e5",
    fontSize: "24px",
    fontWeight: "bold",
    margin: 0,
    letterSpacing: "-0.5px",
  },
  headerIcons: {
    display: "flex",
    gap: "12px",
  },
  iconButton: {
    background: "#f1f3f5",
    border: "none",
    borderRadius: "50%",
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    fontSize: "16px",
  },
  mainContent: {
    flex: 1,
    padding: "16px 20px 90px 20px",
    overflowY: "auto",
  },
  banner: {
    position: "relative",
    width: "100%",
    height: "360px",
    backgroundColor: "#1c2833",
    backgroundImage: "linear-gradient(rgba(28, 40, 51, 0.75), rgba(28, 40, 51, 0.75)), url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80')", // 비행기 배경 예시 이미지
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "200px 200px 24px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    color: "#ffffff",
    padding: "0 20px",
    boxSizing: "border-box",
    marginBottom: "20px",
    overflow: "hidden",
  },
  bannerTextContainer: {
    marginBottom: "24px",
  },
  bannerDate: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#e0e0e0",
    marginBottom: "8px",
    display: "block",
  },
  bannerTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    lineHeight: "1.25",
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px",
  },
  bannerSubtitle: {
    fontSize: "13px",
    color: "#cccccc",
    margin: 0,
  },
  planButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    border: "none",
    borderRadius: "20px",
    padding: "10px 20px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#333333",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "6px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
  },
  plusIcon: {
    fontSize: "16px",
    fontWeight: "bold",
  },
  walletCard: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "20px",
    marginBottom: "16px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  walletHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  walletTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#222222",
    margin: 0,
  },
  moreButton: {
    background: "none",
    border: "none",
    color: "#8c8c8c",
    fontSize: "12px",
    cursor: "pointer",
  },
  walletBody: {
    marginBottom: "20px",
  },
  balance: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#111111",
    marginBottom: "4px",
  },
  accountInfo: {
    fontSize: "13px",
    color: "#8c8c8c",
  },
  walletActions: {
    display: "flex",
    gap: "10px",
  },
  chargeButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "1px solid #e0e0e0",
    backgroundColor: "#ffffff",
    color: "#333333",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  payButton: {
    flex: 1,
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#5b86e5",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: 500,
    cursor: "pointer",
  },
  settlementBanner: {
    backgroundColor: "#ffffff",
    borderRadius: "16px",
    padding: "18px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
  },
  settlementText: {
    fontSize: "14px",
    color: "#333333",
  },
  highlightText: {
    color: "#5b86e5",
    fontWeight: "bold",
  },
  settlementMoreButton: {
    background: "none",
    border: "none",
    color: "#8c8c8c",
    fontSize: "13px",
    cursor: "pointer",
  },
  bottomNav: {
    position: "fixed",
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
    width: "100%",
    maxWidth: "480px",
    height: "70px",
    backgroundColor: "#ffffff",
    borderTop: "1px solid #f1f3f5",
    display: "flex",
    justifyContent: "space-around",
    alignItems: "center",
    boxSizing: "border-box",
    zIndex: 10,
  },
  navItem: {
    background: "none",
    border: "none",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    flex: 1,
    gap: "4px",
  },
  navIcon: {
    fontSize: "18px",
  },
  navText: {
    fontSize: "11px",
    fontWeight: 500,
  },
};
