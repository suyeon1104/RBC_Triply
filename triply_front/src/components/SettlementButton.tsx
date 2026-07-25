import { useNavigate } from "react-router-dom";

interface Props {
  paymentId: number;
}

export default function SettlementButton({ paymentId }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    // 대충 정산하는 곳 페이지로 전달예정
    navigate(`/settlement/create/${paymentId}`);
  };

  return (
    <button className="settlement-btn" onClick={handleClick}>
      정산하기
    </button>
  );
}
