import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance'; // 프로젝트 내 axios 인스턴스 경로에 맞게 수정
import '../styles/RecentTransaction.css';
import SettlementButton from './SettlementButton';
import { HelpCircle } from 'lucide-react';

interface TripTransactionListProps {
  tripId: number | string;
}

export default function TripTransactionList({ tripId }: TripTransactionListProps) {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    if (tripId) {
      fetchTripTransactions();
    }
  }, [tripId]);

  const fetchTripTransactions = async () => {
    try {
      const res = await axiosInstance.get(`/payment/trip/${tripId}`);
      // API 응답 구조에 맞게 데이터 세팅 (예: res.data 또는 res.data.content 등)
      setTransactions(res.data);
    } catch (e) {
      console.error("여행별 결제 내역 조회 실패:", e);
    }
  };

  const getTitle = (item: any) => {
    return item.merchantName ?? '결제';
  };

  const getSubTitle = (item: any) => {
    return item.tripPlace ?? item.category ?? '';
  };

  const getAmount = (item: any) => {
    const amount = item.amount ?? 0;
    return `-${amount.toLocaleString()}원`;
  };

  return (
    <section className="recent-transaction">
      <div className="recent-header">
        <h4>여행 지출 내역</h4>
      </div>

      {transactions.length === 0 ? (
        <div className="recent-empty">
          <HelpCircle className="empty-icon" size={64} />
          <p className="empty-text">해당 여행의 지출 내역이 없어요.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((item) => (
            <div key={item.paymentId ?? item.transactionId} className="transaction-item">
              <div className="transaction-icon payment">💳</div>

              <div className="transaction-info">
                <div className="transaction-amount minus">
                  <span className="krw-amount">{getAmount(item)}</span>

                  {item.currency && item.foreignAmount && (
                    <span className="foreign-amount">
                      | {item.foreignAmount.toLocaleString()} {item.currency}
                    </span>
                  )}
                </div>

                <div className="transaction-title">{getTitle(item)}</div>

                {getSubTitle(item) && <div className="transaction-subtitle">{getSubTitle(item)}</div>}
              </div>

              {item.paymentId && <SettlementButton paymentId={item.paymentId} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}