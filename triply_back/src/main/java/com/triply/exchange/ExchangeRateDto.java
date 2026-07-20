package com.triply.exchange;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExchangeRateDto {

	@JsonProperty("cur_unit")
	private String curUnit;

	@JsonProperty("deal_bas_r")
	private String dealBasR;
}
