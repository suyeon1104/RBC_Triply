package com.triply.exchange;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api-server/v1/auth/exchange")
public class ExchangeTestController {

	private final ExchangeRateService exchangeRateService;

	@PostMapping("/update")
	public String update() {
		exchangeRateService.updateExchangeRate();
		return "환율 저장 완료";
	}
}
