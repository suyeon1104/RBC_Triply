import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/WalletCreate.css";

const WalletCreate = () => {
  const navigate = useNavigate();

  const [bank, setBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  const bankRef = useRef<HTMLSelectElement>(null);
  const accountRef = useRef<HTMLInputElement>(null);

  const handleNext = () => {
    if (!bank) {
      bankRef.current?.focus();
      return;
    }

    if (!accountNumber) {
      accountRef.current?.focus();
      return;
    }

    if (accountNumber.length < 10 || accountNumber.length > 14) {
      accountRef.current?.focus();
      alert("계좌번호는 10~14자리 숫자로 입력해주세요.");
      return;
    }

    navigate("/wallet/auth", {
      state: {
        accountNumber,
      },
    });
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

        <div className="create-content">
          <div className="account-form">
            <div className="account-description">
              <h3>
                은행 계좌 인증을
                <br />
                진행해 주세요.
              </h3>

              <p>
                회원님의 실명과 계좌에 등록된 이름이
                <br />
                일치해야만 인증이 가능합니다.
              </p>
            </div>

            <div className="form-group">
              <label>
                은행<span>*</span>
              </label>

              <select
                ref={bankRef}
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              >
                <option value="">은행을 선택해주세요</option>

                <option value="국민은행">국민은행</option>

                <option value="신한은행">신한은행</option>

                <option value="우리은행">우리은행</option>

                <option value="하나은행">하나은행</option>

                <option value="NH농협은행">NH농협은행</option>

                <option value="카카오뱅크">카카오뱅크</option>

                <option value="토스뱅크">토스뱅크</option>

                <option value="케이뱅크">케이뱅크</option>
              </select>
            </div>

            <div className="form-group">
              <label>
                계좌번호<span>*</span>
              </label>

              <input
                ref={accountRef}
                type="text"
                inputMode="numeric"
                value={accountNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, "");

                  if (value.length <= 14) {
                    setAccountNumber(value);
                  }
                }}
                placeholder="계좌번호를 입력해주세요"
              />
            </div>
          </div>

          <button className="account-btn" onClick={handleNext}>
            계좌 연결하기
          </button>
        </div>
      </main>
    </div>
  );
};

export default WalletCreate;
