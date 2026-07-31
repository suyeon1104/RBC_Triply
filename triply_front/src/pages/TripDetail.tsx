import React, { useEffect, useState } from 'react';
import TopNav from '../components/Navigation/TopNav/TopNav';
import { useNavigate, useParams } from 'react-router-dom';
import ImageFrame from '../components/ImageFrame/ImageFrame';
import { getTripDetail } from '../api/tripApi';
import Button from '../components/Button/Button/Button';
import { ChevronRight, Plus } from 'lucide-react';
import { getGroupMembers } from '../api/groupApi';
import TripScheduleList from '../components/TripScheduleList';
import TripTransactionList from '../components/TripTransactionList';

interface Schedule {
  scheduleId: number;
  scheduleDate: string;
  startTime: string;
  endTime: string;
  scheduleTitle: string;
  schedulePlace: string;
  scheduleDetail: string;
  category: string;
}

interface TripInfo {
  tripId: number;
  tripTitle: string;
  tripPlace: string;
  tripImg: string;
  startDate: string;
  endDate: string;

  groupId: number;
  groupTitle: string;

  schedules: Schedule[];

  // userId : number;
  createdAt: string;
}

export const TripDetail = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [tripInfo, setTripInfo] = useState<TripInfo | null>(null);
  const [groupMemberCount, setGroupMemberCount] = useState<number>(0); // 멤버 수 상태 추가
  const [toggle, setToggle] = useState<string>('plan');

  const navigate = useNavigate();

  // 1. 여행 상세 정보 조회
  useEffect(() => {
    const getTrip = async () => {
      try {
        const res = await getTripDetail(Number(tripId));
        if (!res?.data) return;
        setTripInfo(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getTrip();
  }, [tripId]);

  // 2. tripInfo가 세팅되고 groupId가 존재할 때 그룹 멤버 조회
  useEffect(() => {
    if (!tripInfo?.groupId) return;

    const fetchGroupMembers = async () => {
      try {
        const res = await getGroupMembers(tripInfo.groupId);
        // 서버 응답 구조에 맞게 수정 (예: res.data가 배열이거나 멤버 목록을 담고 있는 경우)
        if (res?.data) {
          setGroupMemberCount(res.data.length);
        }
      } catch (error) {
        console.error('그룹 멤버 조회 실패:', error);
      }
    };

    fetchGroupMembers();
  }, [tripInfo?.groupId]);

  function toggleButton() {
    if (toggle === 'plan') {
      setToggle('expend');
    } else {
      setToggle('plan');
    }
  }

  return (
    <>
      <header>
        <TopNav
          title={tripInfo?.tripTitle || '계획 상세'}
          // showRightButton={true} rightButtonIcon={isOwner ? <Settings /> : <LogOut />}
        />
        <div className="d-day-buttons">
          <div className="d-day-tab">
            <Button variant="subtle" size="s">
              All
            </Button>
          </div>
          <div>좌우 버튼</div>
        </div>
      </header>
      <main className="page">
        <div className="container">
          <ImageFrame src="/assets/maru.png" size="l" />
          <div>
            <h2>{tripInfo?.tripTitle}</h2>
            <p>
              {tripInfo?.startDate} - {tripInfo?.endDate}
            </p>
            <p>{tripInfo?.tripPlace}</p>
            <p>
              with {tripInfo?.groupTitle}({groupMemberCount}명)
            </p>
            <Button onClick={() => navigate(`/group/${tripInfo?.groupId}`)} variant="subtle" size="s" trailingIcon={<ChevronRight />}>
              멤버 보기
            </Button>
            <hr />
            <button onClick={toggleButton}>{toggle === 'plan' ? <p>여행 계획</p> : <p>지출 내역</p>}</button>
            {toggle === 'plan' ? (
              // tripInfo?.schedules.map((schedule) => (
              //     <React.Fragment key={schedule.scheduleId}>
              //         {/* <ImageFrame src="/assets/maru.png" /> */}
              //       <p>{schedule.scheduleTitle}</p>
              //       <p>장소 : {schedule.schedulePlace}</p>
              //       <p>날짜 : {schedule.scheduleDate}</p>
              //       <p>시간 : {schedule.startTime} - {schedule.endTime}</p>

              //     </React.Fragment>
              //   )
              // )
              <TripScheduleList schedules={tripInfo?.schedules ?? []} tripId={tripId} />
            ) : (
              <>
                <TripTransactionList tripId={tripId ?? -1} />
              </>
            )}
          </div>

          <div className="floating-button">
            <Button
              variant="primary"
              size="l"
              trailingIcon={<Plus />}
              onClick={() =>
                navigate(`/trip/${tripId}/schedule/new`, {
                  state: {
                    startDate: tripInfo?.startDate,
                    endDate: tripInfo?.endDate,
                  },
                })
              }
            >
              계획 추가하기
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};
