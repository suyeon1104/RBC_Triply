package com.triply.trip;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "여행", description = "여행 CRUD API")
@RestController
@RequestMapping("/api/v1/trip")
public class TripController {

	private final TripService tripService;

	@Operation(summary = "여행추가")
	@PostMapping("/createTrip")
	public ResponseEntity<?> createTrip(@RequestBody TripDto tripDto, @AuthenticationPrincipal Long userId) {
		try {

			TripEntity trip = tripService.createTrip(tripDto, userId);

			// 응답
			TripDto response = TripDto.builder().tripId(trip.getTripId()).tripTitle(trip.getTripTitle())
					.tripPlace(trip.getTripPlace()).tripImg(trip.getTripImg()).startDate(trip.getStartDate())
					.endDate(trip.getEndDate()).groupId(trip.getGroup() != null ? trip.getGroup().getGroupId() : null)
					.result(true).msg("여행이 생성되었습니다.").build();

			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행목록 조회")
	@GetMapping("/getTripList")
	public ResponseEntity<?> getTripList(@AuthenticationPrincipal Long userId) {

		List<TripEntity> trips = tripService.getTrip(userId);

		// 가져 온 리스트를 dto에 담아 전달
		List<TripDto> response = trips.stream()
				.map(trip -> TripDto.builder().tripId(trip.getTripId()).tripTitle(trip.getTripTitle())
						.tripPlace(trip.getTripPlace()).tripImg(trip.getTripImg()).startDate(trip.getStartDate())
						.endDate(trip.getEndDate())
						.groupId(trip.getGroup() != null ? trip.getGroup().getGroupId() : null).result(true).build())
				.toList();

		return ResponseEntity.ok(response);
	}

	@Operation(summary = "여행 수정")
	@PatchMapping("/patchTrip")
	public ResponseEntity<?> patchTrip(@RequestBody TripDto tripDto, @AuthenticationPrincipal Long userId) {
		try {

			TripEntity trip = tripService.updateTrip(tripDto, userId);

			// 응답용
			TripDto response = TripDto.builder().tripId(trip.getTripId()).tripTitle(trip.getTripTitle())
					.tripPlace(trip.getTripPlace()).tripImg(trip.getTripImg()).startDate(trip.getStartDate())
					.endDate(trip.getEndDate()).groupId(trip.getGroup() != null ? trip.getGroup().getGroupId() : null)
					.result(true).msg("여행이 수정되었습니다.").build();

			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}

	@Operation(summary = "여행 삭제")
	@DeleteMapping("/deleteTrip")
	public ResponseEntity<?> deleteTrip(@RequestBody TripDto tripDto, @AuthenticationPrincipal Long userId) {

		try {
			tripService.deleteTrip(tripDto.getTripId(), userId);

			return ResponseEntity.ok(Map.of("msg", "여행 삭제가 완료되었습니다."));

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행과 그룹 연결")
	@PatchMapping("/patchTripGroup")
	public ResponseEntity<?> patchTripGroup(@RequestBody TripDto tripDto, @AuthenticationPrincipal Long userId) {
		try {

			TripEntity trip = tripService.patchTripGroup(tripDto, userId);

			// 응답용
			TripDto response = TripDto.builder().tripId(trip.getTripId()).tripTitle(trip.getTripTitle())
					.tripPlace(trip.getTripPlace()).tripImg(trip.getTripImg()).startDate(trip.getStartDate())
					.endDate(trip.getEndDate()).groupId(trip.getGroup() != null ? trip.getGroup().getGroupId() : null)
					.result(true).msg("여행 그룹 연결이 완료되었습니다.").build();

			return ResponseEntity.ok().body(response);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}

	// ==============================================================================
	// 여행 상세 일정

	@Operation(summary = "여행 일정 추가")
	@PostMapping("/createSchedule")
	public ResponseEntity<?> createSchedule(@RequestBody TripScheduleDto scheduleDto,
			@AuthenticationPrincipal Long userId) {

		try {

			TripScheduleEntity schedule = tripService.createSchedule(scheduleDto, userId);

			TripScheduleDto response = TripScheduleDto.builder().scheduleId(schedule.getScheduleId())
					.tripId(schedule.getTrip().getTripId()).scheduleDate(schedule.getScheduleDate())
					.startTime(schedule.getStartTime()).endTime(schedule.getEndTime())
					.scheduleTitle(schedule.getScheduleTitle()).schedulePlace(schedule.getSchedulePlace())
					.scheduleDetail(schedule.getScheduleDetail()).category(schedule.getCategory()).result(true)
					.msg("여행 일정이 추가되었습니다.").build();

			return ResponseEntity.ok().body(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행 상세 조회")
	@GetMapping("/getTripDetail")
	public ResponseEntity<?> getTripDetail(@RequestBody TripScheduleDto scheduleDto,
			@AuthenticationPrincipal Long userId) {

		try {

			TripDetailDto response = tripService.getTripDetail(scheduleDto.getTripId(), userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행 일정 수정")
	@PatchMapping("/updateSchedule")
	public ResponseEntity<?> updateSchedule(@RequestBody TripScheduleDto scheduleDto,
			@AuthenticationPrincipal Long userId) {

		try {

			TripScheduleEntity schedule = tripService.updateSchedule(scheduleDto, userId);

			TripScheduleDto response = TripScheduleDto.builder().scheduleId(schedule.getScheduleId())
					.tripId(schedule.getTrip().getTripId()).scheduleDate(schedule.getScheduleDate())
					.startTime(schedule.getStartTime()).endTime(schedule.getEndTime())
					.scheduleTitle(schedule.getScheduleTitle()).schedulePlace(schedule.getSchedulePlace())
					.scheduleDetail(schedule.getScheduleDetail()).category(schedule.getCategory()).result(true)
					.msg("여행 일정이 수정되었습니다.").build();

			return ResponseEntity.ok().body(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행 일정 삭제")
	@DeleteMapping("/deleteSchedule")
	public ResponseEntity<?> deleteSchedule(@RequestBody TripScheduleDto scheduleDto,
			@AuthenticationPrincipal Long userId) {

		try {

			tripService.deleteSchedule(scheduleDto.getScheduleId(), userId);

			return ResponseEntity.ok(Map.of("msg", "여행 일정 삭제가 완료되었습니다."));

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
