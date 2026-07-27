import { useEffect, useState } from 'react';
import Header from '../components/Header';
import { LuUpload } from 'react-icons/lu';
import { useLocation } from 'react-router-dom';
import { getProfile, patchProfile, patchPw } from '../api/authApi';

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

  // userData라는 별도 state 없이, 폼 필드 state를 바로 초기값으로 채움
  // const [id, setId] = useState<string>(initialData?.loginId ?? "");
  const [name, setName] = useState<string>(initialData?.userName ?? '');
  const [phoneNum, setPhoneNum] = useState<string>(initialData?.userPhone ?? '');
  const [newPhoneNum, setNewPhoneNum] = useState<string>('');

  const [pw, setPw] = useState<string>('');
  const [newPw, setNewPw] = useState<string>('');

  useEffect(() => {
    // location.state로 이미 데이터를 받은 경우엔 API 재호출 불필요
    if (initialData) return;

    let cancelled = false;

    getProfile().then((res) => {
      if (cancelled) return;
      // .then 콜백 안에서 호출 → "비동기 응답에 대한 setState"라 정상 패턴
      setName(res.data.userName);
      setPhoneNum(res.data.userPhone);
      console.log(res.data);
    });

    return () => {
      cancelled = true; // 언마운트 후 응답 도착 시 setState 방지
    };
  }, []);

  async function editProfile() {
    if (!name || !phoneNum) {
      alert('이름과 휴대전화번호를 모두 입력해주세요');
      return;
    }
    try {
      await patchProfile({ userName: name, userPhone: phoneNum }).then((res) => {
        alert(res.data.userName);
      });
    } catch (err: any) {
      console.log(err);
    }
  }
  async function confirmPhoneNum(pn: string) {
    if (pn === phoneNum) {
      alert('정확한 휴대전화 번호입니다.');
    } else {
      alert('정확한 휴대전화 번호를 입력해주세요.');
    }
    try {
      const res = await patchPw({ userPw: pw, newUserPw: newPw });
      alert(res.data.msg ?? '비밀번호가 변경되었습니다');
    } catch (err: any) {
      const message = err.response?.data?.msg ?? '비밀번호 변경에 실패했습니다';
      alert(message);
    }
  }

  return (
    <>
      <div className="flex flex-col w-full max-w-[440px] h-[956px] bg-white mb-5 min-h-screen">
        <Header page={'textOnly'}></Header>
        {/* 전체 화면 */}
        <div className="flex flex-col flex-1 w-[400px] h-[892px] mt-6 gap-2 p-5 items-center">
          {/* 프로필 이미지 설정 */}
          <span>프로필 이미지</span>
          <div className="w-30 h-39 bg-[#FFA90A] rounded-4xl relative">
            <button
              onClick={() => {
                // 프로필 이미지 설정 코드
              }}
              className="absolute -bottom-2.5 -right-1.5 bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
            >
              <LuUpload />
            </button>
          </div>
          {/* 사용자 정보 수정 폼 */}
          {/* 프로필 이미지 적용은 보류 */}
          <form className="flex flex-col gap-3 mt-3">
            {/* 이름 */}
            <label htmlFor="name" className="focus-within:text-[#5D94FD]">
              <div className="flex flex-col gap-2">
                <span>이름</span>
                <input id="name" name="name" value={name} onChange={(e) => setName(e.target.value)} className="border border-[#DCDCDC] rounded-2xl focus:outline-none focus:border-[#5D94FD] p-1.5" placeholder="여행자"></input>
              </div>
            </label>
            {/* 인증용 폰 번호 */}
            {/* 전화번호 확인으로만 일단 진행 */}
            <div className="flex flex-col gap-2 focus-within:text-[#5D94FD]">
              <label htmlFor="phoneNum">
                <div className="flex flex-col gap-2">
                  <span>휴대폰 번호</span>
                  <div className="flex flex-row gap-2">
                    <input id="phoneNum" name="phoneNum" value={phoneNum} onChange={(e) => setPhoneNum(e.target.value)} className="border border-[#DCDCDC] rounded-2xl focus:outline-none focus:border-[#5D94FD] p-1.5" placeholder="전화번호" type="tel"></input>
                    <button onClick={() => confirmPhoneNum(phoneNum)} className="bg-[#F4F4F4] rounded-2xl p-1.5 text-[#7C7C7C]">
                      휴대폰 번호 인증
                    </button>
                  </div>
                  <input
                    id="newPhoneNum"
                    name="newPhoneNum"
                    onChange={(e) => {
                      setPhoneNum(e.target.value);
                    }}
                    className="border border-[#DCDCDC] rounded-2xl focus:outline-none focus:border-[#5D94FD] p-1.5"
                    placeholder="새 전화번호"
                    type="tel"
                  ></input>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={editProfile} className="bg-[#5D94FD] text-white rounded-2xl white w-80 h-12 mt-2.5">
                프로필 편집하기
              </button>
            </div>

            {/* 현재 비번 */}
            <div className="flex flex-col gap-2 mt-5 focus-within:text-[#5D94FD]">
              <label htmlFor="pw">
                <div className="flex flex-col gap-2">
                  <span>현재 비밀번호</span>
                  <input id="pw" name="pw" value={pw} onChange={(e) => setPw(e.target.value)} className="border border-[#DCDCDC] rounded-2xl focus:outline-none focus:border-[#5D94FD] p-1.5" placeholder="현재 비밀번호를 입력하세요" type="password"></input>
                </div>
              </label>
            </div>

            {/* 새 비밀번호 */}
            <div className="flex flex-col gap-2 focus-within:text-[#5D94FD]">
              <label htmlFor="newPw">
                <div className="flex flex-col gap-2">
                  <span>비밀번호 수정</span>
                  <input id="newPw" name="newPw" value={pw} onChange={(e) => setPw(e.target.value)} className="border border-[#DCDCDC] rounded-2xl focus:outline-none focus:border-[#5D94FD] p-1.5" placeholder="수정할 비밀번호를 입력해주세요" type="password"></input>
                  <span className="text-xs text-gray-400">기존 비밀번호를 입력하신 후 새 비밀번호를 입력하세요.</span>
                </div>
              </label>
            </div>
            <div className="flex flex-col items-center">
              <button onClick={editPw} className="bg-red-600 text-white rounded-2xl white w-80 h-12 mt-2.5">
                비밀번호 편집하기
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
