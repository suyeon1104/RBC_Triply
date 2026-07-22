package com.triply.trip;

import java.time.LocalDate;
import java.time.LocalTime;

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
public class TripScheduleDto {

	private Integer scheduleId;

	private Integer tripId;

	private LocalDate scheduleDate;

	private LocalTime startTime;

	private LocalTime endTime;

	private String scheduleTitle;

	private String schedulePlace;

	private String scheduleDetail;

	private String category;

	private Boolean result;

	private String msg;
}
