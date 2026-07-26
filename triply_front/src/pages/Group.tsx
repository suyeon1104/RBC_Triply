import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import instance from '../api/axiosInstance';
import GroupListItem from '../components/listItem/GroupListItem/GroupListItem';

import BottomNav from '../components/BottomNav';
import Button from '../components/Button/Button/Button';
import '../styles/Group.css';
import { Plus } from 'lucide-react';
import GNB from '../components/Navigation/GNB/GNB';

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

const Group = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const res = await instance.get<Group[]>('/group/getGroupList');

        let sortedList = res.data.sort((a, b) => b.groupId - a.groupId);

        const newGroup = location.state?.newGroup;
        if (newGroup && !sortedList.some((g) => g.groupId === newGroup.groupId)) {
          sortedList = [newGroup, ...sortedList];
        }

        setGroups(sortedList);
      } catch (error) {
        console.error('그룹 목록 조회 실패:', error);
      }
    };

    fetchGroupList();
  }, [location.state]);

  return (
    <>
      <header>
        <GNB />
      </header>

      <main className="page">
        <div className="container">
          <section>
            <div className="group-list">
              {groups.map((group) => (
                <GroupListItem key={group.groupId} group={group} />
              ))}
            </div>
          </section>

          <div className="floating-button">
            <Button variant="primary" size="l" trailingIcon={<Plus />} onClick={() => navigate('/group/makegroup')}>
              그룹 만들기
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default Group;
