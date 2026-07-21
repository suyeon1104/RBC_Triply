package com.triply.exchange;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ExchangeRateRepository extends JpaRepository<ExchangeRateEntity, Integer> {

	Optional<ExchangeRateEntity> findByCurrency(CurrencyType currency);

	boolean existsByRateDate(LocalDate now);

}
