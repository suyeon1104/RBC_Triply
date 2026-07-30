import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import '../styles/WalletCreate.css';
import { chargeWallet, getWallet } from '../api/walletApi';
import PageHeader from '../components/PageHeader';
import TopNav from '../components/Navigation/TopNav/TopNav';
import Button from '../components/Button/Button/Button';

const WalletCharge = () => {
  const navigate = useNavigate();

  const [balance, setBalance] = useState(0);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await getWallet();

      setBalance(res.data.balance);
    } catch (e) {
      console.error(e);
    }
  };

  const addAmount = (value: number) => {
    const current = Number(amount || 0);

    setAmount(String(current + value));
  };

  const chargeAmount = Number(amount || 0);

  const handleCharge = async () => {
    if (!amount || Number(amount) <= 0) {
      alert('충전할 금액을 입력해주세요.');
      return;
    }

    try {
      const res = await chargeWallet({
        amount: Number(amount),
      });

      if (res.data.result) {
        alert('충전이 완료되었습니다.');

        navigate('/main');
        return;
      }

      alert('충전에 실패했습니다.');
    } catch (e) {
      console.error(e);

      alert('충전 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header>
        <TopNav title="충전하기" />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="title-content">
              <h2>얼마나 충전할까요?</h2>
              <p className="body1">10,000원 단위로 충전이 가능해요.</p>
            </div>
          </section>

          <section>
            <div className="form-group">
              <label className="body-2">충전금액</label>

              <input
                type="text"
                value={amount}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');

                  setAmount(value);
                }}
                placeholder="충전할 금액을 입력해주세요."
              />

              <div className="charge-buttons">
                <button onClick={() => addAmount(10000)}>+1만원</button>

                <button onClick={() => addAmount(50000)}>+5만원</button>

                <button onClick={() => addAmount(100000)}>+10만원</button>

                <button onClick={() => addAmount(500000)}>+50만원</button>

                <button onClick={() => addAmount(1000000)}>+100만원</button>
              </div>
            </div>

            <div className="after-balance">
              충전 후 지갑 잔액:
              <span>{(balance + chargeAmount).toLocaleString()}원</span>
            </div>
          </section>
        </div>

        <div className="bottom-action-container">
          <Button variant="primary" size="l" onClick={handleCharge}>
            충전하기
          </Button>
        </div>
      </main>
    </>
  );
};

export default WalletCharge;
