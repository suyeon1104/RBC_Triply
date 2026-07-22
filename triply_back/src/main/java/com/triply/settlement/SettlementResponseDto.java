package com.triply.settlement;

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
public class SettlementResponseDto {

	private Integer settlementId;

	private Integer paymentId;

	private Integer fromUserId;
	private String fromUserName;

	private Integer toUserId;
	private String toUserName;

	private Long amount;

	private SettlementStatus status;

	private LocalDateTime requestedAt;

	private LocalDateTime completedAt;

	private String myRole; // 로그인 회원기준
}