import React, { useEffect, useRef, useState } from "react";
import TopNav from "../components/Navigation/TopNav/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import { getTripDetail } from "../api/tripApi";
import Button from "../components/Button/Button/Button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getGroupMembers } from "../api/groupApi";
import TripScheduleList from "../components/TripScheduleList";
import TripTransactionList from "../components/TripTransactionList";
import "../styles/TripDetail.css";

const tripPlaceImages: Record<string, string> = {
  한국: "/image/korea.jpg",
  일본: "/image/japan.jpg",
  미국: "/image/newyork.jpg",
  대만: "/image/taiwan.jpg",
  홍콩: "/image/hongkong.jpg",
  태국: "/image/thailand.jpg",
  말레이시아: "/image/malaysia.jpg",
  이탈리아: "/image/italy.jpg",
  프랑스: "/image/paris.jpg",
  독일: "/image/neuschwanstein.jpg",
  오스트리아: "/image/austria.jpg",
};
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
  const [toggle, setToggle] = useState<string>("plan");
  const [selectedDay, setSelectedDay] = useState<string>("all");
  const dayFilterRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  // 날짜별 스케줄
  const tripDays = React.useMemo(() => {
    if (!tripInfo) return [];

    const days: string[] = [];
    const current = new Date(tripInfo.startDate);
    const end = new Date(tripInfo.endDate);

    while (current <= end) {
      days.push(current.toISOString().split("T")[0]); // yyyy-MM-dd
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [tripInfo]);

  const filteredSchedules =
    selectedDay === "all"
      ? (tripInfo?.schedules ?? [])
      : (tripInfo?.schedules ?? []).filter(
          (schedule) => schedule.scheduleDate === selectedDay,
        );

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
        console.error("그룹 멤버 조회 실패:", error);
      }
    };

    fetchGroupMembers();
  }, [tripInfo?.groupId]);

  return (
    <>
      <header>
        <TopNav
          title={tripInfo?.tripTitle || "계획 상세"}
          // showRightButton={true} rightButtonIcon={isOwner ? <Settings /> : <LogOut />}
        />
        <div className="d-day-buttons">
          <div className="day-filter" ref={dayFilterRef}>
            <span
              className={`day-item ${selectedDay === "all" ? "active" : ""}`}
              onClick={() => setSelectedDay("all")}
            >
              All
            </span>

            {tripDays.map((day, index) => {
              const isSelected = selectedDay === day;

              return (
                <span
                  key={day}
                  className={`day-item ${isSelected ? "active" : ""}`}
                  onClick={() => setSelectedDay(day)}
                >
                  {isSelected
                    ? `D+${index + 1}`
                    : String(index + 1).padStart(2, "0")}
                </span>
              );
            })}
          </div>

          <div className="day-move">
            <ChevronLeft
              size={20}
              onClick={() =>
                dayFilterRef.current?.scrollBy({
                  left: -120,
                  behavior: "smooth",
                })
              }
            />

            <ChevronRight
              size={20}
              onClick={() =>
                dayFilterRef.current?.scrollBy({
                  left: 120,
                  behavior: "smooth",
                })
              }
            />
          </div>
        </div>
      </header>
      <main className="page">
        <div className="container">
          <div className="trip-image">
            <img
              src={
                tripPlaceImages[tripInfo?.tripPlace ?? ""] ??
                "/image/defaultImage.png"
              }
              alt={tripInfo?.tripPlace ?? "여행 이미지"}
            />
          </div>
          <div className="trip-info-section">
            <div className="trip-info">
              <div className="trip-info-left">
                <h2>{tripInfo?.tripTitle}</h2>

                <p className="trip-date">
                  {tripInfo?.startDate} - {tripInfo?.endDate} |{" "}
                  {selectedDay === "all"
                    ? "All"
                    : `D+${
                        tripDays.findIndex((day) => day === selectedDay) + 1
                      }`}
                </p>

                <p>{tripInfo?.tripPlace}</p>

                {tripInfo?.groupId && (
                  <p>
                    with {tripInfo.groupTitle} ({groupMemberCount}명)
                  </p>
                )}
              </div>

              {tripInfo?.groupId && (
                <Button
                  variant="subtle"
                  size="s"
                  trailingIcon={<ChevronRight size={16} />}
                  onClick={() => navigate(`/group/${tripInfo.groupId}`)}
                >
                  멤버 보기
                </Button>
              )}
            </div>

            <div className="trip-toggle">
              <button
                className={toggle === "plan" ? "active" : ""}
                onClick={() => setToggle("plan")}
              >
                여행 계획
              </button>

              <button
                className={toggle === "expend" ? "active" : ""}
                onClick={() => setToggle("expend")}
              >
                지출 내역
              </button>
            </div>

            <div className="trip-content">
              {toggle === "plan" ? (
                <TripScheduleList
                  schedules={filteredSchedules}
                  tripId={tripId}
                />
              ) : (
                <TripTransactionList tripId={tripId ?? -1} />
              )}
            </div>
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
