import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/WalletCard.css';
import { getWallet } from '../api/walletApi';
import Button from './Button/Button/Button';

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
        <button className="more-button" onClick={() => navigate('/wallet')}>
          전체보기 &gt;
        </button>
      </div>

      <div className="wallet-body">
        <div className="balance">{wallet?.exists ? `${wallet.balance.toLocaleString()}원` : '0원'}</div>

        {!wallet?.exists && <div className="wallet-warning">계좌 연결이 필요해요.</div>}
      </div>

      <div className="wallet-actions">
        {wallet?.exists ? (
          <>
            {/* 충전하기: assistive */}
            <Button variant="assistive" size="l" onClick={() => navigate('/wallet/charge')} className="charge-button">
              충전하기
            </Button>

            {/* 결제하기: primary */}
            <Button variant="primary" size="l" onClick={() => navigate('/payment/pay')} className="pay-button">
              결제하기
            </Button>
          </>
        ) : (
          /* 계좌 연결하기: primary */
          <Button variant="primary" size="l" onClick={() => navigate('/wallet/create')} className="pay-button">
            계좌 연결하기
          </Button>
        )}
      </div>
    </section>
  );
}
