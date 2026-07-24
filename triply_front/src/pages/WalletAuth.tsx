import { useLocation, useNavigate } from "react-router-dom";

import "../styles/WalletCreate.css";
import { useEffect, useRef, useState } from "react";
import { createWallet, verifyAccount } from "../api/walletApi";

const WalletAuth = () => {
  const [depositName, setDepositName] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [codes, setCodes] = useState(["", "", "", ""]);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const navigate = useNavigate();
  const location = useLocation();

  const accountNumber = location.state?.accountNumber ?? "";

  const formatAccountNumber = (number: string) => {
    return number.replace(/\B(?=(\d{3})+(?!\d))/g, "-");
  };

  useEffect(() => {
    const fetchVerify = async () => {
      try {
        const res = await verifyAccount();

        const name = res.data.depositName;

        setDepositName(name);

        setTimeout(() => {
          setShowDeposit(true);
        }, 1000);

        setTimeout(() => {
          setShowDeposit(false);
        }, 5000);
      } catch (e) {
        console.error(e);
      }
    };

    fetchVerify();
  }, []);

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
    const inputCode = codes.join("");

    const code = depositName.slice(-4);

    if (inputCode !== code) {
      alert("입금자명 뒤 4자리를 다시 확인해주세요.");
      return;
    }

    try {
      const res = await createWallet();

      if (res.data.result) {
        alert("지갑 생성이 완료되었습니다.");

        navigate("/main");
        return;
      }

      alert("지갑 생성에 실패했습니다.");
    } catch (e) {
      console.error(e);

      alert("지갑 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container">
      <main className="wallet-create">
        <div className="create-top">
          <button className="back-btn" onClick={() => navigate(-1)}>
            ←
          </button>

          <h2>계좌 인증</h2>
        </div>
        {/* 가짜 팝업 */}
        {showDeposit && (
          <div className="deposit-popup">
            <div className="popup-title">🔔 입금 알림</div>

            <div className="popup-content">
              <strong>{depositName}</strong>
              님이
              <strong>1원</strong>을 입금했어요
            </div>
          </div>
        )}

        <div className="create-content">
          <div className="account-form">
            <div className="account-description">
              <h3>1원을 보냈어요!</h3>

              <p>
                입금내역에 표시된 숫자 4자리를
                <br />
                입력해주세요.
              </p>
            </div>

            <div className="deposit-example">
              <div className="deposit-title">입금자명</div>

              <div className="deposit-name">
                TRIP<span>4827</span>
              </div>

              <p>입금자명 뒤 4자리 숫자를 입력해주세요.</p>
            </div>

            <div className="auth-account">
              {formatAccountNumber(accountNumber)}
            </div>

            <div className="auth-inputs">
              <input
                ref={inputRefs[0]}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={codes[0]}
                onChange={(e) => handleCodeChange(0, e.target.value)}
              />

              <input
                ref={inputRefs[1]}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={codes[1]}
                onChange={(e) => handleCodeChange(1, e.target.value)}
              />

              <input
                ref={inputRefs[2]}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={codes[2]}
                onChange={(e) => handleCodeChange(2, e.target.value)}
              />

              <input
                ref={inputRefs[3]}
                type="text"
                maxLength={1}
                inputMode="numeric"
                value={codes[3]}
                onChange={(e) => handleCodeChange(3, e.target.value)}
              />
            </div>
          </div>

          <button className="account-btn" onClick={handleAuth}>
            확인
          </button>
        </div>
      </main>
    </div>
  );
};

export default WalletAuth;
