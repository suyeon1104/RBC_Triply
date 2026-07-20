package com.triply.wallet;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.triply.payment.PaymentEntity;
import com.triply.settlement.SettlementEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WalletTransactionEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer transactionId;

	// 어떤 지갑의 거래인지
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "wallet_id", nullable = false)
	private WalletEntity wallet;

	// 결제로 발생한 거래 (nullable)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_id")
	private PaymentEntity payment;

	// 정산으로 발생한 거래 (nullable)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "settlement_id")
	private SettlementEntity settlement;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private TransactionType type;

	@Column(nullable = false)
	private Long amount;

	@Column(nullable = false)
	private Long balanceAfter;

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime transactionAt;
}
