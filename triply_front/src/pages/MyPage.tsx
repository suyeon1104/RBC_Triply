import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/useAuth";
import { useEffect, useState } from "react";
import { getProfile } from "../api/authApi";

interface UserData {
  loginId: string;
  userName: string;
  userPhone: string;
  result: boolean;
}


export default function MyPage() {
  const navigate = useNavigate();

  const {logout } = useAuth();
  const [copied, setCopied] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  // const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    (async () => {
      const res = await getProfile();
      if (!res) return;
      console.log(res.data);
      setUserData(res.data);
    })();
  }, []);

  // user mock data
  // -> 실제로는 /getProfile API 응답으로 대체

  // const user = {
  //   name: "김수연",
  //   loginId: "suyeon123",
  //   phone: "010-1234-5678",
  // };


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
      <p>id: {userData?.loginId}</p>
      <p>name: {userData?.userName}</p>
      <p>phone: {userData?.userPhone}</p>
      <p>result: {userData?.result}</p>

    </>
  );
};