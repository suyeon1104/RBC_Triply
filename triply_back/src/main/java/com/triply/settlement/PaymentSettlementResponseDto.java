package com.triply.settlement;

import java.util.List;

import com.triply.exchange.CurrencyType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentSettlementResponseDto {
	private Integer paymentId;

	private String merchantName;

	private Long amount;

	private CurrencyType currency;

	private Long krwAmount;

	private List<SettlementResponseDto> settlements;
}
