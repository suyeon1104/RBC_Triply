package com.triply.payment;

import java.util.List;

import com.triply.exchange.CurrencyType;

public class PaymentMockData {

	public static final List<PaymentDto> PAYMENTS = List.of(

			PaymentDto.builder().merchantName("스타벅스 도쿄").amount(650L).currency(CurrencyType.JPY).build(),

			PaymentDto.builder().merchantName("돈키호테 신주쿠").amount(3980L).currency(CurrencyType.JPY).build(),

			PaymentDto.builder().merchantName("맥도날드 뉴욕").amount(12L).currency(CurrencyType.USD).build(),

			PaymentDto.builder().merchantName("Apple Store").amount(299L).currency(CurrencyType.USD).build(),

			PaymentDto.builder().merchantName("루브르 박물관").amount(22L).currency(CurrencyType.EUR).build(),

			PaymentDto.builder().merchantName("까르푸 파리").amount(48L).currency(CurrencyType.EUR).build(),

			PaymentDto.builder().merchantName("올리브영").amount(27000L).currency(CurrencyType.KRW).build(),

			PaymentDto.builder().merchantName("GS25").amount(4200L).currency(CurrencyType.KRW).build()

	);
}
