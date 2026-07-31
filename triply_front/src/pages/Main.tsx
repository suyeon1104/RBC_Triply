import { useEffect, useState } from "react";

import BottomNav from "../components/BottomNav";

import "../styles/Main.css";
import { getTripList } from "../api/tripApi";
import TravelBanner from "../components/TravelBanner";
import WalletCard from "../components/WalletCard";
import GNB from "../components/Navigation/GNB/GNB";

export default function Main() {
  const [activeTab, setActiveTab] = useState("main");
  const [nearestTrip, setNearestTrip] = useState<any>(null);
  const now = new Date();

  const todayString =
    `${now.getFullYear()}.` +
    `${String(now.getMonth() + 1).padStart(2, "0")}.` +
    `${String(now.getDate()).padStart(2, "0")}(${["일", "월", "화", "수", "목", "금", "토"][now.getDay()]})`;

  useEffect(() => {
    fetchNearestTrip();
  }, []);

  const fetchNearestTrip = async () => {
    try {
      const res = await getTripList();

      const trips = res.data;
      // console.log(res.data);

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
    <>
      <header>
        <GNB />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="hero-banner">
              {/* 여행 배너 */}
              <TravelBanner trip={nearestTrip} todayString={todayString} />
            </div>
          </section>

          <section>
            {/* 지갑 */}
            <WalletCard />
          </section>

          {/* 정산 */}
          {/* <section className="settlement-banner">
          <div className="settlement-text">
            <span className="highlight-text">2건</span>의 정산이 남아 있어요~~
          </div>

          <button className="settlement-more-button">확인하기 &gt;</button>
        </section> */}
        </div>
      </main>

      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}
