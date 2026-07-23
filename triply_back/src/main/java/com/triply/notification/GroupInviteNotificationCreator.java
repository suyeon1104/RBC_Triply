package com.triply.notification;

import org.springframework.stereotype.Component;

import com.triply.group.GroupInvitationEntity;

@Component
public class GroupInviteNotificationCreator implements NotificationCreator<GroupInvitationEntity> {

	@Override
	public NotificationEntity create(GroupInvitationEntity invite) {

		return NotificationEntity.builder().sender(invite.getSender()).receiver(invite.getReceiver())
				.type(NotificationType.GROUP_INVITE).content(invite.getSender().getUserName() + "님이 그룹에 초대했습니다.")
				.targetId(invite.getInvitationId()).build();
	}
}
