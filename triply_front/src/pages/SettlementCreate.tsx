import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import '../styles/SettlementCreate.css';

import { paymentGet } from '../api/paymentApi';
import { getTripDetail } from '../api/tripApi';
import { getGroupMembers } from '../api/groupApi';
import SettlementMemberList from '../components/SettlementMemberList';
import SettlementConfirmModal from '../components/SettlementConfirmModal';
import TopNav from '../components/Navigation/TopNav/TopNav';
import Button from '../components/Button/Button/Button';

export interface MemberShare {
  userId: number;
  userName: string;
  me: boolean;
  role: string;

  amount: number | '';
  ratio: number | '';
}

const SettlementCreate = () => {
  const { paymentId } = useParams();

  const [loading, setLoading] = useState(true);

  const [type, setType] = useState<'equal' | 'ratio' | 'manual'>('equal');

  const [payment, setPayment] = useState<any>(null);
  const [trip, setTrip] = useState<any>(null);

  const [members, setMembers] = useState<MemberShare[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!paymentId) return;

    fetchSettlementData();
  }, [paymentId]);

  const fetchSettlementData = async () => {
    try {
      setLoading(true);

      const paymentRes = await paymentGet(Number(paymentId));
      const paymentData = paymentRes.data;

      setPayment(paymentData);

      const tripRes = await getTripDetail(paymentData.tripId);
      const tripData = tripRes.data;

      setTrip(tripData);

      const memberRes = await getGroupMembers(tripData.groupId);

      const total = paymentData.krwAmount;

      const per = Math.floor(total / memberRes.data.length);
      const remain = total - per * memberRes.data.length;

      setMembers(
        memberRes.data.map((member: any, index: number) => ({
          userId: member.userId,
          userName: member.userName,
          me: member.me,
          role: member.role,

          amount: index === 0 ? per + remain : per,
          ratio: Number((100 / memberRes.data.length).toFixed(2)),
        })),
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const resetMembers = () => {
    const count = members.length;

    if (count === 0) return;

    const per = Math.floor(totalAmount / count);
    const remain = totalAmount - per * count;

    setMembers((prev) =>
      prev.map((member, index) => ({
        ...member,
        amount: index === 0 ? per + remain : per,
        ratio: Number((100 / count).toFixed(2)),
      })),
    );
  };
  const totalAmount = payment?.krwAmount ?? 0;

  const assignedAmount = useMemo(() => members.reduce((sum, member) => sum + Number(member.amount), 0), [members]);

  const diffAmount = totalAmount - assignedAmount;

  if (loading) {
    return;
    // <div>로딩중...</div>;
  }
  return (
    <>
      <header>
        <TopNav title="정산하기" />
      </header>
      <main className="page">
        <div className="container">
          <section>
            <div className="top-content">
              <div className="title">
                <h4>분담 방식 설정</h4>

                <div className="split-type">
                  <button
                    className={type === 'equal' ? 'active' : ''}
                    onClick={() => {
                      resetMembers();
                      setType('equal');
                    }}
                  >
                    균등 분담
                  </button>

                  <button
                    className={type === 'ratio' ? 'active' : ''}
                    onClick={() => {
                      resetMembers();
                      setType('ratio');
                    }}
                  >
                    비율 분담
                  </button>

                  <button
                    className={type === 'manual' ? 'active' : ''}
                    onClick={() => {
                      resetMembers();
                      setType('manual');
                    }}
                  >
                    직접 입력
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section>
            <SettlementMemberList type={type} members={members} setMembers={setMembers} totalAmount={totalAmount} />

            <div className="summary-card">
              <div className="summary-row">
                <span>총 정산 금액</span>
                <span>₩{totalAmount.toLocaleString()}</span>
              </div>

              <div className="summary-row">
                <span>배분 합계</span>
                <span>₩{assignedAmount.toLocaleString()}</span>
              </div>

              <div className="summary-row last">
                <span>차이</span>

                <span
                  style={{
                    color: diffAmount === 0 ? 'var(--positive)' : 'var(--negative)',
                    fontWeight: 700,
                  }}
                >
                  ₩{Math.abs(diffAmount).toLocaleString()}
                  {diffAmount === 0 && ' ✓'}
                </span>
              </div>
            </div>
          </section>

          <div className="bottom-action-container">
            <Button
              variant="primary"
              size="l"
              className="detail-btn"
              onClick={() => {
                if (diffAmount !== 0) {
                  setErrorMessage('분담 금액의 합계가 결제 금액과 일치하지 않습니다.');

                  setTimeout(() => {
                    setErrorMessage('');
                  }, 3000);

                  return;
                }

                setErrorMessage('');
                setShowModal(true);
              }}
            >
              상계 정산 금액 확인
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            </Button>
          </div>
          {/* 디버깅용 */}
          {/* <div className="payment-id">
          Payment : {payment?.merchantName}
          <br />
          Trip : {trip?.tripTitle}
          <br />
          PaymentId : {paymentId}
        </div> */}
        </div>
        {showModal && <SettlementConfirmModal paymentId={Number(paymentId)} members={members} onClose={() => setShowModal(false)} />}
      </main>
    </>
  );
};

export default SettlementCreate;
