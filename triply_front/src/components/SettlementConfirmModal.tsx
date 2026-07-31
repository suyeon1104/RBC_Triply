import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { requestSettlement } from '../api/settlementApi';
import type { MemberShare } from '../pages/SettlementCreate';
import Button from '../components/Button/Button/Button';
import IconButton from '../components/Button/IconButton/IconButton';
import '../styles/SettlementConfirmModal.css';

interface Props {
  paymentId: number;
  members: MemberShare[];
  onClose: () => void;
}

const SettlementConfirmModal = ({ paymentId, members, onClose }: Props) => {
  const navigate = useNavigate();

  const settlements = members
    .filter((member) => !member.me)
    .filter((member) => Number(member.amount) > 0)
    .map((member) => ({
      fromUserId: member.userId,
      amount: Number(member.amount),
    }));

  const handleSubmit = async () => {
    const data = {
      paymentId: Number(paymentId),
      settlements,
    };

    try {
      const res = await requestSettlement(data);
      console.log('정산 요청 성공', res.data);

      alert('정산 요청이 완료되었습니다.');
      onClose();
      navigate('/main');
    } catch (err) {
      console.error('정산 요청 실패', err);
    }
  };

  return (
    <div className="settlement-confirm-modal-overlay">
      <div className="settlement-confirm-modal">
        {/* 헤더 영역 */}
        <div className="settlement-confirm-modal-header">
          <h3>정산 요청 확인</h3>
          <IconButton variant="subtle" size="l" shape="horizontal" onClick={onClose}>
            <X color="var(--gray-950)" />
          </IconButton>
        </div>

        {/* 바디 영역 */}
        <div className="settlement-confirm-modal-body">
          <div className="settlement-confirm-modal-list">
            {settlements.map((item) => {
              const member = members.find((m) => m.userId === item.fromUserId);

              return (
                <div key={item.fromUserId} className="settlement-confirm-modal-item">
                  <span className="settlement-confirm-modal-item-name">{member?.userName}</span>
                  <span className="settlement-confirm-modal-item-amount">₩{item.amount.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 푸터 영역 */}
        <div className="settlement-confirm-modal-footer">
          <Button variant="primary" size="l" className="settlement-confirm-modal-submit" onClick={handleSubmit}>
            정산하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SettlementConfirmModal;
