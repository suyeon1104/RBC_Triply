package com.triply.notification;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class NotificationService {

	private final NotificationRepository notificationRepo;

	// 알림 저장 담당
	public void save(NotificationEntity notification) {

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
