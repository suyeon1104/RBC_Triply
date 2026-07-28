import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../api/axiosInstance";
import TripListItem from "../components/listItem/TripListItem/TripListItem";

import BottomNav from "../components/BottomNav";
import Button from "../components/Button/Button/Button";
import "../styles/Planner.css";
import { Plus } from "lucide-react";
import GNB from "../components/Navigation/GNB/GNB";

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

export default function Planner() {
  const [activeTab, setActiveTab] = useState("planner");

  const navigate = useNavigate();
  const location = useLocation();
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    const fetchTripList = async () => {
      try {
        const res = await instance.get<Trip[]>("/trip/getTripList");

        const sortedList = res.data.sort((a, b) => b.tripId - a.tripId);

        // const newTrip = location.state?.newTrip;
        // if (newTrip && !sortedList.some((t) => t.tripId === newTrip.tripId)) {
        //   sortedList = [newTrip, ...sortedList];
        // }
        setTrips(sortedList);
        console.log(sortedList);
      } catch (error) {
        console.error("여행 목록 조회 실패:", error);
      }
    };

    fetchTripList();
  }, [location.state?.tripId]);

  return (
    <>
      <header>
        <GNB />
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

          <div className="floating-button">
            <Button
              variant="primary"
              size="l"
              trailingIcon={<Plus />}
              onClick={() => navigate("/trip/createTrip")}
            >
              플래너 만들기
            </Button>
          </div>
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
