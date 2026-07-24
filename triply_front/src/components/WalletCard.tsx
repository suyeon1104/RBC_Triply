import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/WalletCard.css";
import { getWallet } from "../api/walletApi";

export default function WalletCard() {
  const navigate = useNavigate();

  const [wallet, setWallet] = useState<any>(null);

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await getWallet();
      setWallet(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="wallet-card">
      <div className="wallet-header">
        <h3 className="wallet-title">나의 지갑</h3>

        <button className="more-button" onClick={() => navigate("/wallet")}>
          전체보기 &gt;
        </button>
      </div>

      <div className="wallet-body">
        <div className="balance">
          {wallet?.exists
            ? `${wallet.balance.toLocaleString()}원`
            : "지갑이 없습니다."}
        </div>
      </div>

      <div className="wallet-actions">
        {wallet?.exists ? (
          <>
            <button
              className="charge-button"
              onClick={() => navigate("/wallet/charge")}
            >
              충전하기
            </button>

            <button className="pay-button" onClick={() => navigate("/payment")}>
              결제하기
            </button>
          </>
        ) : (
          <button
            className="pay-button"
            onClick={() => navigate("/wallet/create")}
          >
            지갑 생성하기
          </button>
        )}
      </div>
    </section>
  );
}
