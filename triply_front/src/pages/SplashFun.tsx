// src/pages/SplashFun.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashFun() {
  const navigate = useNavigate();

  useEffect(() => {
    // 1.5초 후 로그인 화면으로 이동
    // 1) 로그인하지 않은 경우 로그인 시도
    // 2) 로그인된 경우 -> Main.tsx 화면으로 이동
    const timeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div style={styles.container}>
      <style>
        {`
          @keyframes flyAnimation {
            0% { transform: translate(-120px, 20px) rotate(-10deg); }
            50% { transform: translate(0px, -20px) rotate(5deg); }
            100% { transform: translate(120px, 10px) rotate(-5deg); }
          }
          @keyframes puffAnimation {
            0% { transform: scale(0.2); opacity: 0; }
            50% { transform: scale(1); opacity: 0.8; }
            100% { transform: scale(1.4); opacity: 0; }
          }
        `}
      </style>

      <div style={styles.animationArea}>
        <span style={{ ...styles.cloudPuff, animationDelay: "0.2s", left: "20%" }}>☁️</span>
        <span style={{ ...styles.cloudPuff, animationDelay: "0.7s", left: "40%" }}>💨</span>
        <span style={{ ...styles.cloudPuff, animationDelay: "1.2s", left: "60%" }}>☁️</span>
        <span style={{ ...styles.cloudPuff, animationDelay: "1.7s", left: "80%" }}>💨</span>

        <div style={styles.planeWrapper}>✈️</div>
      </div>

      <div style={styles.content}>
        <h1 style={styles.logoText}>triply</h1>
        <p style={styles.subText}>여행을 심플하게, 트리플리</p>
      </div>

      <div style={{ height: "40px" }} />
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#5b86e5",
    padding: "60px 20px",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  animationArea: {
    position: "relative",
    width: "100%",
    height: "120px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  planeWrapper: {
    fontSize: "48px",
    position: "absolute",
    animation: "flyAnimation 2.5s ease-in-out infinite alternate",
  },
  cloudPuff: {
    position: "absolute",
    fontSize: "24px",
    animation: "puffAnimation 1s ease-out infinite",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: "52px",
    fontWeight: "bold",
    margin: "0 0 12px 0",
    letterSpacing: "-1.5px",
  },
  subText: {
    color: "rgba(255, 255, 255, 0.85)",
    fontSize: "16px",
    margin: 0,
    fontWeight: 500,
  },
};