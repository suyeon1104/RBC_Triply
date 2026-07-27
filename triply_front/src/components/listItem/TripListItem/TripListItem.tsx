import './TripListItem.css';

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
  return (
    <div className="trip-item">
      <div>
        <div className="tripp-title">
          {trip.tripTitle}
          &#40;at {trip.tripPlace}&#41;
        </div>

        <div className="trip-member">
          {/* <span className="trip-member-label">멤버 :</span> {trip.map((tr) => tr.).join(', ')} */}
        </div>
      </div>
      {/* 정상 항목 개수 반영해서 수정 필요 */}
      <div className="trip-settlement">
        <span className="trip-settlement-count">2건</span> 정산대기
      </div>
    </div>
  );
};

export default TripListItem;
