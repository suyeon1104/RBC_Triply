import React, { useEffect, useState } from 'react';
import instance from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import TopNav from '../components/Navigation/TopNav/TopNav';
import IconButton from '../components/Button/IconButton/IconButton';
import { ChevronRight, LogOut, Settings, X } from 'lucide-react';
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

// 멤버 초대 API 응답 인터페이스
interface InviteResponse {
  groupName: string;
  invitationId: number;
  receiverName: string;
  senderName: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

const GroupDetail = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [groupInfo, setGroupInfo] = useState<GroupInfo | null>(null);
  const [settlementType, setSettlementType] = useState<'receive' | 'send' | 'empty'>('empty');
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [consumedAmount, setConsumedAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [details, setDetails] = useState<DetailItem[]>([]);

  // 💡 모달 상태 관리
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false); // 탈퇴/삭제 모달
  const [showInviteModal, setShowInviteModal] = useState<boolean>(false); // 멤버 초대 모달
  const [inviteLoginId, setInviteLoginId] = useState<string>(''); // 초대할 아이디

  // 💡 초대 대기 중인 멤버 목록 (API 호출 성공 시 로컬에 누적)
  const [pendingMembers, setPendingMembers] = useState<InvitedMember[]>([]);

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

  // 방장 여부 확인
  const isOwner = groupInfo?.members?.some((m) => m.me && m.role === 'OWNER');

  // 삭제/탈퇴 처리 API
  const handleConfirmAction = async () => {
    if (!groupId) return;

    try {
      if (isOwner) {
        const res = await instance.post('/api/v1/group/deleteGroup', {
          groupId: Number(groupId),
        });
        alert(res.data.msg || '그룹 삭제가 완료되었습니다.');
      } else {
        const res = await instance.post('/api/v1/group/leaveGroup', {
          groupId: Number(groupId),
        });
        alert(res.data.msg || '그룹 탈퇴가 완료되었습니다.');
      }

      setShowConfirmModal(false);
      navigate('/group');
    } catch (error: any) {
      console.error('그룹 처리 실패:', error);
      alert(error.response?.data?.msg || '요청 처리 중 오류가 발생했습니다.');
    }
  };

  // 💡 멤버 초대 API 호출
  const handleInviteMember = async () => {
    if (!inviteLoginId.trim()) {
      alert('초대할 유저의 아이디를 입력해주세요.');
      return;
    }

    try {
      const res = await instance.post<InviteResponse>('/api/v1/group/inviteGroup', {
        groupId: Number(groupId),
        loginId: inviteLoginId,
      });

      // API 응답 데이터를 바탕으로 대기중 멤버 목록에 추가
      const newPendingMember: InvitedMember = {
        userId: res.data.invitationId, // 임시 키값으로 사용
        receiverName: res.data.receiverName,
        memberRole: '멤버',
        status: 'PENDING', // 승인 대기 중
      };

      setPendingMembers((prev) => [...prev, newPendingMember]);
      alert(`${res.data.receiverName}님에게 초대를 보냈습니다.`);

      // 모달 닫기 및 입력 필드 초기화
      setInviteLoginId('');
      setShowInviteModal(false);
    } catch (error: any) {
      console.error('멤버 초대 실패:', error);
      alert(error.response?.data?.msg || '멤버 초대에 실패했습니다.');
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
        <TopNav title={groupInfo?.groupTitle || '그룹 상세'} showRightButton={true} rightButtonIcon={isOwner ? <Settings /> : <LogOut />} onRightButtonClick={() => setShowConfirmModal(true)} />
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
              <h4>그룹 멤버 ({(groupInfo?.memberCount || 0) + pendingMembers.length})</h4>
              <Button variant="subtle" size="s" trailingIcon={<ChevronRight />}>
                정렬하기
              </Button>
            </div>
            <div className="member-content">
              <div className="member-list">
                {/* 1. 기존 가입 완료된 멤버 목록 */}
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

                {/* 2. 신규 초대(승인 대기 중) 멤버 목록 */}
                {pendingMembers.map((pending, idx) => (
                  <MemberListItem key={`pending-${idx}`} member={pending} />
                ))}
              </div>
              <div className="action-area">
                <Button variant="primary" size="l" onClick={() => setShowInviteModal(true)}>
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

      {/* 💡 1. 그룹 삭제 / 탈퇴 확인 모달 */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <IconButton variant="subtle" size="l" shape="horizontal" onClick={() => setShowConfirmModal(false)}>
                <X color="var(--gray-950)" />
              </IconButton>
            </div>
            <div className="modal-body">
              <h3>{groupInfo?.groupTitle || '그룹'}</h3>
              <h2>{isOwner ? '그룹을 삭제하시겠습니까?' : '그룹을 나가시겠습니까?'}</h2>
              <hr />
              <p className="settlement-description">{isOwner ? '삭제 시 그룹 정보 및 정산 기록이 모두 삭제됩니다.' : '탈퇴 후에도 언제든 다시 초대받아 입장할 수 있어요.'}</p>
              <div className="modal-buttons">
                <Button variant="outlined" size="l" className="later-btn" onClick={() => setShowConfirmModal(false)}>
                  취소
                </Button>
                <Button variant="primary" size="l" className="charge-btn" onClick={handleConfirmAction}>
                  {isOwner ? '삭제하기' : '나가기'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 💡 2. 멤버 초대 (아이디 입력) 모달 */}
      {showInviteModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal">
            <div className="modal-header">
              <IconButton variant="subtle" size="l" shape="horizontal" onClick={() => setShowInviteModal(false)}>
                <X color="var(--gray-950)" />
              </IconButton>
            </div>
            <div className="modal-body">
              <h3>멤버 초대</h3>
              <h2>초대할 아이디를 입력하세요</h2>

              {/* 아이디 입력 인풋 */}
              <div className="invite-input-container">
                <input type="text" placeholder="아이디 입력" value={inviteLoginId} onChange={(e) => setInviteLoginId(e.target.value)} className="invite-input" />
              </div>

              <hr />

              <div className="modal-buttons">
                <Button variant="outlined" size="l" className="later-btn" onClick={() => setShowInviteModal(false)}>
                  취소
                </Button>
                <Button variant="primary" size="l" className="charge-btn" onClick={handleInviteMember}>
                  초대하기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GroupDetail;
