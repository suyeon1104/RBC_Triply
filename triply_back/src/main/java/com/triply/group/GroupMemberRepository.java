package com.triply.group;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.triply.user.UserEntity;

public interface GroupMemberRepository extends JpaRepository<GroupMemberEntity, Integer> {
	List<GroupMemberEntity> findByUser_UserId(long userId);

	boolean existsByGroupAndUser(GroupEntity group, UserEntity receiver);

	GroupMemberEntity findByGroup_GroupIdAndUser_UserId(Integer groupId, Integer id);

	void deleteByGroup(GroupEntity group);
}
