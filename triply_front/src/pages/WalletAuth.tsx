import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/WalletCreate.css';
import { useEffect, useRef, useState } from 'react';
import { createWallet, verifyAccount } from '../api/walletApi';
import TopNav from '../components/Navigation/TopNav/TopNav';
import Button from '../components/Button/Button/Button';

const WalletAuth = () => {
  const [depositName, setDepositName] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [codes, setCodes] = useState(['', '', '', '']);

  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];
  const navigate = useNavigate();
  const location = useLocation();

  const accountNumber = location.state?.accountNumber ?? '';

  const formatAccountNumber = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, '-');
  };

  // 1. API 호출로 depositName 받아오기
  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await verifyAccount();
        console.log('verifyAccount 응답:', res.data);

        const name = res.data?.depositName || 'TRIP4827';
        setDepositName(name);
      } catch (e) {
        console.error('계좌 인증 조회 실패:', e);
        // API 실패 시 테스트용 디폴트값 설정
        setDepositName('TRIP4827');
      }
    };

    fetchVerify();
  }, []);

  // 2. depositName이 채워지면 알림 팝업 타이머 동작
  useEffect(() => {
    if (!depositName) return;

    // 1초 뒤 알림 켜기
    const showTimer = setTimeout(() => {
      setShowDeposit(true);
    }, 1000);

    // 5초 뒤 알림 끄기 (1초 + 4초)
    const hideTimer = setTimeout(() => {
      setShowDeposit(false);
    }, 5000);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [depositName]);

  const handleCodeChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleAuth = async () => {
    const inputCode = codes.join('');
    const code = depositName.slice(-4);

    if (inputCode !== code) {
      alert('입금자명 뒤 4자리를 다시 확인해주세요.');
      return;
    }

    try {
      const res = await createWallet();

      if (res.data.result) {
        alert('지갑 생성이 완료되었습니다.');
        navigate('/main');
        return;
      }

      alert('지갑 생성에 실패했습니다.');
    } catch (e) {
      console.error(e);
      alert('지갑 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header>
        <TopNav title="계좌 인증" />
      </header>

      <main className="page">
        <div className="container">
          <div className="wallet-create">
            {showDeposit && (
              <div className="deposit-popup">
                <div className="popup-title">🔔 입금 알림</div>
                <div className="popup-content">
                  <strong>{depositName}</strong> 님이 <strong>1원</strong>을 입금했어요
                </div>
              </div>
            )}

            <section>
              <div className="title-content">
                <h2>1원을 보냈어요!</h2>
                <p className="body-1">입금내역에 표시된 숫자 4자리를 입력해주세요.</p>
              </div>
            </section>

            <section className="create-content">
              <div className="account-form">
                <div className="deposit-example">
                  <div className="deposit-title">입금자명</div>
                  <div className="deposit-name">
                    TRIP<span>4827</span>
                  </div>
                  <p>입금자명 뒤 4자리 숫자를 입력해주세요.</p>
                </div>

                <div className="auth-account">{formatAccountNumber(accountNumber)}</div>

                <div className="auth-inputs">
                  <input ref={inputRefs[0]} type="text" maxLength={1} inputMode="numeric" value={codes[0]} onChange={(e) => handleCodeChange(0, e.target.value)} />
                  <input ref={inputRefs[1]} type="text" maxLength={1} inputMode="numeric" value={codes[1]} onChange={(e) => handleCodeChange(1, e.target.value)} />
                  <input ref={inputRefs[2]} type="text" maxLength={1} inputMode="numeric" value={codes[2]} onChange={(e) => handleCodeChange(2, e.target.value)} />
                  <input ref={inputRefs[3]} type="text" maxLength={1} inputMode="numeric" value={codes[3]} onChange={(e) => handleCodeChange(3, e.target.value)} />
                </div>
              </div>
            </section>

            <div className="bottom-action-container">
              <Button variant="primary" size="l" onClick={handleAuth}>
                계좌 인증하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default WalletAuth;
