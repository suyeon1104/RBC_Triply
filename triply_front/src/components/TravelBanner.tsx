import { useNavigate } from 'react-router-dom';
import Button from './Button/Button/Button';
import { Plus } from 'lucide-react';

interface TravelBannerProps {
  trip: any;
  todayString: string;
}

export default function TravelBanner({ trip, todayString }: TravelBannerProps) {
  const navigate = useNavigate();

  // yyyy-mm-dd -> yyyy.mm.dd
  const formatDate = (date: string) => date.replaceAll('-', '.');

  // D-Day 계산
  const getDDay = (startDate: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const diff = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'D-Day';
    return `D-${diff}`;
  };

  if (!trip) {
    return (
      <section className="banner">
        <div className="banner-text-container">
          <span className="banner-date">Today is {todayString}</span>

          <h1 className="banner-title">
            Make your
            <br />
            Destination
          </h1>

          <p className="banner-subtitle">멤버들과 함께 여행을 떠나보세요.</p>
        </div>

        <Button variant="assistive" size="l" trailingIcon={<Plus size={20} />} onClick={() => navigate('/planner/create')} className="plan-button">
          여행 계획 만들기
        </Button>
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

      <button className="plan-button" onClick={() => navigate(`/planner/${trip.tripId}`)}>
        여행 상세보기
      </button>

      <Button variant="assistive" size="l" trailingIcon={<Plus size={20} />} onClick={() => navigate(`/planner/${trip.tripId}`)} className="plan-button">
        여행 계획 만들기
      </Button>
    </section>
  );
}
