package com.triply.trip;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.group.GroupEntity;
import com.triply.group.GroupMemberRepository;
import com.triply.group.GroupRepository;
import com.triply.user.UserEntity;
import com.triply.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class TripService {

	private final TripRepository tripRepo;
	private final TripScheduleRepository tripScheduleRepo;
	private final GroupRepository groupRepo;
	private final GroupMemberRepository groupMemberRepo;
	private final UserRepository userRepo;

	// 권한 확인 메서드
	private void checkTripAccess(TripEntity trip, Long userId) {

		// 여행 생성자인 경우
		if (trip.getUser().getUserId().equals(userId.intValue())) {
			return;
		}

		// 그룹 여행인 경우 그룹 멤버 확인
		if (trip.getGroup() != null) {

			boolean isMember = groupMemberRepo.existsByGroup_GroupIdAndUser_UserId(trip.getGroup().getGroupId(),
					userId.intValue());

			if (isMember) {
				return;
			}
		}

		throw new IllegalArgumentException("여행 접근 권한이 없습니다.");
	}

	public TripEntity createTrip(TripDto tripDto, Long userId) {

		UserEntity user = userRepo.findByUserId(userId);

		// 여행 날짜 중복 검사
		boolean overlap = tripRepo.existsOverlappingTrip(userId, tripDto.getStartDate(), tripDto.getEndDate());

		if (overlap) {
			throw new RuntimeException("기존 여행과 날짜가 겹칩니다.");
		}

		GroupEntity group = null;

		if (tripDto.getGroupId() != null) {
			group = groupRepo.findById(tripDto.getGroupId()).orElseThrow(() -> new RuntimeException("그룹이 존재하지 않습니다."));
		}

		TripEntity trip = TripEntity.builder().tripTitle(tripDto.getTripTitle()).tripPlace(tripDto.getTripPlace())
				.tripImg(tripDto.getTripImg()).startDate(tripDto.getStartDate()).endDate(tripDto.getEndDate())
				.user(user).group(group).build();

		return tripRepo.save(trip);
	}

	public List<TripEntity> getTrip(Long userId) {

		List<TripEntity> trips = tripRepo.findMyTrips(userId);

		return trips;
	}

	public TripEntity updateTrip(TripDto tripDto, Long userId) {

		TripEntity trip = tripRepo.findById(tripDto.getTripId())
				.orElseThrow(() -> new IllegalArgumentException("여행이 존재하지 않습니다."));

		// 본인이 생성자인지 확인
		if (!trip.getUser().getUserId().equals(userId.intValue())) {
			throw new IllegalArgumentException("여행 수정 권한이 없습니다.");
		}

		trip.setTripTitle(tripDto.getTripTitle());
		trip.setTripPlace(tripDto.getTripPlace());
		trip.setTripImg(tripDto.getTripImg());
		trip.setStartDate(tripDto.getStartDate());
		trip.setEndDate(tripDto.getEndDate());

		return tripRepo.save(trip);
	}

	@Transactional
	public void deleteTrip(Integer tripId, Long userId) {
		TripEntity trip = tripRepo.findById(tripId).orElseThrow(() -> new IllegalArgumentException("여행이 존재하지 않습니다."));

		// 생성자 확인
		if (!trip.getUser().getUserId().equals(userId.intValue())) {
			throw new IllegalArgumentException("여행 삭제 권한이 없습니다.");
		}
		// 해당 여행 상세 내역 삭제
		tripScheduleRepo.deleteByTrip(trip);
		// 여행 삭제
		tripRepo.delete(trip);
	}

	@Transactional
	public TripEntity patchTripGroup(TripDto tripDto, Long userId) {

		TripEntity trip = tripRepo.findById(tripDto.getTripId())
				.orElseThrow(() -> new IllegalArgumentException("여행이 존재하지 않습니다."));

		// 여행 생성자 확인
		if (!trip.getUser().getUserId().equals(userId.intValue())) {
			throw new IllegalArgumentException("여행 그룹 변경 권한이 없습니다.");
		}

		GroupEntity group = groupRepo.findById(tripDto.getGroupId())
				.orElseThrow(() -> new IllegalArgumentException("그룹이 존재하지 않습니다."));

		// 이미 같은 그룹인지 확인
		if (trip.getGroup() != null && trip.getGroup().getGroupId().equals(group.getGroupId())) {
			throw new IllegalArgumentException("이미 연결된 그룹입니다.");
		}

		trip.setGroup(group);

		return tripRepo.save(trip);
	}

	public TripScheduleEntity createSchedule(TripScheduleDto scheduleDto, Long userId) {

		// 여행 조회
		TripEntity trip = tripRepo.findById(scheduleDto.getTripId())
				.orElseThrow(() -> new IllegalArgumentException("여행이 존재하지 않습니다."));

		checkTripAccess(trip, userId);

		TripScheduleEntity schedule = TripScheduleEntity.builder().trip(trip)
				.scheduleDate(scheduleDto.getScheduleDate()).startTime(scheduleDto.getStartTime())
				.endTime(scheduleDto.getEndTime()).scheduleTitle(scheduleDto.getScheduleTitle())
				.schedulePlace(scheduleDto.getSchedulePlace()).scheduleDetail(scheduleDto.getScheduleDetail())
				.category(scheduleDto.getCategory()).build();

		return tripScheduleRepo.save(schedule);
	}

	public TripDetailDto getTripDetail(Integer tripId, Long userId) {

		// 여행 조회
		TripEntity trip = tripRepo.findById(tripId).orElseThrow(() -> new IllegalArgumentException("여행이 존재하지 않습니다."));

		// 접근 권한 확인
		checkTripAccess(trip, userId);

		// 일정 조회
		List<TripScheduleDto> schedules = tripScheduleRepo.findByTrip_TripIdOrderByScheduleDateAscStartTimeAsc(tripId)
				.stream()
				.map(schedule -> TripScheduleDto.builder().scheduleId(schedule.getScheduleId())
						.tripId(schedule.getTrip().getTripId()).scheduleDate(schedule.getScheduleDate())
						.startTime(schedule.getStartTime()).endTime(schedule.getEndTime())
						.scheduleTitle(schedule.getScheduleTitle()).schedulePlace(schedule.getSchedulePlace())
						.scheduleDetail(schedule.getScheduleDetail()).category(schedule.getCategory()).build())
				.toList();

		return TripDetailDto.builder().tripId(trip.getTripId()).tripTitle(trip.getTripTitle())
				.tripPlace(trip.getTripPlace()).tripImg(trip.getTripImg()).startDate(trip.getStartDate())
				.endDate(trip.getEndDate()).groupId(trip.getGroup() != null ? trip.getGroup().getGroupId() : null)
				.groupTitle(trip.getGroup() != null ? trip.getGroup().getGroupTitle() : null).schedules(schedules)
				.result(true).msg("여행 상세 조회가 완료되었습니다.").build();

	}

	@Transactional
	public TripScheduleEntity updateSchedule(TripScheduleDto scheduleDto, Long userId) {

		// 일정 조회
		TripScheduleEntity schedule = tripScheduleRepo.findById(scheduleDto.getScheduleId())
				.orElseThrow(() -> new IllegalArgumentException("일정이 존재하지 않습니다."));

		// 여행 접근 권한 확인
		checkTripAccess(schedule.getTrip(), userId);

		// 수정
		schedule.setScheduleDate(scheduleDto.getScheduleDate());
		schedule.setStartTime(scheduleDto.getStartTime());
		schedule.setEndTime(scheduleDto.getEndTime());
		schedule.setScheduleTitle(scheduleDto.getScheduleTitle());
		schedule.setSchedulePlace(scheduleDto.getSchedulePlace());
		schedule.setScheduleDetail(scheduleDto.getScheduleDetail());
		schedule.setCategory(scheduleDto.getCategory());

		return tripScheduleRepo.save(schedule);
	}

	@Transactional
	public void deleteSchedule(Integer scheduleId, Long userId) {

		// 일정 조회
		TripScheduleEntity schedule = tripScheduleRepo.findById(scheduleId)
				.orElseThrow(() -> new IllegalArgumentException("일정이 존재하지 않습니다."));

		// 여행 접근 권한 확인
		checkTripAccess(schedule.getTrip(), userId);

		// 일정 삭제
		tripScheduleRepo.delete(schedule);
	}

	public TripScheduleDto getSchedule(Integer scheduleId, Long userId) {

		// 일정 조회
		TripScheduleEntity schedule = tripScheduleRepo.findById(scheduleId)
				.orElseThrow(() -> new IllegalArgumentException("일정이 존재하지 않습니다."));

		// 여행 접근 권한 확인
		checkTripAccess(schedule.getTrip(), userId);

		return TripScheduleDto.builder().scheduleId(schedule.getScheduleId()).tripId(schedule.getTrip().getTripId())
				.scheduleDate(schedule.getScheduleDate()).startTime(schedule.getStartTime())
				.endTime(schedule.getEndTime()).scheduleTitle(schedule.getScheduleTitle())
				.schedulePlace(schedule.getSchedulePlace()).scheduleDetail(schedule.getScheduleDetail())
				.category(schedule.getCategory()).result(true).msg("여행 일정 조회가 완료되었습니다.").build();
	}

	public List<TripEntity> getGroupTrips(Long groupId) {

		return tripRepo.findByGroup_GroupId(groupId);

	}

}
