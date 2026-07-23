package com.triply.settlement;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.triply.payment.PaymentDto;
import com.triply.payment.PaymentService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "정산", description = "정산 CRUD API")
@RestController
@RequestMapping("/api/v1/settlement")
public class SettlementController {

	private final PaymentService paymentService;
	private final SettlementService settlementService;

	@Operation(summary = "정산 가능 여부 확인")
	@GetMapping("/check/{paymentId}")
	public ResponseEntity<?> checkSettlement(@PathVariable("paymentId") Integer paymentId,
			@AuthenticationPrincipal Long userId) {

		try {

			PaymentDto response = paymentService.checkSettlement(paymentId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(PaymentDto.builder().result(false).msg(e.getMessage()).build());
		}
	}

	@Operation(summary = "정산 요청")
	@PostMapping("/request")
	public ResponseEntity<?> requestSettlement(@RequestBody SettlementDto settlementDto,
			@AuthenticationPrincipal Long userId) {

		try {

			SettlementDto response = settlementService.requestSettlement(settlementDto, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "여행별 정산 내역 조회")
	@GetMapping("/trip/{tripId}")
	public ResponseEntity<?> getSettlementList(@PathVariable("tripId") Integer tripId,
			@AuthenticationPrincipal Long userId) {

		try {

			List<SettlementResponseDto> response = settlementService.getSettlementList(tripId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "정산 처리")
	@PatchMapping("/{settlementId}/complete")
	public ResponseEntity<?> completeSettlement(@PathVariable("settlementId") Integer settlementId,
			@AuthenticationPrincipal Long userId) {

		try {

			SettlementResponseDto response = settlementService.completeSettlement(settlementId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {

			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹 정산 조회")
	@GetMapping("/group/{groupId}")
	public ResponseEntity<?> getGroupSettlement(@PathVariable("groupId") Integer groupId,
			@AuthenticationPrincipal Long userId) {

		List<SettlementResponseDto> response = settlementService.getGroupSettlement(groupId, userId);

		return ResponseEntity.ok(response);
	}

}
