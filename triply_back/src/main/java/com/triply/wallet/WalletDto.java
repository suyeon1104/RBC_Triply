package com.triply.wallet;

import java.time.LocalDateTime;

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
public class WalletDto {
	// 충전용
	private Long amount;

	// Wallet 정보
	private Integer walletId;
	private Long balance;
	private LocalDateTime updatedAt;

	private Boolean exists; // 지갑 유무

	// response
	private boolean result;
	private String msg;
}
