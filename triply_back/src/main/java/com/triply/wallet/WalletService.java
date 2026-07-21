package com.triply.wallet;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.user.UserEntity;
import com.triply.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class WalletService {
	private final UserRepository userRepo;
	private final WalletRepository walletRepo;
	private final WalletTransactionRepository walletTransactionRepo;

	public WalletEntity createWallet(Long userId) {

		if (walletRepo.existsByUser_UserId(userId)) {
			throw new RuntimeException("이미 지갑이 생성된 사용자입니다.");
		}

		UserEntity user = userRepo.findByUserId(userId);

		if (user == null) {
			throw new RuntimeException("사용자를 찾을 수 없습니다.");
		}

		WalletEntity wallet = WalletEntity.builder().user(user).build();

		return walletRepo.save(wallet);
	}

	public WalletEntity getWallet(Long userId) {

		WalletEntity wallet = walletRepo.findByUser_UserId(userId);

		if (wallet == null) {
			throw new RuntimeException("생성된 지갑이 없습니다.");
		}

		return wallet;
	}

	@Transactional
	public WalletEntity chargeWallet(WalletDto walletDto, Long userId) {

		WalletEntity wallet = walletRepo.findByUser_UserId(userId);

		if (wallet == null) {
			throw new RuntimeException("생성된 지갑이 없습니다.");
		}

		// 충전
		Long balance = wallet.getBalance() + walletDto.getAmount();
		wallet.setBalance(balance);

		walletRepo.save(wallet);

		// 거래내역 저장
		WalletTransactionEntity transaction = WalletTransactionEntity.builder().wallet(wallet)
				.type(TransactionType.CHARGE).amount(walletDto.getAmount()).balanceAfter(balance).build();

		walletTransactionRepo.save(transaction);

		return wallet;
	}
}
