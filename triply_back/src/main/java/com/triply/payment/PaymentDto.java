package com.triply.payment;

import java.time.LocalDateTime;

import com.triply.exchange.CurrencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class PaymentDto {
	// request
	private Integer paymentId;
	private Integer tripId; // 여행 연결 시 사용
	private String tripTitle;
	private String merchantName;
	private Long amount; // 현지 통화 금액
	private CurrencyType currency;

	// response
	private Long krwAmount; // 원화 환산 금액
	private Double exchangeRate; // 적용 환율
	private LocalDateTime paymentAt;

	private boolean result;
	private String msg;
}
