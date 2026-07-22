package com.triply.wallet;

public enum TransactionType {
	CHARGE, // 지갑 충전
	PAYMENT, // 결제
	SETTLEMENT_IN, // 정산 받음
	SETTLEMENT_OUT // 정산 보냄
}
