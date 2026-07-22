package com.triply.exchange;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExchangeRateApiClient {

	private final RestClient restClient;

	@Value("${exchange.api.key}")
	private String apiKey;

	public List<ExchangeRateDto> getExchangeRate() {

		String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));

		String url = "https://oapi.koreaexim.go.kr/site/program/financial/exchangeJSON" + "?authkey=" + apiKey
				+ "&searchdate=" + date + "&data=AP01";

		ExchangeRateDto[] result = restClient.get().uri(url).retrieve().body(ExchangeRateDto[].class);

		return Arrays.asList(result);
	}

}