package com.triply.payment;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<PaymentEntity, Integer> {

//	List<PaymentEntity> findByUser_UserIdOrderByPaymentAtDesc(Long userId);

	List<PaymentEntity> findByTrip_TripIdOrderByPaymentAtDesc(Integer tripId);

}
