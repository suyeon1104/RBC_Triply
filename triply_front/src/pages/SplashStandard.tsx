// src/pages/SplashStandard.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SplashStandard() {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const duration = 2500; // 2.5초
    const intervalTime = 25;
    const step = 100 / (duration / intervalTime);

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + step;
      });
    }, intervalTime);

    // 2.5초 후 로그인 화면으로 이동
    const timeout = setTimeout(() => {
      navigate("/login", { replace: true });
    }, duration);

    return () => {
      clearInterval(timer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.logoText}>triply</h1>
        <p style={styles.subText}>여행을 심플하게, 트리플리</p>
      </div>

      <div style={styles.progressContainer}>
        <div style={{ ...styles.progressBar, width: `${progress}%` }} />
      </div>
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
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
  progressContainer: {
    width: "160px",
    height: "4px",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: "2px",
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#ffffff",
    transition: "width 0.05s linear",
  },
};