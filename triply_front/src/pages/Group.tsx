import React, { useEffect, useState } from 'react';
import instance from '../api/axiosInstance';
import GroupListItem from '../components/listItem/GroupListItem/GroupListItem';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Button from '../components/Button/Button/Button';
import '../styles/Group.css';
import { Plus } from 'lucide-react';

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
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const res = await instance.get<Group[]>('/group/getGroupList');
        console.log(res.data);
        setGroups(res.data);
      } catch (error) {
        console.error('그룹 목록 조회 실패:', error);
      }
    };

    fetchGroupList();
  }, []);

  return (
    <>
      <Header />

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
            <Button variant="primary" size="l" trailingIcon={<Plus size={20} />}>
              그룹 생성
            </Button>
          </div>
        </div>
      </main>

      <BottomNav />
    </>
  );
};

export default Group;
