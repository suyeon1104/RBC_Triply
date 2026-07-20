package com.triply.payment;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import com.triply.exchange.CurrencyType;
import com.triply.trip.TripEntity;
import com.triply.user.UserEntity;

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

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer paymentId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false)
	private UserEntity user;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trip_id")
	private TripEntity trip; // null 가능

	@Column(nullable = false)
	private String merchantName;

	@Column(nullable = false)
	private Long amount; // 결제한 현지 통화 금액 (예: 650엔, 10달러)

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private CurrencyType currency;

	@Column(nullable = false)
	private Double exchangeRate; // 결제 당시 환율

	@Column(nullable = false)
	private Long krwAmount; // 원화 환산 금액

	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private LocalDateTime paymentAt;
}
