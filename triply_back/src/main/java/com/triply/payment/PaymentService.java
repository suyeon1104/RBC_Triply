package com.triply.payment;

import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.exchange.ExchangeRateEntity;
import com.triply.exchange.ExchangeRateRepository;
import com.triply.trip.TripEntity;
import com.triply.trip.TripRepository;
import com.triply.user.UserRepository;
import com.triply.wallet.TransactionType;
import com.triply.wallet.WalletEntity;
import com.triply.wallet.WalletRepository;
import com.triply.wallet.WalletTransactionEntity;
import com.triply.wallet.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class PaymentService {
	private final WalletRepository walletRepo;
	private final PaymentRepository paymentRepo;
	private final WalletTransactionRepository walletTransactionRepo;
	private final ExchangeRateRepository exchangeRateRepo;
	private final UserRepository userRepo;
	private final TripRepository tripRepo;

	@Transactional
	public PaymentDto createPayment(Long userId) {

		// 1. 목업 데이터 랜덤 선택
		Random random = new Random();

		PaymentDto mockPayment = PaymentMockData.PAYMENTS.get(random.nextInt(PaymentMockData.PAYMENTS.size()));

		// 2. 사용자 지갑 조회
		WalletEntity wallet = walletRepo.findByUser_UserId(userId);

		if (wallet == null) {
			throw new RuntimeException("지갑이 존재하지 않습니다.");
		}

		// 3. 환율 조회
		Optional<ExchangeRateEntity> exchangeRateOptional = exchangeRateRepo.findByCurrency(mockPayment.getCurrency());

		ExchangeRateEntity exchangeRate = exchangeRateOptional
				.orElseThrow(() -> new RuntimeException("환율 정보를 찾을 수 없습니다."));

		// 4. 원화 계산
		long krwAmount = Math.round(mockPayment.getAmount() * exchangeRate.getRate());

		// 5. 잔액 확인
		if (wallet.getBalance() < krwAmount) {
			throw new RuntimeException("잔액이 부족합니다.");
		}

		// 6. 지갑 차감
		Long afterBalance = wallet.getBalance() - krwAmount;

		wallet.setBalance(afterBalance);

		walletRepo.save(wallet);

		// 7. 결제 저장
		PaymentEntity payment = PaymentEntity.builder().user(wallet.getUser())
				.merchantName(mockPayment.getMerchantName()).amount(mockPayment.getAmount())
				.currency(mockPayment.getCurrency()).exchangeRate(exchangeRate.getRate()).krwAmount(krwAmount).build();

		PaymentEntity savedPayment = paymentRepo.save(payment);

		// 8. 지갑 거래내역 저장
		WalletTransactionEntity transaction = WalletTransactionEntity.builder().wallet(wallet).payment(savedPayment)
				.type(TransactionType.PAYMENT).amount(krwAmount).balanceAfter(afterBalance).build();

		walletTransactionRepo.save(transaction);

		// 9. 응답
		return PaymentDto.builder().paymentId(savedPayment.getPaymentId()).merchantName(savedPayment.getMerchantName())
				.amount(savedPayment.getAmount()).currency(savedPayment.getCurrency())
				.exchangeRate(savedPayment.getExchangeRate()).krwAmount(savedPayment.getKrwAmount())
				.paymentAt(savedPayment.getPaymentAt()).result(true).msg("결제가 완료되었습니다.").build();

	}

	@Transactional
	public TripEntity connectTrip(PaymentDto paymentDto, Long userId) {

		PaymentEntity payment = paymentRepo.findById(paymentDto.getPaymentId())
				.orElseThrow(() -> new RuntimeException("결제 내역이 존재하지 않습니다."));

		if (!payment.getUser().getUserId().equals(userId.intValue())) {
			throw new RuntimeException("본인의 결제만 수정할 수 있습니다.");
		}

		TripEntity trip = tripRepo.findById(paymentDto.getTripId())
				.orElseThrow(() -> new RuntimeException("여행이 존재하지 않습니다."));

		payment.setTrip(trip);

		return trip;
	}

	@Transactional(readOnly = true)
	public PaymentDto getPayment(Integer paymentId, Long userId) {

		PaymentEntity payment = paymentRepo.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("결제 내역이 존재하지 않습니다."));

		// 본인 결제 확인
		if (!payment.getUser().getUserId().equals(userId.intValue())) {
			throw new RuntimeException("본인의 결제 내역만 조회할 수 있습니다.");
		}

		String tripTitle = null;
		Integer tripId = null;

		if (payment.getTrip() != null) {
			tripId = payment.getTrip().getTripId();
			tripTitle = payment.getTrip().getTripTitle();
		}

		return PaymentDto.builder().paymentId(payment.getPaymentId()).tripId(tripId).tripTitle(tripTitle)
				.merchantName(payment.getMerchantName()).amount(payment.getAmount()).currency(payment.getCurrency())
				.exchangeRate(payment.getExchangeRate()).krwAmount(payment.getKrwAmount())
				.paymentAt(payment.getPaymentAt()).result(true).msg("결제 조회가 완료되었습니다.").build();
	}

	@Transactional(readOnly = true)
	public List<PaymentDto> getPaymentList(Long userId) {

		List<PaymentEntity> payments = paymentRepo.findByUser_UserIdOrderByPaymentAtDesc(userId);

		return payments.stream()
				.map(payment -> PaymentDto.builder().paymentId(payment.getPaymentId())
						.tripId(payment.getTrip() != null ? payment.getTrip().getTripId() : null)
						.tripTitle(payment.getTrip() != null ? payment.getTrip().getTripTitle() : null)
						.merchantName(payment.getMerchantName()).amount(payment.getAmount())
						.currency(payment.getCurrency()).exchangeRate(payment.getExchangeRate())
						.krwAmount(payment.getKrwAmount()).paymentAt(payment.getPaymentAt()).result(true).build())
				.toList();
	}

}
