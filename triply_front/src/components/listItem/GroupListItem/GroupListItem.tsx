import { useNavigate } from 'react-router-dom';
import './GroupListItem.css';

interface Member {
  me: boolean;
  role: string;
  userId: number;
  userImg: string | null;
  userName: string;
}

interface Group {
  createdAt: string;
  groupId: number;
  groupTitle: string;
  memberCount: number;
  members: Member[];
  msg: string | null;
  result: boolean;
}

interface GroupListItemProps {
  group: Group;
}

const GroupListItem = ({ group }: GroupListItemProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/group/${group.groupId}`);
  };

  return (
    <div className="group-item" onClick={handleClick}>
      <div>
        <div className="group-title">
          {group.groupTitle}
          &#40;{group.memberCount}명&#41;
        </div>

        <div className="group-member">
          <span className="group-member-label">멤버 :</span> {group.members.map((member) => member.userName).join(', ')}
        </div>
      </div>
    </div>
  );
};

export default GroupListItem;
