import React from 'react';
import { Plus, Minus, Equal, HelpCircle } from 'lucide-react';
import './SettlementList.css';
import { getMappedColor } from '../../Avatar/Avatar';

export interface DetailItem {
  userName: string;
  userId?: number | string;
  type: 'receive' | 'send';
  amount: number;
}

export interface SettlementListProps {
  paidAmount?: number;
  consumedAmount?: number;
  type?: 'receive' | 'send' | 'empty';
  totalAmount?: number;
  details?: DetailItem[];
  emptyMessage?: string;
}

const SettlementList = ({ paidAmount = 0, consumedAmount = 0, type = 'receive', totalAmount = 0, details = [], emptyMessage = '정산 내역이 없어요.' }: SettlementListProps) => {
  if (type === 'empty') {
    return (
      <div className="settlement-empty">
        <HelpCircle className="empty-icon" size={64} />
        <p className="empty-text">{emptyMessage}</p>
      </div>
    );
  }

  const isReceive = type === 'receive';
  const statusColorClass = isReceive ? 'receive' : 'send';
  const statusLabel = isReceive ? '받을 금액' : '보낼 금액';

  return (
    <div className="settlmentlist-container">
      <div className="settlement-row primary-row">
        <div className="settlement-label">
          <Plus size={24} className="icon" />
          <span>결제한 금액</span>
        </div>
        <span className="settlement-value">{paidAmount.toLocaleString()}원</span>
      </div>

      <div className="settlement-row primary-row">
        <div className="settlement-label">
          <Minus size={24} className="icon" />
          <span>소비한 금액</span>
        </div>
        <span className="settlement-value">{consumedAmount.toLocaleString()}원</span>
      </div>

      <div className="settlement-divider" />

      <div className={`settlement-row total-row ${statusColorClass}`}>
        <div className="settlement-label">
          <Equal size={24} className="icon" />
          <span>{statusLabel}</span>
        </div>
        <span className={`settlement-value total-value ${statusColorClass}`}>{totalAmount.toLocaleString()}원</span>
      </div>

      {details.length > 0 && (
        <div className="settlement-details">
          {details.map((item, index) => {
            const isItemReceive = item.type === 'receive';
            const actionText = isItemReceive ? '에게 받을 금액' : '에게 보낼 금액';
            const bulletColor = getMappedColor(item.userId || item.userName);

            return (
              <div key={index} className="detail-row">
                <div className="detail-label">
                  <span className="bullet" style={{ backgroundColor: bulletColor }} />
                  <span className="user-name">{item.userName}</span>
                  <span className="action-text">{actionText}</span>
                </div>
                <span className="detail-value">{item.amount.toLocaleString()}원</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SettlementList;
