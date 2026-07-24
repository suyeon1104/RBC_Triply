import { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import PageHeader from "../components/PageHeader";
import "../styles/PaymentPay.css";
import SettlementButton from "../components/SettlementButton";
import { paymentCreate } from "../api/paymentApi";
import { getWallet } from "../api/walletApi";
import { useNavigate } from "react-router";

const PaymentPay = () => {
  const [showQr, setShowQr] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [payment, setPayment] = useState<any>(null);
  const [paymentError, setPaymentError] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(async () => {
      try {
        const res = await paymentCreate();

        if (!res.data.result) {
          alert(res.data.msg);
          return;
        }

        setPayment(res.data);

        setShowQr(false);
        setShowModal(true);
      } catch (e: any) {
        const walletRes = await getWallet();

        setCurrentBalance(walletRes.data.balance);

        setPaymentError(true);

        setShowQr(false);
        setShowModal(true);
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      <main className="payment-pay">
        <PageHeader title="결제하기" />

        <div className="payment-content">
          {showQr && (
            <div className="qr-card">
              <div className="fake-qr">
                <QRCodeCanvas value="TRIPLY_PAYMENT" size={180} />
              </div>

              <p>매장 단말기에 스캔하면 실시간 환율로 자동 결제돼요.</p>
            </div>
          )}
        </div>
        {showModal && (
          <div className="payment-modal-overlay">
            <div className="payment-modal">
              <button className="modal-close" onClick={() => navigate("/main")}>
                ×
              </button>
              {paymentError ? (
                <>
                  <h4 className="payment-fail">결제 실패</h4>

                  <h3>잔액이 부족해요.</h3>

                  <p className="merchant-name">
                    현재 잔액: {currentBalance.toLocaleString()}원
                  </p>

                  <hr />

                  <p className="settlement-title">
                    결제를 위해 충전이 필요해요
                  </p>

                  <p className="settlement-desc">
                    충전 후 다시 결제를 시도해보세요
                  </p>

                  <div className="modal-buttons">
                    <button
                      className="later-btn"
                      onClick={() => navigate("/main")}
                    >
                      확인
                    </button>

                    <button
                      className="charge-btn"
                      onClick={() => navigate("/wallet/charge")}
                    >
                      충전하기
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4>결제완료</h4>

                  <h3>
                    {payment?.krwAmount.toLocaleString()}원 | {payment?.amount}
                    {payment?.currency}
                  </h3>

                  <p className="merchant-name">{payment?.merchantName}</p>

                  <hr />

                  <p className="settlement-title">
                    지금 바로 정산을 진행할까요?
                  </p>

                  <p className="settlement-desc">
                    보류하시더라도 언제든지 정산을 완료할 수 있어요.
                  </p>

                  <div className="modal-buttons">
                    <button
                      className="later-btn"
                      onClick={() => navigate("/main")}
                    >
                      나중에 하기
                    </button>

                    <SettlementButton paymentId={payment?.paymentId} />
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default PaymentPay;
