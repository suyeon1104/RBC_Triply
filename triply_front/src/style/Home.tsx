// src/pages/Home.jsx
import { useEffect, useState } from "react";
import { getTravelPlans } from "../api/travelApi";
import { getWallet } from "../api/walletApi";
import { getSettlementSummary } from "../api/settlementApi";

function getTravelBadge(startDate, endDate) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (today < start) {
    const diffDays = Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    return { status: "예정", label: `D-${diffDays}` };
  }
  if (today > end) {
    return { status: "완료", label: "여행 종료" };
  }
  const dayNumber =
    Math.floor((today - start) / (1000 * 60 * 60 * 24)) + 1;
  return { status: "진행중", label: `${dayNumber}일차` };
}

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [travelPlan, setTravelPlan] = useState(null);
  const [settlement, setSettlement] = useState(null);

  useEffect(() => {
    getWallet().then((res) => setWallet(res.data));
    getTravelPlans().then((res) => setTravelPlan(res.data[0]));
    getSettlementSummary().then((res) => setSettlement(res.data));
  }, []);

  if (!wallet || !travelPlan || !settlement) return <div>로딩중...</div>;

  const badge = getTravelBadge(travelPlan.startDate, travelPlan.endDate);

  // 미정산 내역 합계가 정산 요약의 미정산 금액과 일치하는지 검증
  const unpaidTotal = settlement.unpaidList.reduce(
    (sum, item) => sum + Math.abs(item.amount),
    0
  );
  const isConsistent = unpaidTotal === settlement.unpaidAmount;

  return (
    <div>
      <div>
        <span>{badge.status}</span>
        <span>{badge.label}</span>
        <h3>{travelPlan.title}</h3>
      </div>

      <div>내 지갑 {wallet.balance.toLocaleString()}원</div>

      <div>
        <div>정산 완료 {settlement.completedAmount.toLocaleString()}원</div>
        <div>미정산 {settlement.unpaidAmount.toLocaleString()}원</div>
        {!isConsistent && (
          <p style={{ color: "red" }}>
            미정산 내역 합계가 요약 금액과 일치하지 않습니다. 백엔드 확인 필요.
          </p>
        )}
      </div>
    </div>
  );
}