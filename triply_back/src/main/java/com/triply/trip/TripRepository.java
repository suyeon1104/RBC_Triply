package com.triply.trip;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface TripRepository extends JpaRepository<TripEntity, Integer> {

	@Query("""
			    SELECT t
			    FROM TripEntity t
			    WHERE t.user.userId = :userId
			       OR (
			            t.group IS NOT NULL
			            AND t.group.groupId IN (
			                SELECT gm.group.groupId
			                FROM GroupMemberEntity gm
			                WHERE gm.user.userId = :userId
			            )
			       )
			""")
	List<TripEntity> findMyTrips(@Param("userId") Long userId);

}
