package com.triply.settlement;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SettlementDto {

	// 요청
	private Integer paymentId;
	private List<SettlementRequestDto> settlements;

	// 응답
	private Boolean result;
	private String msg;
}