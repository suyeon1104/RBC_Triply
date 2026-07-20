package com.triply.exchange;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExchangeRateService {

	private final ExchangeRateRepository repository;
	private final ExchangeRateApiClient apiClient;

	@Transactional
	public void updateExchangeRate() {

		if (repository.existsByRateDate(LocalDate.now())) {
			return;
		}

		List<ExchangeRateDto> list = apiClient.getExchangeRate();

		for (ExchangeRateDto dto : list) {

			String currency = dto.getCurUnit();

			// 사용할 통화만 저장
			if (!currency.equals("KRW") && !currency.equals("USD") && !currency.equals("EUR")
					&& !currency.equals("JPY(100)")) {
				continue;
			}

			// 쉼표 제거 후 Double 변환
			String rate = dto.getDealBasR().replace(",", "");
			Double exchangeRate = Double.parseDouble(rate);

			// JPY(100) → JPY
			if (currency.equals("JPY(100)")) {
				currency = "JPY";
				exchangeRate /= 100;
			}

			CurrencyType currencyType = CurrencyType.valueOf(currency);

			Optional<ExchangeRateEntity> optional = repository.findByCurrency(currencyType);

			if (optional.isPresent()) {

				ExchangeRateEntity entity = optional.get();
				entity.setRate(exchangeRate);
				entity.setRateDate(LocalDate.now());

				repository.save(entity);

			} else {

				ExchangeRateEntity entity = ExchangeRateEntity.builder().currency(currencyType).rate(exchangeRate)
						.rateDate(LocalDate.now()).build();

				repository.save(entity);
			}
		}
	}
}
