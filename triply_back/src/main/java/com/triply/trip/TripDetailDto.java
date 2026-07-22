package com.triply.trip;

import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TripDetailDto {

	private Integer tripId;

	private String tripTitle;

	private String tripPlace;

	private String tripImg;

	private LocalDate startDate;

	private LocalDate endDate;

	// 그룹 정보
	private Integer groupId;

	private String groupTitle;

	// 일정 목록
	private List<TripScheduleDto> schedules;

	private boolean result;

	private String msg;
}