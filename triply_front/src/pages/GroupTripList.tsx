import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import instance from "../api/axiosInstance";

import TopNav from "../components/Navigation/TopNav/TopNav";
import TripListItem, {
  type Trip,
} from "../components/listItem/TripListItem/TripLIstItem";

import "../styles/Planner.css";

export default function GroupTripList() {
  const { groupId } = useParams<{ groupId: string }>();
  const location = useLocation();

  const [trips, setTrips] = useState<Trip[]>([]);

  const groupTitle = location.state?.groupTitle || "그룹 여행";

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupTrips = async () => {
      try {
        const res = await instance.get<Trip[]>(`/trip/group/${groupId}`);

        const sortedList = res.data
          .map((trip) => ({
            ...trip,
            createdAt: trip.createdAt ?? "",
          }))
          .sort((a, b) => b.tripId - a.tripId);

        setTrips(sortedList);
      } catch (error) {
        console.error("그룹 여행 목록 조회 실패:", error);
      }
    };

    fetchGroupTrips();
  }, [groupId]);

  return (
    <>
      <header>
        <TopNav title={groupTitle} showRightButton={false} />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="trip-list">
              {trips.map((trip) => (
                <TripListItem key={trip.tripId} trip={trip} />
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
