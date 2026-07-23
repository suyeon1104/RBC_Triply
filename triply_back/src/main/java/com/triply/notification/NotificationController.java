package com.triply.notification;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "알림", description = "알림 API")
@RestController
@RequestMapping("/api/v1/notification")
public class NotificationController {

	private final NotificationService notificationService;

	@Operation(summary = "알림 목록 조회")
	@GetMapping("/list")
	public ResponseEntity<?> getNotificationList(@AuthenticationPrincipal Long userId) {

		try {

			List<NotificationDto> response = notificationService.getNotifications(userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
