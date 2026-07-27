package com.triply.notification;

import java.util.List;

import org.springframework.stereotype.Service;

import com.triply.group.GroupInvitationEntity;
import com.triply.group.GroupInvitationRepository;
import com.triply.settlement.SettlementEntity;
import com.triply.settlement.SettlementRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotificationService {

	private final NotificationRepository notificationRepo;
	private final GroupInvitationRepository groupInvitationRepo;
	private final SettlementRepository settlementRepo;

	// 알림 저장 담당
	public void save(NotificationEntity notification) {

		notificationRepo.save(notification);

	}

	public List<NotificationDto> getNotifications(Long userId) {

		List<NotificationEntity> notifications = notificationRepo.findByReceiver_UserIdOrderByCreatedAtDesc(userId);

		return notifications.stream().map(notification -> {

			NotificationDto.NotificationDtoBuilder builder = NotificationDto.builder()
					.notificationId(notification.getNotificationId()).senderName(notification.getSender().getUserName())
					.type(notification.getType()).content(notification.getContent())
					.targetId(notification.getTargetId()).createdAt(notification.getCreatedAt());

			if (notification.getType() == NotificationType.GROUP_INVITE) {
				GroupInvitationEntity invite = groupInvitationRepo.findById(notification.getTargetId())
						.orElseThrow(() -> new RuntimeException("초대 정보를 찾을 수 없습니다."));

				builder.title(invite.getGroup().getGroupTitle());
			}

			if (notification.getType() == NotificationType.SETTLEMENT_REQUEST) {
				SettlementEntity settlement = settlementRepo.findById(notification.getTargetId())
						.orElseThrow(() -> new RuntimeException("정산 정보를 찾을 수 없습니다."));

				builder.title(settlement.getPayment().getMerchantName());
				builder.subTitle(settlement.getPayment().getTrip().getTripTitle());
			}

			return builder.build();
		}).toList();
	}

	public void deleteNotification(Integer targetId, NotificationType type, Integer userId) {

		notificationRepo.deleteByTargetIdAndTypeAndReceiver_UserId(targetId, type, userId);

	}

	public long getNotificationCount(Long userId) {

		return notificationRepo.countByReceiver_UserId(userId);
	}

}
