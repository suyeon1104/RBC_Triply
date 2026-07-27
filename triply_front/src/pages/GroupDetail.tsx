import React, { useEffect, useState } from 'react';
import instance from '../api/axiosInstance';
import { useParams } from 'react-router-dom';
import TopNav from '../components/Navigation/TopNav/TopNav';
import { ChevronRight, LogOut, Settings } from 'lucide-react';
import Button from '../components/Button/Button/Button';
import MemberListItem, { type InvitedMember } from '../components/listItem/MemberListItem/MemberListItem';
import SettlementList, { type DetailItem } from '../components/listItem/SettlementList/SettlementList';
import '../styles/GroupDetail.css';

interface Member {
  userId: number;
  userName: string;
  userImg: string | null;
  role: string;
  me: boolean;
}

interface GroupInfo {
  groupId: number;
  groupTitle: string;
  createdAt: string;
  memberCount: number;
  members: Member[];
}

interface SettlementResponse {
  settlementId: number;
  paymentId: number;
  fromUserId: number;
  fromUserName: string;
  toUserId: number;
  toUserName: string;
  amount: number;
  status: string;
  myRole: 'SENDER' | 'RECEIVER';
  requestedAt: string;
  completedAt: string | null;
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [settlementType, setSettlementType] = useState<'receive' | 'send' | 'empty'>('empty');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [consumedAmount, setConsumedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [details, setDetails] = useState<DetailItem[]>([]);

  useEffect(() => {
    if (!groupId) return;

    const fetchData = async () => {
      try {
        const groupRes = await instance.get<GroupInfo[]>('/group/getGroupList');
        const targetGroup = groupRes.data.find((g) => g.groupId === Number(groupId));
        if (targetGroup) {
          setGroupInfo(targetGroup);
        }
      } catch (error) {
        console.error(error);
      }

      try {
        const settlementRes = await instance.get<SettlementResponse[]>(`/settlement/group/${groupId}`);
        const list = settlementRes.data;

        if (list && list.length > 0) {
          const total = list.reduce((acc, cur) => acc + cur.amount, 0);
          setTotalAmount(total);

          const mainRole = list[0]?.myRole;
          const isReceiver = mainRole === 'RECEIVER';

          setSettlementType(isReceiver ? 'receive' : 'send');

          if (isReceiver) {
            setPaidAmount(total);
            setConsumedAmount(0);
          } else {
            setPaidAmount(0);
            setConsumedAmount(total);
          }

          const mappedDetails: DetailItem[] = list.map((item) => {
            const isSender = item.myRole === 'SENDER';
            return {
              userId: isSender ? item.toUserId : item.fromUserId,
              userName: isSender ? item.toUserName : item.fromUserName,
              type: isSender ? 'send' : 'receive',
              amount: item.amount,
            };
          });

          setDetails(mappedDetails);
        } else {
          setSettlementType('empty');
        }
      } catch (error) {
        setSettlementType('empty');
      }
    };

    fetchData();
  }, [groupId]);

  const isOwner = groupInfo?.members?.some((m) => m.me && m.role === 'OWNER');

  const handleRightButtonClick = () => {
    if (isOwner) {
      console.log('그룹 설정 화면으로 이동');
    } else {
      console.log('그룹 나가기/탈퇴 처리');
    }
  };

  const handleSettlementAction = () => {
    if (settlementType === 'send') {
      console.log('송금 기능 실행');
    } else {
      console.log('정산 요청 기능 실행');
    }
  };

  return (
    <>
      <header>
        <TopNav title={groupInfo?.groupTitle || '그룹 상세'} showRightButton={true} rightButtonIcon={isOwner ? <Settings /> : <LogOut />} onRightButtonClick={handleRightButtonClick} />
      </header>

      <main className="page">
        <div className="container">
          <section className="group-description">
            <div className="top-content">
              <div className="title">
                <h2>{groupInfo?.groupTitle || '그룹 이름'}</h2>
                <div className="created-time">
                  <p className="body1">
                    생성일: <span className="body1">{groupInfo?.createdAt ? groupInfo.createdAt.split('T')[0] : '-'}</span>
                  </p>
                </div>
                <div className="accompany-planner">
                  <div className="leading">
                    <p className="body2">
                      함께 간 여행들 <span className="body1-bold">0플래너</span>
                    </p>
                  </div>
                  <Button variant="primary" size="m" trailingIcon={<ChevronRight />} style={{ backgroundColor: 'var(--gray-950)' }}>
                    함께 한 플래너
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <section className="member">
            <div className="title">
              <h4>그룹 멤버 ({groupInfo?.memberCount || 0})</h4>
              <Button variant="subtle" size="s" trailingIcon={<ChevronRight />}>
                정렬하기
              </Button>
            </div>
            <div className="member-content">
              <div className="member-list">
                {groupInfo?.members && groupInfo.members.length > 0 ? (
                  groupInfo.members.map((member) => {
                    const itemData: InvitedMember = {
                      userId: member.userId,
                      receiverName: member.userName,
                      profileUrl: member.userImg || undefined,
                      memberRole: member.role === 'OWNER' ? '방장' : '멤버',
                      status: 'ACCEPTED',
                    };
                    return <MemberListItem key={member.userId} member={itemData} />;
                  })
                ) : (
                  <MemberListItem />
                )}
              </div>
              <div className="action-area">
                <Button variant="primary" size="l">
                  멤버 추가하기
                </Button>
              </div>
            </div>
          </section>

          <section className="settlement">
            <div className="title">
              <h4>나의 정산 현황</h4>
              <Button variant="subtle" size="s" trailingIcon={<ChevronRight />}>
                전체보기
              </Button>
            </div>
            <div className="settlement-content">
              <div className="settlement-list">
                <SettlementList paidAmount={paidAmount} consumedAmount={consumedAmount} type={settlementType} totalAmount={totalAmount} details={details} />
              </div>

              {settlementType !== 'empty' && (
                <div className="action-area">
                  <Button variant="primary" size="l" onClick={handleSettlementAction}>
                    {settlementType === 'send' ? '송금하기' : '정산 요청하기'}
                  </Button>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default GroupDetail;
