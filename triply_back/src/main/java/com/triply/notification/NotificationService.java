package com.triply.notification;

import java.util.List;

import org.springframework.stereotype.Service;

import com.triply.group.GroupInvitationEntity;
import com.triply.settlement.SettlementEntity;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotificationService {

	private final NotificationRepository notificationRepo;

	public void createGroupInviteNotification(GroupInvitationEntity invite) {

		NotificationEntity notification = NotificationEntity.builder().sender(invite.getSender())
				.receiver(invite.getReceiver()).type(NotificationType.GROUP_INVITE)
				.content(
						invite.getSender().getUserName() + "님이 '" + invite.getGroup().getGroupTitle() + "' 그룹에 초대했습니다.")
				.targetId(invite.getInvitationId()).build();

		notificationRepo.save(notification);
	}

	public void createSettlementRequestNotification(SettlementEntity settlement) {

		NotificationEntity notification = NotificationEntity.builder().sender(settlement.getToUser())
				.receiver(settlement.getFromUser()).type(NotificationType.SETTLEMENT_REQUEST)
				.content(settlement.getToUser().getUserName() + "님이 " + settlement.getAmount() + "원 정산을 요청했습니다.")
				.targetId(settlement.getSettlementId()).build();

		notificationRepo.save(notification);
	}

	public List<NotificationDto> getNotifications(Long userId) {

		List<NotificationEntity> notifications = notificationRepo.findByReceiver_UserIdOrderByCreatedAtDesc(userId);

		return notifications.stream()
				.map(notification -> NotificationDto.builder().notificationId(notification.getNotificationId())
						.senderName(notification.getSender().getUserName()).type(notification.getType())
						.content(notification.getContent()).targetId(notification.getTargetId())
						.createdAt(notification.getCreatedAt()).build())
				.toList();
	}

	public void deleteNotification(Integer targetId, NotificationType type, Integer userId) {

		notificationRepo.deleteByTargetIdAndTypeAndReceiver_UserId(targetId, type, userId);

	}

}
