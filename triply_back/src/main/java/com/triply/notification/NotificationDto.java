package com.triply.notification;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDto {

	private Integer notificationId;

	private String senderName;

	private NotificationType type;

	private String content;

	private Integer targetId;

	private LocalDateTime createdAt;

	// 추가
	private String title; // 그룹명 또는 결제처
	private String subTitle; // 여행명(필요하면)
}
