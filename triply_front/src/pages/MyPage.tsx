import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";
import { LuCheck, LuCopy } from "react-icons/lu";
// import "../styles/globals.css";
import "../styles/MyPage.css";
import TopNav from "../components/Navigation/TopNav/TopNav";
import { Settings, Settings2 } from "lucide-react";

export interface UserData {
  loginId: string;
  userName: string;
  userPhone: string;
  result: boolean;
}

export default function MyPage() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [edPhone, setEdPhone] = useState<string | undefined>(undefined);
  // const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (!res) return;
      console.log(res.data);
      setUserData(res.data);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const phoneString = userData?.userPhone;
      if (phoneString !== undefined) {
        const num1 = phoneString?.split("").slice(0, 3).join("");
        const num2 = phoneString?.split("").slice(3, 7).join("");
        const num3 = phoneString?.split("").slice(7).join("");

        setEdPhone(`${num1} - ${num2} - ${num3}`);
      }
    })();
  }, [userData]);

  function handleCopyId() {
    if (!userData) return;
    navigator.clipboard.writeText(userData?.loginId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  function handleLogout() {
    logout();
    console.log("navigate 실행 직전");
    navigate("/login");
    console.log("navigate 실행 직후");
  }
  function handleResign() {
    alert("회원탈퇴 구현하기!");
  }
  return (
    <>
      <header>
        <TopNav title="마이페이지" />
      </header>

      <main className="page mypage">
        {/* 프로필 카드 */}
        <section className="mypage-profile-card">
          <button
            className="profile-edit-btn"
            onClick={() => navigate("/editprofile", { state: { userData } })}
          >
            <Settings size={18} strokeWidth={2} />
          </button>

          <div className="profile-image">
            <img src="/image/Profile.png" alt="프로필 이미지" />
          </div>

          <h2 className="profile-name">{userData?.userName}</h2>

          <div className="profile-id">
            <span>{userData?.loginId}</span>

            <button onClick={handleCopyId}>
              {copied ? <LuCheck /> : <LuCopy />}
            </button>
          </div>

          <p className="profile-phone">{edPhone}</p>
        </section>

        {/* 바로가기 */}
        <section className="mypage-shortcut-card">
          <button className="shortcut-item">
            <div className="shortcut-icon">⛶</div>
            <span>계좌 관리</span>
          </button>

          <button className="shortcut-item">
            <div className="shortcut-icon">⛶</div>
            <span>이용 한도</span>
          </button>

          <button className="shortcut-item">
            <div className="shortcut-icon">⛶</div>
            <span>환율 정보</span>
          </button>

          <button className="shortcut-item">
            <div className="shortcut-icon">⛶</div>
            <span>번역기</span>
          </button>
        </section>

        {/* 메뉴 */}
        <section className="mypage-menu-card">
          <button className="menu-item">
            <span>⛶</span>
            <span>공지사항</span>
            <span>›</span>
          </button>

          <button className="menu-item">
            <span>⛶</span>
            <span>FAQ</span>
            <span>›</span>
          </button>

          <button className="menu-item">
            <span>⛶</span>
            <span>이용약관</span>
            <span>›</span>
          </button>

          <button className="menu-item">
            <span>⛶</span>
            <span>오픈소스 라이선스</span>
            <span>›</span>
          </button>
        </section>

        <div className="mypage-footer">
          <span>버전정보: 1.0.0</span>
          <span className="footer-divider">|</span>

          <button onClick={handleLogout}>로그아웃</button>
          <span className="footer-divider">|</span>

          <button onClick={handleResign}>회원 탈퇴</button>
        </div>
      </main>
    </>
  );
}
