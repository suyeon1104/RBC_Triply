import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getProfile, patchProfile, patchPw, phoneCheck } from '../api/authApi';
import TopNav from '../components/Navigation/TopNav/TopNav';
import '../styles/MyPageEditProfile.css';
import Button from '../components/Button/Button/Button';
import { ChevronRight, Upload, X } from 'lucide-react';
import IconButton from '../components/Button/IconButton/IconButton';

// ============== 아바타 구현용: 컴포넌트 및 Axios 추가 ==============
import Avatar from '../components/Avatar/Avatar';
import instance from '../api/axiosInstance';

interface Member {
  me: boolean;
  userId: number;
}
interface Group {
  members: Member[];
}
// =================================================================

interface UserData {
  loginId: string;
  userName: string;
  userPhone: string;
  result: boolean;
  profileUrl?: string;
}

interface LocationState {
  userData: UserData | null;
}

export default function MyPageEditProfile() {
  const location = useLocation();
  const navigate = useNavigate();

  const initialData = (location.state as LocationState)?.userData ?? null;

  const [originPhoneNum, setOriginPhoneNum] = useState<string>(initialData?.userPhone ?? '');
  const [phoneVerified, setPhoneVerified] = useState(true);
  const [authCode, setAuthCode] = useState<number | null>(null);
  const [inputCode, setInputCode] = useState('');
  const [pwModalOpen, setPwModalOpen] = useState(false);
  const [showPhonePopup, setShowPhonePopup] = useState(false);
  const [phoneCode, setPhoneCode] = useState<number | null>(null);

  const [name, setName] = useState<string>(initialData?.userName ?? '');
  const [phoneNum, setPhoneNum] = useState<string>(initialData?.userPhone ?? '');

  // ============== 아바타 구현용: PK 숫자 userId 및 유저 정보 상태 추가 ==============
  const [myPkUserId, setMyPkUserId] = useState<number | undefined>(undefined);
  const [profileUrl, setProfileUrl] = useState<string | undefined>(initialData?.profileUrl);
  const [loginId, setLoginId] = useState<string>(initialData?.loginId ?? '');
  // =================================================================

  const [pw, setPw] = useState<string>('');
  const [newPw, setNewPw] = useState<string>('');

  useEffect(() => {
    // ============== 아바타 구현용: 그룹 API에서 내 PK(userId) 추출 ==============
    (async () => {
      try {
        const res = await instance.get<Group[]>('/group/getGroupList');
        if (Array.isArray(res.data)) {
          for (const group of res.data) {
            const me = group.members?.find((m) => m.me === true);
            if (me?.userId) {
              setMyPkUserId(me.userId);
              break;
            }
          }
        }
      } catch (error) {
        console.error('아바타용 userId 추출 실패:', error);
      }
    })();
    // ========================================================================

    if (!initialData) {
      let cancelled = false;

      getProfile().then((res) => {
        if (cancelled) return;

        setName(res.data.userName);
        setPhoneNum(res.data.userPhone);
        setOriginPhoneNum(res.data.userPhone);
        setProfileUrl(res.data.profileUrl);
        setLoginId(res.data.loginId);
        setPhoneVerified(true);
      });

      return () => {
        cancelled = true;
      };
    }
  }, [initialData]);

  async function editProfile() {
    if (!name || !phoneNum) {
      alert('이름과 휴대전화번호를 모두 입력해주세요');
      return;
    }

    if (phoneNum !== originPhoneNum && !phoneVerified) {
      alert('휴대폰 인증을 완료해주세요.');
      return;
    }

    try {
      await patchProfile({
        userName: name,
        userPhone: phoneNum,
      });

      alert('프로필이 수정되었습니다.');

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
      alert('인증번호 발송에 실패했습니다.');
    }
  }

  async function editPw() {
    if (!pw || !newPw) {
      alert('현재 비밀번호와 새 비밀번호를 모두 입력해주세요');
      return;
    }
    try {
      const res = await patchPw({ userPw: pw, newUserPw: newPw });

      alert(res.data.msg ?? '비밀번호가 변경되었습니다');

      setPw('');
      setNewPw('');
      setPwModalOpen(false);
      navigate('/mypage');
    } catch (err: any) {
      const message = err.response?.data?.msg ?? '비밀번호 변경에 실패했습니다';
      alert(message);
    }
  }

  function closePwModal() {
    setPw('');
    setNewPw('');
    setPwModalOpen(false);
  }

  return (
    <>
      <header>
        <TopNav title="프로필 편집" />
      </header>

      <main className="page">
        <div className="container">
          {/* 프로필 */}
          <section className="edit-profile-card">
            <label className="body2">프로필 이미지</label>

            <div className="edit-profile-image-wrapper">
              <div className="edit-profile-image">
                {/* ============== 아바타 구현용: Avatar 컴포넌트 적용 ============== */}
                <Avatar key={myPkUserId || loginId || 'loading'} src={profileUrl} userId={myPkUserId ?? loginId ?? name} size="m" />
                {/* ================================================================ */}
              </div>

              <IconButton variant="assistive" size="s" shape="horizontal" className="edit-profile-upload-btn" style={{ backgroundColor: 'var(--gray-950)' }}>
                <Upload
                  color="white"
                  onClick={() => {
                    alert('이미지 업로드 기능은 추후 구현 예정입니다.');
                  }}
                />
              </IconButton>
            </div>

            <div className="edit-form-group">
              <label>이름</label>
              <input className="edit-form-input" value={name} onChange={(e) => setName(e.target.value)} />
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
                      setInputCode('');
                      setAuthCode(null);
                    } else {
                      setPhoneVerified(false);
                      setInputCode('');
                      setAuthCode(null);
                    }
                  }}
                />
                {phoneVerified ? (
                  <Button variant="outlined" size="l" style={{ backgroundColor: 'var(--white)' }}>
                    인증 완료
                  </Button>
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

            <div className="password-edit-link">
              <Button variant="subtle" size="l" trailingIcon={<ChevronRight />} onClick={() => setPwModalOpen(true)}>
                비밀번호 수정
              </Button>
            </div>
          </section>

          <div className="bottom-action-container">
            <Button variant="primary" size="l" className="edit-profile-submit" onClick={editProfile}>
              프로필 수정하기
            </Button>
          </div>
        </div>
      </main>

      {pwModalOpen && (
        <div className="pw-modal-overlay">
          <div className="pw-modal">
            <div className="modal-header">
              <h3 className="pw-modal-title">비밀번호 수정</h3>
              <IconButton variant="subtle" size="l" shape="horizontal" onClick={closePwModal}>
                <X color="var(--gray-950)" />
              </IconButton>
            </div>
            <div className="pw-modal-body">
              <div className="edit-form-group" style={{ textAlign: 'left', marginTop: '16px' }}>
                <label>현재 비밀번호</label>
                <input className="edit-pw-input" type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="현재 비밀번호 입력" />
              </div>

              <div className="edit-form-group" style={{ textAlign: 'left', marginTop: '12px' }}>
                <label>새 비밀번호</label>
                <input className="edit-pw-input" type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="새 비밀번호 입력" />
              </div>

              <div className="modal-buttons">
                <Button variant="outlined" size="l" className="later-btn" onClick={closePwModal}>
                  취소
                </Button>
                <Button variant="primary" size="l" className="charge-btn" onClick={editPw}>
                  변경하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPhonePopup && (
        <div className="phone-popup">
          <div className="popup-title">🔔 인증번호 도착</div>
          <div className="popup-content">
            인증번호 <strong>{phoneCode}</strong>를 입력해주세요.
          </div>
        </div>
      )}
    </>
  );
}
