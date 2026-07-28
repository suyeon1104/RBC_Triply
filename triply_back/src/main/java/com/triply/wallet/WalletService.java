package com.triply.wallet;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.payment.PaymentEntity;
import com.triply.settlement.SettlementEntity;
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

	@Transactional(readOnly = true)
	public WalletDto getWallet(Long userId) {

		WalletEntity wallet = walletRepo.findByUser_UserId(userId);

		// 지갑 없음
		if (wallet == null) {

			return WalletDto.builder().exists(false).result(true).msg("생성된 지갑이 없습니다.").build();
		}

		// 지갑 있음
		return WalletDto.builder().walletId(wallet.getWalletId()).balance(wallet.getBalance())
				.updatedAt(wallet.getUpdatedAt()).exists(true).result(true).build();
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

	@Transactional(readOnly = true)
	public List<WalletTransactionDto> getWalletHistory(Long userId) {

		// 1. 지갑 조회
		WalletEntity wallet = walletRepo.findByUser_UserId(userId);

		if (wallet == null) {
			return List.of();
		}

		// 2. 거래내역 조회
		List<WalletTransactionEntity> transactions = walletTransactionRepo
				.findByWalletOrderByTransactionAtDescTransactionIdDesc(wallet);

		// 3. DTO 변환
		return transactions.stream().map(transaction -> {

			PaymentEntity payment = transaction.getPayment();
			SettlementEntity settlement = transaction.getSettlement();

			return WalletTransactionDto.builder()

					// 거래 정보
					.transactionId(transaction.getTransactionId()).type(transaction.getType())
					.amount(transaction.getAmount()).balanceAfter(transaction.getBalanceAfter())
					.transactionAt(transaction.getTransactionAt())

					// 결제 정보
					.paymentId(payment != null ? payment.getPaymentId() : null)

					.merchantName(payment != null ? payment.getMerchantName() : null)

					.tripTitle(payment != null && payment.getTrip() != null ? payment.getTrip().getTripTitle() : null)

					.currency(payment != null ? payment.getCurrency() : null)

					// 정산 정보
					.settlementId(settlement != null ? settlement.getSettlementId() : null)

					.counterpartyId(settlement != null ? (settlement.getFromUser().getUserId().equals(userId.intValue())
							? settlement.getToUser().getUserId()
							: settlement.getFromUser().getUserId()) : null)

					.counterpartyName(
							settlement != null ? (settlement.getFromUser().getUserId().equals(userId.intValue())
									? settlement.getToUser().getUserName()
									: settlement.getFromUser().getUserName()) : null)

					.tripPlace(payment != null && payment.getTrip() != null ? payment.getTrip().getTripPlace() : null)

					.foreignAmount(payment != null ? payment.getAmount() : null)

					.build();
		}).toList();
	}
}
