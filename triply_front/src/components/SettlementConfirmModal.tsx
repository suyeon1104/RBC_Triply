import { useNavigate } from "react-router-dom";
import { requestSettlement } from "../api/settlementApi";
import type { MemberShare } from "../pages/SettlementCreate";
import "../styles/SettlementConfirmModal.css";

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

    console.log(data);

    try {
      const res = await requestSettlement(data);

      console.log("정산 요청 성공", res.data);

      alert("정산 요청이 완료되었습니다.");
      // 성공 후 처리
      onClose();

      // 필요하면 홈이나 정산 완료 페이지 이동
      navigate("/main");
    } catch (err) {
      console.error("정산 요청 실패", err);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="settlement-modal">
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h3>정산 요청 확인</h3>

        <div className="settlement-list">
          {settlements.map((item) => {
            const member = members.find((m) => m.userId === item.fromUserId);

            return (
              <div key={item.fromUserId} className="settlement-item">
                <span>{member?.userName}</span>

                <span>₩{item.amount.toLocaleString()}</span>
              </div>
            );
          })}
        </div>

        <button className="settlement-submit" onClick={handleSubmit}>
          정산하기
        </button>
      </div>
    </div>
  );
};

export default SettlementConfirmModal;
