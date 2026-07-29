import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getWalletHistory } from '../api/walletApi';
import '../styles/RecentTransaction.css';
import SettlementButton from './SettlementButton';
import { ChevronRight, HelpCircle } from 'lucide-react';
import Button from './Button/Button/Button';

export default function RecentTransaction() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    fetchWalletHistory();
  }, []);

  const fetchWalletHistory = async () => {
    try {
      const res = await getWalletHistory();
      setTransactions(res.data.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const getTitle = (item: any) => {
    switch (item.type) {
      case 'CHARGE':
        return '지갑 충전';

      case 'PAYMENT':
        return item.merchantName ?? '결제';

      case 'SETTLEMENT_IN':
        return `${item.counterpartyName}님에게 정산받음`;

      case 'SETTLEMENT_OUT':
        return `${item.counterpartyName}님에게 정산`;

      default:
        return '';
    }
  };

  const getSubTitle = (item: any) => {
    switch (item.type) {
      case 'PAYMENT':
        return item.tripPlace ?? '';

      case 'CHARGE':
        return '계좌 충전';

      default:
        return '';
    }
  };

  const getAmount = (item: any) => {
    switch (item.type) {
      case 'CHARGE':
      case 'SETTLEMENT_IN':
        return `+${item.amount.toLocaleString()}원`;

      case 'PAYMENT':
      case 'SETTLEMENT_OUT':
        return `-${item.amount.toLocaleString()}원`;

      default:
        return `${item.amount.toLocaleString()}원`;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);

    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <section className="recent-transaction">
      <div className="recent-header">
        <h4>최근 지갑 내역</h4>

        {transactions.length > 0 && (
          <Button variant="subtle" size="s" trailingIcon={<ChevronRight />} onClick={() => navigate('/wallet/history')}>
            전체보기
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="recent-empty">
          <HelpCircle className="empty-icon" size={64} />
          <p className="empty-text">최근 지갑 내역이 없어요.</p>
        </div>
      ) : (
        <div className="transaction-list">
          {transactions.map((item) => (
            <div key={item.transactionId} className="transaction-item">
              <div className={`transaction-icon ${item.type === 'CHARGE' ? 'charge' : item.type === 'PAYMENT' ? 'payment' : 'settlement'}`}>{item.type === 'CHARGE' ? '💰' : item.type === 'PAYMENT' ? '💳' : '🤝'}</div>

              <div className="transaction-info">
                <div className={`transaction-amount ${item.type === 'CHARGE' || item.type === 'SETTLEMENT_IN' ? 'plus' : 'minus'}`}>
                  <span className="krw-amount">{getAmount(item)}</span>

                  {item.type === 'PAYMENT' && item.currency && item.foreignAmount && (
                    <span className="foreign-amount">
                      | {item.foreignAmount.toLocaleString()} {item.currency}
                    </span>
                  )}
                </div>

                <div className="transaction-title">{getTitle(item)}</div>

                {getSubTitle(item) && <div className="transaction-subtitle">{getSubTitle(item)}</div>}
              </div>
              {/* 
              <div className="transaction-date">
                {formatDate(item.transactionAt)}
              </div> */}

              {item.type === 'PAYMENT' && <SettlementButton paymentId={item.paymentId} />}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
