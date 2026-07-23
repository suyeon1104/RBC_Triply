package com.triply.notification;

import org.springframework.stereotype.Component;

import com.triply.settlement.SettlementEntity;

@Component
public class SettlementNotificationCreator implements NotificationCreator<SettlementEntity> {

	@Override
	public NotificationEntity create(SettlementEntity settlement) {

		return NotificationEntity.builder().sender(settlement.getToUser()).receiver(settlement.getFromUser())
				.type(NotificationType.SETTLEMENT_REQUEST)
				.content(settlement.getToUser().getUserName() + "님이 " + settlement.getAmount() + "원 정산을 요청했습니다.")
				.targetId(settlement.getSettlementId()).build();
	}
}
