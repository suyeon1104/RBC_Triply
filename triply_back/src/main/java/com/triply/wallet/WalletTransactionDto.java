package com.triply.wallet;

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
public class WalletTransactionDto {

	// 거래 정보
	private Integer transactionId;

	private TransactionType type;

	private Long amount;

	private Long balanceAfter;

	private LocalDateTime transactionAt;

	// 결제 정보
	private Integer paymentId;

	private String merchantName;

	private String tripTitle;

	private CurrencyType currency;

	// 정산 정보
	private Integer settlementId;

	private Integer counterpartyId;

	private String counterpartyName;
}
