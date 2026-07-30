import React, { useEffect, useState } from "react";
import TopNav from "../components/Navigation/TopNav/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import ImageFrame from "../components/ImageFrame/ImageFrame";
import { getTripDetail } from "../api/tripApi";
import Button from "../components/Button/Button/Button";
import { ChevronRight, Plus } from "lucide-react";
import RecentTransaction from "../components/RecentTransaction";

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
  const [toggle, setToggle] = useState<string>("plan");

  const navigate = useNavigate();

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
  }, []);

  function toggleButton() {
    if (toggle === "plan") {
      setToggle("expend");
    } else {
      setToggle("plan");
    }
  }

  return (
    <>
      <header>
        <TopNav
          title={tripInfo?.tripTitle || "계획 상세"}
          // showRightButton={true} rightButtonIcon={isOwner ? <Settings /> : <LogOut />}
        />
      </header>
      <main className="page">
        <div className="d-day-buttons">
          <div>D-day 버튼 모음</div>
          <div>좌우 버튼</div>
        </div>
        <ImageFrame src="/assets/maru.png" size="l" />
        <div>
          <h2>{tripInfo?.tripTitle}</h2>
          <p>
            {tripInfo?.startDate} - {tripInfo?.endDate}
          </p>
          <p>{tripInfo?.tripPlace}</p>
          <p>
            with {tripInfo?.groupTitle}({}명)
          </p>
          <Button variant="subtle" size="s" trailingIcon={<ChevronRight />}>
            멤버 보기
          </Button>
          <hr />
          <button onClick={toggleButton}>
            {toggle === "plan" ? <p>여행 계획</p> : <p>지출 내역</p>}
          </button>
          {toggle === "plan" ? (
            tripInfo?.schedules.map((schedule) => (
                <React.Fragment key={schedule.scheduleId}>
                    {/* <ImageFrame src="/assets/maru.png" /> */}
                  <p>{schedule.scheduleTitle}</p>
                  <p>장소 : {schedule.schedulePlace}</p>
                  <p>날짜 : {schedule.scheduleDate}</p>
                  <p>시간 : {schedule.startTime} - {schedule.endTime}</p>

                </React.Fragment>
              )
            )
          ) : (
            <>
              <RecentTransaction />
            </>
          )}
        </div>
        
        <div className="floating-button">
          <Button
            variant="primary"
            size="l"
            trailingIcon={<Plus />}
            onClick={() => navigate("/trip/createSchedule")}
          >
            계획 추가하기
          </Button>
        </div>
      </main>
    </>
  );
};
