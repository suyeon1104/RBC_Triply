package com.triply.group;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<GroupEntity, Integer> {
	List<GroupEntity> findByGroupIdIn(List<Integer> groupIds);

	GroupEntity findByGroupId(Integer groupId);
}
