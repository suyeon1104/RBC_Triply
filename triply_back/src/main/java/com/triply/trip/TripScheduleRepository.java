package com.triply.trip;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface TripScheduleRepository extends JpaRepository<TripScheduleEntity, Integer> {

	void deleteByTrip(TripEntity trip);

	List<TripScheduleEntity> findByTrip_TripIdOrderByScheduleDateAscStartTimeAsc(Integer tripId);

}
