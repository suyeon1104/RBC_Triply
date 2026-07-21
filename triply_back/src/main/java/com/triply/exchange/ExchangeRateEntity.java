package com.triply.exchange;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class ExchangeRateEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer exchangeRateId;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false, unique = true)
	private CurrencyType currency;

	@Column(nullable = false)
	private Double rate; // 1382.45

	@Column(nullable = false)
	private LocalDate rateDate; // 적용 날짜

	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDateTime updatedAt;
}
