package com.triply.group;

import org.springframework.data.jpa.repository.JpaRepository;

import com.triply.user.UserEntity;

public interface GroupInvitationRepository extends JpaRepository<GroupInvitationEntity, Integer> {

	boolean existsByGroupAndReceiverAndStatus(GroupEntity group, UserEntity receiver, InvitationStatus pending);

	GroupInvitationEntity findByInvitationId(Integer invitationId);

	void deleteByGroup(GroupEntity group);

}
