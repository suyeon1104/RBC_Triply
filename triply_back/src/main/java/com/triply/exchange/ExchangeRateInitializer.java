package com.triply.exchange;

import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ExchangeRateInitializer {

	private final ExchangeRateService exchangeRateService;

	@EventListener(ApplicationReadyEvent.class)
	public void initializeExchangeRate() {
		exchangeRateService.updateExchangeRate();
	}
}
