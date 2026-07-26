import { useNavigate } from "react-router-dom";
import { checkSettlement } from "../api/settlementApi";

interface Props {
  paymentId: number;
}

export default function SettlementButton({ paymentId }: Props) {
  const navigate = useNavigate();

  const handleClick = async () => {
    try {
      const res = await checkSettlement(paymentId);

      if (res.data.result) {
        navigate(`/settlement/create/${paymentId}`);
        return;
      }

      alert(res.data.msg);

      navigate("/wallet");
    } catch (e) {
      console.error(e);

      alert("정산 가능 여부 확인 중 오류가 발생했습니다.");

      navigate(-1);
    }
  };

  return (
    <button className="settlement-btn" onClick={handleClick}>
      정산하기
    </button>
  );
}
