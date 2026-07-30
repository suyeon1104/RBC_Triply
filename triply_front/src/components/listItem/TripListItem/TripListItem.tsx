import { useEffect, useState } from "react";
import "./TripListItem.css";
import { getGroupDetail } from "../../../api/groupApi";
import ImageFrame from "../../ImageFrame/ImageFrame";

interface Trip {
  createdAt: string;
  endDate: string;
  groupId?: number | null; // null이나 undefined 가능성 반영
  result: boolean;
  startDate: string;
  tripId: number;
  tripPlace: string;
  tripTitle: string;
}

interface TripListItemProps {
  trip: Trip;
  handlePlanDetail: (tripId: number) => void;
}

const TripListItem = ({ trip, handlePlanDetail }: TripListItemProps) => {
  const [tripGroupName, setTripGroupName] = useState("");
  const [tripGroupMemberNum, setTripGroupMemberNum] = useState<number>(0);

  useEffect(() => {
    // [핵심 방어 코드] groupId가 없거나 null/undefined면 API를 절대 호출하지 않음!
    if (!trip.groupId) return;

    let ignore = false;

    const fetchTripListItem = async () => {
      try {
       const res = await getGroupDetail(trip.groupId!);
        if (!res?.data || ignore) return;
        setTripGroupName(res.data.groupTitle);
        setTripGroupMemberNum(res.data.members.length);
      } catch (e) {
        if (!ignore) console.error(e);
      }
    };

    fetchTripListItem();

    return () => {
      ignore = true;
    };
  }, [trip.groupId]); // trip 전체 대신 trip.groupId만 감시하도록 수정

  return (
    <div className="trip-item" onClick={() => handlePlanDetail(trip.tripId)}>
      <div>이미지</div>
      <ImageFrame src="/assets/maru.png" />
      {/* 우측 여행 정보 */}
      <div>
        <div className="trip-title">
          {trip.tripTitle}
        </div>

        <div className="trip-period">
          {trip.startDate.split("-").join(".")} - {trip.endDate.split("-").join(".")}
        </div>
        <div className="trip-place">
          {trip.tripPlace}
        </div>
        <br />
        <div className="trip-settlement">
          {trip.groupId ? (
            <span className="trip-group-name">
              with {tripGroupName}그룹 ({tripGroupMemberNum}명)
            </span>
          ) : (
            <span className="trip-group-name">
              개인 여행
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TripListItem;