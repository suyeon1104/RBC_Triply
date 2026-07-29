import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../api/axiosInstance';
import Button from '../components/Button/Button/Button';
import TopNav from '../components/Navigation/TopNav/TopNav';
import { Plus } from 'lucide-react';
import '../styles/MakeGroup.css';
import IconButton from '../components/Button/IconButton/IconButton';
import MemberListItem, { type InvitedMember } from '../components/listItem/MemberListItem/MemberListItem';

interface ExtendedInvitedMember extends InvitedMember {
  loginId: string;
}

const MakeGroup = () => {
  const navigate = useNavigate();
  const [groupTitle, setGroupTitle] = useState('');
  const [inviteInput, setInviteInput] = useState('');
  const [members, setMembers] = useState<ExtendedInvitedMember[]>([]);

  const handleAddMember = async () => {
    const trimmedId = inviteInput.trim();
    if (!trimmedId) return;

    if (members.some((m) => m.loginId === trimmedId)) {
      alert('이미 추가된 멤버입니다.');
      return;
    }

    const newMember: ExtendedInvitedMember = {
      loginId: trimmedId,
      receiverName: trimmedId,
      status: 'INVITING', // ⭕ INVITING 일 때만 우측 삭제(Trash) 버튼 표시
    };

    setMembers((prev) => [...prev, newMember]);
    setInviteInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddMember();
    }
  };

  const handleDeleteMember = (loginIdToDelete: string) => {
    setMembers((prev) => prev.filter((m) => m.loginId !== loginIdToDelete));
  };

  const handleCreateGroup = async () => {
    if (!groupTitle.trim()) {
      alert('그룹 이름을 입력해주세요.');
      return;
    }

    try {
      const createRes = await instance.post('/group/createGroup', {
        groupTitle: groupTitle,
      });

      const newGroupId = createRes.data.groupId;

      if (members.length > 0 && newGroupId) {
        await Promise.all(
          members.map((member) =>
            instance.post('/group/inviteGroup', {
              groupId: newGroupId,
              loginId: member.loginId,
            }),
          ),
        );
      }

      alert('그룹 생성이 완료되었습니다.');

      const newGroup = {
        groupId: newGroupId,
        groupTitle: groupTitle,
        memberCount: members.length + 1,
        createdAt: new Date().toISOString(),
        members: [],
        msg: null,
        result: true,
      };

      navigate('/group', { state: { newGroup } });
    } catch (error) {
      console.error('그룹 생성 및 멤버 초대 실패:', error);
      alert('그룹 생성 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header>
        <TopNav title="그룹 만들기" />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="title-content">
              <h2>그룹을 만들어보세요.</h2>
              <p className="body1">
                그룹을 통해 함께 여행 일정을 확인하고
                <br />
                여행 중에도, 끝난 후에도 빠른 정산이 가능해요.
              </p>
            </div>
          </section>

          <section>
            <div className="makegroup-input-content">
              <label className="body2">
                그룹 이름<span className="required">*</span>
              </label>
              <input type="text" placeholder="그룹 이름을 지어주세요." value={groupTitle} onChange={(e) => setGroupTitle(e.target.value)} className="input" />
            </div>

            <div className="makegroup-input-content">
              <label className="body2">멤버 초대</label>
              <div className="invite-input-wrapper">
                <input type="text" placeholder="초대할 멤버의 아이디를 입력해주세요." value={inviteInput} onChange={(e) => setInviteInput(e.target.value)} onKeyDown={handleKeyDown} className="input" />
                <IconButton variant="subtle" shape="horizontal" onClick={handleAddMember}>
                  <Plus color="var(--gray-950)" />
                </IconButton>
              </div>
            </div>
          </section>

          <section>
            <div className="memberList">
              {members.map((member) => (
                <MemberListItem key={member.loginId} member={member} onDelete={() => handleDeleteMember(member.loginId)} />
              ))}
            </div>
          </section>

          <div className="bottom-action-container">
            <Button variant="primary" size="l" onClick={handleCreateGroup}>
              그룹 생성 및 멤버 초대
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default MakeGroup;
