import React from 'react';
import IconButton from '../../Button/IconButton/IconButton';
import { Trash } from 'lucide-react';
import './MemberListItem.css';
import Avatar from '../../Avatar/Avatar';

export interface InvitedMember {
  userId?: number | string;
  invitationId?: number;
  receiverName: string;
  profileUrl?: string;
  memberRole?: string;
  status?: 'INVITING' | 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

interface MemberListItemProps {
  member?: InvitedMember;
  onDelete?: () => void;
}

const MemberListItem = ({ member, onDelete }: MemberListItemProps) => {
  const name = member?.receiverName || 'userName';
  const role = member?.memberRole || 'memberRole';
  const status = member?.status || 'INVITING';

  return (
    <div className="member-item">
      <div className="leading">
        <Avatar src={member?.profileUrl} userId={member?.userId || member?.receiverName} />
        <div className="name-wrapper">
          <p className="body1-bold">{name}</p>

          {status === 'PENDING' && <p className="label1 pending-text">승인 대기 중</p>}
          {status === 'ACCEPTED' && <p className="label1">{role}</p>}
          {status === 'REJECTED' && <p className="label1 rejected-text">초대 거절됨</p>}
        </div>
      </div>
      <div className="trailing">
        {status === 'INVITING' && (
          <IconButton variant="outlined" size="l" shape="horizontal" onClick={onDelete}>
            <Trash />
          </IconButton>
        )}
      </div>
    </div>
  );
};

export default MemberListItem;
