import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";
import { LuCheck, LuCopy } from "react-icons/lu";
import "../styles/MyPage.css";
import TopNav from "../components/Navigation/TopNav/TopNav";
import { Settings } from "lucide-react";
import IconButton from "../components/Button/IconButton/IconButton";
import Avatar from "../components/Avatar/Avatar";

// ============== 아바타용: Axios 및 Group 타입 정의 추가 ==============
import instance from "../api/axiosInstance";

interface Member {
  me: boolean;
  role: string;
  userId: number;
  userImg: string | null;
  userName: string;
}

interface Group {
  createdAt: string;
  groupId: number;
  groupTitle: string;
  memberCount: number;
  members: Member[];
  msg: string | null;
  result: boolean;
}
// =================================================================

export interface UserData {
  loginId: string;
  userName: string;
  userPhone: string;
  result: boolean;
  profileUrl?: string;
}

export default function MyPage() {
  const navigate = useNavigate();

  const { logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [edPhone, setEdPhone] = useState<string | undefined>(undefined);

  // ============== 아바타용: PK 숫자 userId 저장 상태 추가 ==============
  const [myPkUserId, setMyPkUserId] = useState<number | undefined>(undefined);
  // =================================================================

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (!res) return;
      // console.log(res.data);
      setUserData(res.data);
    })();

    // ============== 아바타용: 백그라운드 그룹 API에서 내 PK(userId)만 추출 ==============
    (async () => {
      try {
        const res = await instance.get<Group[]>("/group/getGroupList");
        const groupList = res.data;

        if (Array.isArray(groupList)) {
          for (const group of groupList) {
            const me = group.members?.find((m) => m.me === true);
            if (me?.userId) {
              setMyPkUserId(me.userId); // 예: 23 번 추출 완료
              break;
            }
          }
        }
      } catch (error) {
        console.error("아바타용 userId 추출 실패:", error);
      }
    })();
    // ================================================================================
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
    navigate("/login");
  }

  function handleResign() {
    alert("회원탈퇴 구현하기!");
  }

  return (
    <>
      <header>
        <TopNav title="마이페이지" />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="mypage-profile-card">
              <IconButton
                variant="outlined"
                size="s"
                shape="horizontal"
                className="profile-edit-btn"
                onClick={() =>
                  navigate("/editprofile", { state: { userData } })
                }
              >
                <Settings />
              </IconButton>

              <div className="profile-image">
                {/* ============== 아바타용: myPkUserId 전달해서 MakeGroup과 동일 색상 적용 ============== */}
                <Avatar
                  key={myPkUserId || userData?.loginId || "loading"}
                  src={userData?.profileUrl}
                  userId={myPkUserId ?? userData?.loginId ?? userData?.userName}
                  size="l"
                />
                {/* =================================================================================== */}
              </div>

              <h2 className="profile-name">{userData?.userName}</h2>

              <div className="profile-id">
                <span>{userData?.loginId}</span>
                <button onClick={handleCopyId}>
                  {copied ? <LuCheck /> : <LuCopy />}
                </button>
              </div>

              <p className="profile-phone">{edPhone}</p>
            </div>
          </section>
          <section>
            <div className="mypage-shortcut-card">
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
            </div>
          </section>

          <section>
            <div className="mypage-menu-card">
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
            </div>
          </section>

          <div className="mypage-footer">
            <span>버전정보: 1.0.0</span>
            <span className="footer-divider">|</span>

            <button onClick={handleLogout}>로그아웃</button>
            <span className="footer-divider">|</span>

            <button onClick={handleResign}>회원 탈퇴</button>
          </div>
        </div>
      </main>
    </>
  );
}
