import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import instance from "../api/axiosInstance";
import Button from "../components/Button/Button/Button";
import TopNav from "../components/Navigation/TopNav/TopNav";
import { Check } from "lucide-react";
import "../styles/CreateTrip.css";
import type Group from "./Group";
import { getTripList } from "../api/tripApi";
// import IconButton from '../components/Button/IconButton/IconButton';
// import MemberListItem, { type InvitedMember } from '../components/listItem/MemberList/MemberListItem';

// interface ExtendedInvitedMember extends InvitedMember {
//   loginId: string;
// }

const tripPlaceList: string[] = [
  "한국",
  "일본",
  "미국",
  "대만",
  "홍콩",
  "태국",
  "말레이시아",
  "이탈리아",
  "프랑스",
  "독일",
  "오스트리아",
];

const CreateTrip = () => {
  // const navigate = useNavigate();
  const [tripTitle, setTripTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [tripPlace, setTripPlace] = useState("");
  const [connectedGroup, setConnectedGroup] = useState<Group | null>(null);
  const [connectGroupList, setConnectGroupList] = useState<Group[]>([]);

  // 사용자가 등록해둔 그룹 목록 불러오기
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await instance.get<Group[]>("/group/getGroupList");
        setConnectGroupList(res.data);
      } catch (error) {
        console.error("그룹 목록 조회 실패:", error);
      }
    };

    fetchGroups();
  }, []);

  function handleGroupChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedId = e.target.value;

    if (!selectedId) {
      setConnectedGroup(null);
      return;
    }

    const selected = connectGroupList.find(
      (group) => String(group.groupId) === selectedId,
    );
    setConnectedGroup(selected ?? null);
  }

  const handleCreateTrip = async () => {
    if (!tripTitle.trim()) {
      alert("여행 이름을 입력해주세요.");
      return;
    }

    try {
      console.log("try");
      // const res = getTripList();
    } catch (error) {
      console.error("그룹 생성 및 멤버 초대 실패:", error);
      alert("여행 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <header>
        <TopNav
          title="플래너 만들기"
          rightButtonIcon={<Check />}
          onRightButtonClick={handleCreateTrip}
        />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="title-Content">
              <h3>플래너를 만들어보세요.</h3>
              <p className="body1">
                그룹을 연결하고 친구들과
                <br />
                정산과 일정을 함께 관리하세요.
              </p>
            </div>
          </section>

          <section>
            {/* 플래너 이름 */}
            <div className="input-content">
              <label className="body2">
                플래너 이름<span className="required">*</span>
              </label>
              <input
                type="text"
                placeholder="플래너의 제목을 적어주세요."
                value={tripTitle}
                onChange={(e) => setTripTitle(e.target.value)}
              />
            </div>

            {/* 기간 */}
            <div className="input-content">
              <label className="body2">
                기간<span className="required">*</span>
              </label>
              <div className="flex flex-row gap-3">
                <input
                  type="date"
                  placeholder="0000.00.00"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />{" "}
                -
                <input
                  type="date"
                  placeholder="0000.00.00"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>

            {/* 여행지 */}
            <div className="input-content">
              <label htmlFor="TripPlace" className="body2">
                여행지<span className="required">*</span>
              </label>
              <select
                value={tripPlace}
                id="tripPlace"
                onChange={(e) => setTripPlace(e.target.value)}
              >
                {tripPlaceList.map((tripPlace) => (
                  <option key={tripPlace} value={tripPlace}>
                    {tripPlace}
                  </option>
                ))}
              </select>
            </div>

            {/* 그룹 연결 */}
            <div className="input-content">
              <label htmlFor="connectedGroup" className="body2">
                그룹 연결
              </label>
              <select
                id="connectedGroup"
                value={connectedGroup?.groupId ?? ""}
                onChange={handleGroupChange}
              >
                <option value="">미선택 시 개인 여행 계획으로 추가돼요.</option>
                {connectGroupList.map((group) => (
                  <option key={group.groupId} value={group.groupId}>
                    {group.groupTitle}
                  </option>
                ))}
              </select>
            </div>
            {/* 
            <div className="input-content">
              <label className="body2">멤버 초대</label>
              <div className="invite-input-wrapper">
                <input type="text" placeholder="초대할 멤버의 아이디를 입력해주세요." value={inviteInput} onChange={(e) => setInviteInput(e.target.value)} onKeyDown={handleKeyDown} />
                <IconButton variant="subtle" shape="horizontal" onClick={handleAddMember}>
                  <Plus color="var(--gray-950)" />
                </IconButton>
              </div>
            </div> */}
          </section>

          {/* <section>
            <div className="memberList">
              {members.map((member) => (
                <MemberListItem key={member.loginId} member={member} onDelete={() => handleDeleteMember(member.loginId)} />
              ))}
            </div>
          </section> */}

          <div className="bottom-action-container">
            <Button variant="primary" size="l" onClick={handleCreateTrip}>
              여행 생성
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default CreateTrip;
