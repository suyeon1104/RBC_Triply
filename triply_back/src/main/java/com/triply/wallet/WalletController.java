package com.triply.wallet;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "지갑", description = "지갑 CRUD API")
@RestController
@RequestMapping("/api/v1/wallet")
public class WalletController {
	private final WalletService walletService;

	@Operation(summary = "지갑 조회")
	@GetMapping
	public ResponseEntity<?> getWallet(@AuthenticationPrincipal Long userId) {
		try {

			WalletEntity wallet = walletService.getWallet(userId);

			WalletDto response = WalletDto.builder().walletId(wallet.getWalletId()).balance(wallet.getBalance())
					.updatedAt(wallet.getUpdatedAt()).result(true).build();

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "가짜 계좌 인증 요청")
	@GetMapping("/verify-account")
	public ResponseEntity<?> verifyAccount() {

		int random = ThreadLocalRandom.current().nextInt(1000, 10000);
		String depositName = "TRIP" + random;

		Map<String, Object> response = new HashMap<>();
		response.put("result", true);
		response.put("depositAmount", 1);
		response.put("depositName", depositName);
		response.put("msg", "1원을 송금했습니다. 입금자명을 확인해주세요.");

		return ResponseEntity.ok(response);
	}

	@Operation(summary = "지갑 생성")
	@PostMapping("/create-wallet")
	public ResponseEntity<?> createWallet(@AuthenticationPrincipal Long userId) {
		try {
			WalletEntity wallet = walletService.createWallet(userId);

			WalletDto response = WalletDto.builder().walletId(wallet.getWalletId()).balance(wallet.getBalance())
					.updatedAt(wallet.getUpdatedAt()).result(true).msg("지갑 생성이 완료되었습니다.").build();

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "지갑 충전")
	@PostMapping("/charge")
	public ResponseEntity<?> chargeWallet(@RequestBody WalletDto walletDto, @AuthenticationPrincipal Long userId) {
		try {

			WalletEntity wallet = walletService.chargeWallet(walletDto, userId);

			WalletDto response = WalletDto.builder().walletId(wallet.getWalletId()).balance(wallet.getBalance())
					.updatedAt(wallet.getUpdatedAt()).result(true).msg("충전이 완료되었습니다.").build();

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
