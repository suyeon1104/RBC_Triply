import { useNavigate } from "react-router-dom";

interface TravelBannerProps {
  trip: any;
  todayString: string;
}

export default function TravelBanner({ trip, todayString }: TravelBannerProps) {
  const navigate = useNavigate();

  // yyyy-mm-dd -> yyyy.mm.dd
  const formatDate = (date: string) => date.replaceAll("-", ".");

  // D-Day 계산
  const getDDay = (startDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const diff = Math.ceil(
      (start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diff === 0) return "D-Day";
    return `D-${diff}`;
  };

  if (!trip) {
    return (
      <section className="banner">
        <div className="banner-text-container">
          <span className="banner-date">Today is {todayString}</span>

          <h2 className="banner-title">
            Make your
            <br />
            Destination
          </h2>

          <p className="banner-subtitle">멤버들과 함께 여행을 떠나보세요.</p>
        </div>

        <button
          className="plan-button"
          onClick={() => navigate("/planner/create")}
        >
          여행 계획 만들기
          <span className="plus-icon">+</span>
        </button>
      </section>
    );
  }

  return (
    <section className="banner">
      <div className="banner-text-container">
        <span className="banner-date">
          Today is {todayString} | {getDDay(trip.startDate)}
        </span>

        <h2 className="banner-title">{trip.tripTitle}</h2>

        <p className="banner-period">
          {formatDate(trip.startDate)} ~ {formatDate(trip.endDate)}
        </p>

        <p className="banner-subtitle">{trip.tripPlace}</p>
      </div>

      <button
        className="plan-button"
        onClick={() => navigate(`/planner/${trip.tripId}`)}
      >
        여행 상세보기
      </button>
    </section>
  );
}
