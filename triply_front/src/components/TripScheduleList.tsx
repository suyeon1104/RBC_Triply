import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, HelpCircle } from 'lucide-react';
import Button from './Button/Button/Button';
import '../styles/RecentTransaction.css'; // 기존 스타일 파일 공유 혹은 별도 지정

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

const categoriesEmoji = [
  { value: "관광", emoji: "📍", label: "관광" },
  { value: "식사", emoji: "🍽️", label: "식사" },
  { value: "숙소", emoji: "🏨", label: "숙소" },
  { value: "쇼핑", emoji: "🛍️", label: "쇼핑" },
  { value: "이동", emoji: "🚌", label: "이동" },
  { value: "기타", emoji: "✨", label: "기타" },
];

interface TripScheduleListProps {
  schedules: Schedule[];
  tripId?: number | string;
  startDate?: string;
  endDate?: string;
}

export default function TripScheduleList({ schedules = [], tripId, startDate, endDate }: TripScheduleListProps) {
  const navigate = useNavigate();

  // 날짜 포맷 함수
  const formatTime = (timeStr: string) => {
    return timeStr ? timeStr.substring(0, 5) : '';
  };

  // 카테고리에 맞는 이모지를 찾아주는 함수 (없으면 기본 이모지 📅 출력)
  const getCategoryEmoji = (category: string) => {
    const found = categoriesEmoji.find((item) => item.value === category);
    return found ? found.emoji : '📅';
  };

  return (
    <section className="recent-transaction">
      <div className="recent-header">
        <h4>여행 스케줄 목록</h4>
      </div>

      {schedules.length === 0 ? (
        <div className="recent-empty">
          <HelpCircle className="empty-icon" size={64} />
          <p className="empty-text">등록된 여행 스케줄이 없어요.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {schedules.map((schedule) => (
            <div key={schedule.scheduleId} className="transaction-item">
              {/* 카테고리별 이모지 표시 영역 */}
              <div className="transaction-icon payment">
                {getCategoryEmoji(schedule.category)}
              </div>

              <div className="transaction-info">
                <div className="transaction-title">{schedule.scheduleTitle}</div>
                <div className="transaction-subtitle">장소 : {schedule.schedulePlace}</div>
                <div className="transaction-subtitle">날짜 : {schedule.scheduleDate}</div>
                <div className="transaction-subtitle">
                  시간 : {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </div>
              </div>

              {/* 상세보기 버튼 */}
              <Button
                variant="subtle"
                size="s"
                trailingIcon={<ChevronRight />}
                onClick={() => {
                  navigate(`/trip/schedule/${schedule.scheduleId}`, {
                    state: {
                      startDate,
                      endDate,
                      schedule,
                    },
                  });
                }}
              >
                상세보기
              </Button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}