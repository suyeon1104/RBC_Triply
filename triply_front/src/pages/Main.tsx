import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

import "../styles/Main.css";
import { getMyTravelPlans } from "../api/travelApi";
import TravelBanner from "../components/TravelBanner";
import WalletCard from "../components/WalletCard";

export default function Main() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("main");
  const [nearestTrip, setNearestTrip] = useState<any>(null);
  const now = new Date();

  const todayString =
    `${now.getFullYear()}.` +
    `${String(now.getMonth() + 1).padStart(2, "0")}.` +
    `${String(now.getDate()).padStart(2, "0")}(${
      ["일", "월", "화", "수", "목", "금", "토"][now.getDay()]
    })`;

  useEffect(() => {
    fetchNearestTrip();
  }, []);

  const fetchNearestTrip = async () => {
    try {
      const res = await getMyTravelPlans();

      const trips = res.data;
      console.log(res.data);

      if (!trips.length) return;

      const today = new Date();

      const upcomingTrips = trips
        .filter((trip: any) => new Date(trip.endDate) >= today)
        .sort(
          (a: any, b: any) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
        );

      if (upcomingTrips.length > 0) {
        setNearestTrip(upcomingTrips[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container">
      <Header />

      <main className="main-content">
        {/* 여행 배너 */}
        <TravelBanner trip={nearestTrip} todayString={todayString} />

        {/* 지갑 */}
        <WalletCard />

        {/* 정산 */}
        {/* <section className="settlement-banner">
          <div className="settlement-text">
            <span className="highlight-text">2건</span>의 정산이 남아 있어요~~
          </div>

          <button className="settlement-more-button">확인하기 &gt;</button>
        </section> */}
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
