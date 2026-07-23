package com.triply.settlement;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.triply.payment.PaymentEntity;

public interface SettlementRepository extends JpaRepository<SettlementEntity, Integer> {
	boolean existsByPayment(PaymentEntity payment);

	@Query("""
			SELECT s
			FROM SettlementEntity s
			WHERE s.payment.trip.tripId = :tripId
			AND (s.fromUser.userId = :userId
			     OR s.toUser.userId = :userId)
			ORDER BY s.requestedAt DESC
			""")
	List<SettlementEntity> findMySettlementsByTrip(@Param("tripId") Integer tripId, @Param("userId") Long userId);

	List<SettlementEntity> findByPayment_Trip_TripIdOrderByRequestedAtDesc(Integer tripId);

	@Query("""
			    SELECT s
			    FROM SettlementEntity s
			    JOIN s.payment p
			    JOIN p.trip t
			    WHERE t.group.groupId = :groupId
			      AND (
			            s.fromUser.userId = :userId
			         OR s.toUser.userId = :userId
			      )
			""")
	List<SettlementEntity> findByGroupIdAndUserId(@Param("groupId") Integer groupId, @Param("userId") Integer userId);
}
