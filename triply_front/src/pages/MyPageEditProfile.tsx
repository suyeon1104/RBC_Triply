import { useEffect, useState } from "react";
import { LuUpload } from "react-icons/lu";
import { useLocation } from "react-router-dom";
import { getProfile, patchProfile, patchPw, phoneCheck } from "../api/authApi";
import TopNav from "../components/Navigation/TopNav/TopNav";
import "../styles/MyPageEditProfile.css";
import Button from "../components/Button/Button/Button";
import { ChevronRight } from "lucide-react";

interface UserData {
  loginId: string;
  userName: string;
  userPhone: string;
  result: boolean;
}

interface LocationState {
  userData: UserData | null;
}

export default function MyPageEditProfile() {
  const location = useLocation();
  const initialData = (location.state as LocationState)?.userData ?? null;
  const [originPhoneNum, setOriginPhoneNum] = useState<string>(
    initialData?.userPhone ?? "",
  );
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [authCode, setAuthCode] = useState<number | null>(null);
  const [inputCode, setInputCode] = useState("");
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneCode, setPhoneCode] = useState<number | null>(null);

  // userData라는 별도 state 없이, 폼 필드 state를 바로 초기값으로 채움
  // const [id, setId] = useState<string>(initialData?.loginId ?? "");
  const [name, setName] = useState<string>(initialData?.userName ?? "");
  const [phoneNum, setPhoneNum] = useState<string>(
    initialData?.userPhone ?? "",
  );
  // 새 전화번호로 변경 ()
  // const [newPhoneNum, setNewPhoneNum] = useState<string>("");

  const [pw, setPw] = useState<string>("");
  const [newPw, setNewPw] = useState<string>("");

  useEffect(() => {
    // location.state로 이미 데이터를 받은 경우엔 API 재호출 불필요
    if (initialData) return;

    let cancelled = false;

    getProfile().then((res) => {
      if (cancelled) return;

      setName(res.data.userName);
      setPhoneNum(res.data.userPhone);
      setOriginPhoneNum(res.data.userPhone);
      setPhoneVerified(true);

      // console.log(res.data);
    });

    return () => {
      cancelled = true; // 언마운트 후 응답 도착 시 setState 방지
    };
  }, []);

  async function editProfile() {
    if (!name || !phoneNum) {
      alert("이름과 휴대전화번호를 모두 입력해주세요");
      return;
    }

    if (phoneNum !== originPhoneNum && !phoneVerified) {
      alert("휴대폰 인증을 완료해주세요.");
      return;
    }

    try {
      const res = await patchProfile({
        userName: name,
        userPhone: phoneNum,
      });

      alert("프로필이 수정되었습니다.");

      setOriginPhoneNum(phoneNum);
      setPhoneVerified(true);
    } catch (err) {
      console.log(err);
    }
  }

  async function confirmPhoneNum() {
    try {
      const res = await phoneCheck();

      setAuthCode(res.data.code);
      setPhoneCode(res.data.code);

      setShowPhonePopup(true);

      setTimeout(() => {
        setShowPhonePopup(false);
      }, 5000);
    } catch {
      alert("인증번호 발송에 실패했습니다.");
    }
  }

  async function editPw() {
    if (!pw || !newPw) {
      alert("현재 비밀번호와 새 비밀번호를 모두 입력해주세요");
      return;
    }
    try {
      const res = await patchPw({ userPw: pw, newUserPw: newPw });

      alert(res.data.msg ?? "비밀번호가 변경되었습니다");

      setPw("");
      setNewPw("");
      setPwModalOpen(false);
    } catch (err: any) {
      const message = err.response?.data?.msg ?? "비밀번호 변경에 실패했습니다";
      alert(message);
    }
  }

  // 모달 닫음
  function closePwModal() {
    setPw("");
    setNewPw("");
    setPwModalOpen(false);
  }

  return (
    <>
      <header>
        <TopNav title="프로필 편집" />
      </header>

      <main className="edit-profile-page">
        {/* 팝업 */}
        {showPhonePopup && (
          <div className="phone-popup">
            <div className="popup-title">🔔 인증번호 도착</div>

            <div className="popup-content">
              인증번호
              <strong>{phoneCode}</strong>를 입력해주세요.
            </div>
          </div>
        )}
        {/* 프로필 */}
        <section className="edit-profile-card">
          <label className="section-label">프로필 이미지</label>

          <div className="edit-profile-image-wrapper">
            <div className="edit-profile-image">
              <img src="/image/Profile.png" alt="프로필" />
            </div>

            <button className="edit-profile-upload-btn">
              <LuUpload
                size={16}
                onClick={() => {
                  alert("이미지 업로드 기능은 추구 구현예정입니다.");
                }}
              />
            </button>
          </div>

          <div className="edit-form-group">
            <label>이름</label>
            <input
              className="edit-form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="edit-form-group">
            <label>휴대폰 번호</label>

            <div className="phone-group">
              <input
                className="edit-form-input"
                value={phoneNum}
                onChange={(e) => {
                  const value = e.target.value;

                  setPhoneNum(value);

                  if (value === originPhoneNum) {
                    setPhoneVerified(true);
                    setInputCode("");
                    setAuthCode(null);
                  } else {
                    setPhoneVerified(false);
                    setInputCode("");
                    setAuthCode(null);
                  }
                }}
              />
              {phoneVerified ? (
                <Button variant="assistive">인증 완료</Button>
              ) : (
                <Button onClick={confirmPhoneNum}>휴대폰 번호 인증</Button>
              )}
            </div>
          </div>

          <div className="edit-form-group">
            <label>인증번호</label>

            <input
              className="edit-form-input"
              value={inputCode}
              onChange={(e) => {
                const value = e.target.value;
                setInputCode(value);

                if (Number(value) === authCode) {
                  setPhoneVerified(true);
                } else {
                  setPhoneVerified(false);
                }
              }}
              placeholder="인증번호 입력"
            />
          </div>
          {/* 비밀번호 수정, 화살표 아이콘 */}
          <div
            className="password-edit-link"
            onClick={() => setPwModalOpen(true)}
          >
            <span>비밀번호 수정</span>
            <ChevronRight size={20} />
          </div>
        </section>

        <div className="edit-profile-bottom">
          <Button className="edit-profile-submit" onClick={editProfile}>
            프로필 수정하기
          </Button>
        </div>
      </main>
      {pwModalOpen && (
        <div className="modal-overlay">
          <div className="password-modal">
            <h3>비밀번호 수정</h3>

            <div className="edit-form-group">
              <label>현재 비밀번호</label>

              <input
                className="edit-form-input"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
              />
            </div>

            <div className="edit-form-group">
              <label>새 비밀번호</label>

              <input
                className="edit-form-input"
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
              />
            </div>

            <div className="modal-button-group">
              <Button variant="assistive" onClick={closePwModal}>
                취소
              </Button>

              <Button onClick={editPw}>변경</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
