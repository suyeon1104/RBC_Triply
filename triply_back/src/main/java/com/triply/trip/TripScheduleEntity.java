package com.triply.trip;

import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TripScheduleEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer scheduleId;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trip_id", nullable = false)
	private TripEntity trip;

	// 일정 날짜
	@Column(nullable = false)
	private LocalDate scheduleDate;

	// 시작 시간
	private LocalTime startTime;

	// 종료 시간
	private LocalTime endTime;

	// 일정 제목
	@Column(nullable = false)
	private String scheduleTitle;

	// 장소
	@Column(nullable = false)
	private String schedulePlace;

	// 상세 내용
	private String scheduleDetail;

	// 카테고리 (관광, 식사, 숙소 등)
	private String category;
}
