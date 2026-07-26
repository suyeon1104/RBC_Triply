import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";
import Header from "../components/Header";
import {
  LuCheck,
  LuCopy,
} from "react-icons/lu";

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
      <div className="flex flex-col w-full max-w-[440px] h-[956px] bg-gray-50 mb-5 min-h-screen">
        <Header page={"textIcon"}></Header>
        {/* 전체 화면 */}
        <div className="flex flex-col flex-1 w-[400px] h-[892px] justify-content items-center gap-4 p-4">
          {/* 사용자 정보 */}
          <div className="flex flex-col bg-white p-3 gap-4 rounded-md">
            <div className="flex flex-row"></div>
            <div className="w-30 h-39 bg-[#FFA90A] rounded-4xl relative">
              {" "}
              <button
                onClick={() => {
                  navigate("/editprofile", {state:{userData:userData}});
                }}
                className="absolute -bottom-2.5 -right-1.5  bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
              >
                ⚙️
              </button>
            </div>
            <div className="flex flex-col mt-2 gap-2 mb-3 items-center">
              <p className="text-3xl font-bold">{userData?.userName}</p>
              <div className="flex flex-row gap-2">
                <span>{userData?.loginId}</span>
                <button
                  onClick={handleCopyId}
                  className="cursor-pointer"
                  aria-label="아이디 복사"
                >
                  {copied ? <LuCheck /> : <LuCopy />}
                </button>
              </div>
              <p className="text-base text-[#7C7C7C]">{edPhone}</p>
            </div>
          </div>
          {/* 세부기능 라인-업 */}
          <div className="flex flex-row bg-white rounded-md gap-3 p-5">
            <div className="flex flex-col items-center cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>계좌 관리</div>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>이용 한도</div>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>환율 정보</div>
            </div>
            <div className="flex flex-col items-center cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>번역기</div>
            </div>
          </div>

          {/* 문서 라인-업 */}
          <div className="flex flex-col bg-white rounded-md gap-3 p-5">
            <div className="flex flex-row items-center gap-2 cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>공지사항</div>
            </div>
            <div className="flex flex-row items-center gap-2 cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>FAQ</div>
            </div>
            <div className="flex flex-row items-center gap-2 cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>이용약관</div>
            </div>
            <div className="flex flex-row items-center gap-2 cursor-pointer">
              <div className="text-2xl">⛶</div>
              <div>오픈소스 라이선스</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="cursor-pointer"
            aria-label="로그아웃"
          >
            로그아웃
          </button>
          <button
            onClick={handleResign}
            className="cursor-pointer"
            aria-label="회원탈퇴"
          >
            회원탈퇴
          </button>
          <span className="text-gray-400">버전정보: 1.0.0</span>
        </div>
      </div>
    </>
  );
}
