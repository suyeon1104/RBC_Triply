package com.triply.exchange;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExchangeRateScheduler {

	private final ExchangeRateService exchangeRateService;

	@Scheduled(cron = "0 0 0 * * *")
	public void updateExchangeRate() {
		exchangeRateService.updateExchangeRate();
	}
}
