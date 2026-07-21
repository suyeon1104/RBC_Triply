package com.triply.trip;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class TripDto {

	private Integer tripId;

	private Integer groupId;

	private Integer userId;

	private String tripTitle;

	private String tripPlace;

	private String tripImg;

	private LocalDate startDate;

	private LocalDate endDate;

	// 응답용

	private boolean result;
	private String msg;
}
