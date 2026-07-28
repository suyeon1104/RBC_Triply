import { useEffect, useState } from "react";
import "./TripListItem.css";
import { getGroupDetail } from "../../../api/groupApi";
import ImageFrame from "../../ImageFrame/ImageFrame";

interface Trip {
  createdAt: string;
  endDate: string;
  groupId: number;
  result: boolean;
  startDate: string;
  tripId: number;
  tripPlace: string;
  tripTitle: string;
}

interface TripListItemProps {
  trip: Trip;
}

const TripListItem = ({ trip }: TripListItemProps) => {
  const [tripGroupName, setTripGroupName] = useState("");
  const [tripGroupMemberNum, setTripGroupMembernNum] = useState("");

  useEffect(() => {
    let ignore = false;

    const fetchTripListItem = async () => {
      try {
        const res = await getGroupDetail(trip.groupId);
        if (!res?.data || ignore) return;
        setTripGroupName(res.data.groupTitle);
        setTripGroupMembernNum(res.data.members.length);
      } catch (e) {
        if (!ignore) console.error(e);
      }
    };

    fetchTripListItem();

    return () => {
      ignore = true;
    };
  }, [trip]);

  return (
    <div className="trip-item">
      <div>이미지</div>
      {/* <ImageFrame src="../../assets/images/maru.png" /> */}
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
          <span className="trip-group-name">
            with {tripGroupName}그룹 ({tripGroupMemberNum}명)
          </span>
        </div>
      </div>
    </div>
  );
};

export default TripListItem;
