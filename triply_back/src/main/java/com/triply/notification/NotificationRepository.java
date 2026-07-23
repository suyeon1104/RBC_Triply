package com.triply.notification;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Integer> {

	List<NotificationEntity> findByReceiver_UserIdOrderByCreatedAtDesc(Long userId);

	void deleteByTargetIdAndTypeAndReceiver_UserId(Integer targetId, NotificationType type, Integer userId);

}
