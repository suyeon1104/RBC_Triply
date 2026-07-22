package com.triply.payment;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.triply.trip.TripEntity;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "결제", description = "결제 CRUD API")
@RestController
@RequestMapping("/api/v1/payment")
public class PaymentController {
	private final PaymentService paymentService;

	@Operation(summary = "가짜 결제")
	@PostMapping("/create-payment")
	public ResponseEntity<?> createPayment(@AuthenticationPrincipal Long userId) {

		try {

			PaymentDto response = paymentService.createPayment(userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "결제를 여행과 연결")
	@PatchMapping("/connectTrip")
	public ResponseEntity<?> connectTrip(@RequestBody PaymentDto paymentDto, @AuthenticationPrincipal Long userId) {

		try {

			TripEntity trip = paymentService.connectTrip(paymentDto, userId);

			Map<String, Object> response = Map.of("tripTitle", trip.getTripTitle(), "result", true, "msg",
					"여행과 연결되었습니다.");

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "결제 상세 조회")
	@GetMapping("/{paymentId}")
	public ResponseEntity<?> getPayment(@PathVariable("paymentId") Integer paymentId,
			@AuthenticationPrincipal Long userId) {

		try {

			PaymentDto response = paymentService.getPayment(paymentId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행별 결제 목록 조회")
	@GetMapping("/trip/{tripId}")
	public ResponseEntity<?> getPaymentListByTrip(@PathVariable("tripId") Integer tripId,
			@AuthenticationPrincipal Long userId) {

		try {

			List<PaymentDto> response = paymentService.getPaymentListByTrip(tripId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
}
