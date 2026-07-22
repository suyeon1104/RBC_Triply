package com.triply.payment;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.exchange.ExchangeRateEntity;
import com.triply.exchange.ExchangeRateRepository;
import com.triply.group.GroupMemberRepository;
import com.triply.settlement.SettlementRepository;
import com.triply.trip.TripEntity;
import com.triply.trip.TripRepository;
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
	private final TripRepository tripRepo;
	private final GroupMemberRepository groupMemberRepo;
	private final SettlementRepository settlementRepo;

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
		ExchangeRateEntity exchangeRate = exchangeRateRepo.findByCurrency(mockPayment.getCurrency())
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

		// 7. 오늘 진행 중인 여행 조회
		LocalDate today = LocalDate.now();

		Optional<TripEntity> trip = tripRepo
				.findByUser_UserIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(userId, today, today);

		// 8. 결제 저장 (여행이 있으면 자동 연결)
		PaymentEntity payment = PaymentEntity.builder().user(wallet.getUser()).trip(trip.orElse(null))
				.merchantName(mockPayment.getMerchantName()).amount(mockPayment.getAmount())
				.currency(mockPayment.getCurrency()).exchangeRate(exchangeRate.getRate()).krwAmount(krwAmount).build();

		PaymentEntity savedPayment = paymentRepo.save(payment);

		// 9. 지갑 거래내역 저장
		WalletTransactionEntity transaction = WalletTransactionEntity.builder().wallet(wallet).payment(savedPayment)
				.type(TransactionType.PAYMENT).amount(krwAmount).balanceAfter(afterBalance).build();

		walletTransactionRepo.save(transaction);

		// 10. 응답
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

		if (payment.getTrip() != null) {
			throw new RuntimeException("이미 여행에 연결된 결제입니다.");
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

//	@Transactional(readOnly = true)
//	public List<PaymentDto> getPaymentList(Long userId) {
//
//		List<PaymentEntity> payments = paymentRepo.findByUser_UserIdOrderByPaymentAtDesc(userId);
//
//		return payments.stream()
//				.map(payment -> PaymentDto.builder().paymentId(payment.getPaymentId())
//						.tripId(payment.getTrip() != null ? payment.getTrip().getTripId() : null)
//						.tripTitle(payment.getTrip() != null ? payment.getTrip().getTripTitle() : null)
//						.merchantName(payment.getMerchantName()).amount(payment.getAmount())
//						.currency(payment.getCurrency()).exchangeRate(payment.getExchangeRate())
//						.krwAmount(payment.getKrwAmount()).paymentAt(payment.getPaymentAt()).result(true).build())
//				.toList();
//	}

	@Transactional(readOnly = true)
	public PaymentDto checkSettlement(Integer paymentId, Long userId) {

		// 1. 결제 조회
		PaymentEntity payment = paymentRepo.findById(paymentId)
				.orElseThrow(() -> new RuntimeException("결제 내역이 존재하지 않습니다."));

		// 2. 본인 결제인지 확인
		if (!payment.getUser().getUserId().equals(userId.intValue())) {
			throw new RuntimeException("본인의 결제만 조회할 수 있습니다.");
		}

		// 3. 여행 연결 여부 확인
		if (payment.getTrip() == null) {
			return PaymentDto.builder().result(false).msg("결제를 먼저 여행에 연결해주세요.").build();
		}

		// 4. 그룹 연결 여부 확인
		if (payment.getTrip().getGroup() == null) {
			return PaymentDto.builder().result(false).msg("여행에 그룹을 연결해주세요.").build();
		}

		// 5. 그룹원 수 확인
		long memberCount = groupMemberRepo.countByGroup(payment.getTrip().getGroup());

		if (memberCount < 2) {
			return PaymentDto.builder().result(false).msg("그룹원이 2명 이상이어야 합니다.").build();
		}

		// 6. 이미 정산 요청 여부
		if (settlementRepo.existsByPayment(payment)) {
			return PaymentDto.builder().result(false).msg("이미 정산이 요청된 결제입니다.").build();
		}

		// 7. 정산 가능
		return PaymentDto.builder().result(true).msg("정산이 가능합니다.").build();
	}

	@Transactional(readOnly = true)
	public List<PaymentDto> getPaymentListByTrip(Integer tripId, Long userId) {

		TripEntity trip = tripRepo.findById(tripId).orElseThrow(() -> new RuntimeException("여행이 존재하지 않습니다."));

		// 그룹 여행이면 그룹원 확인
		if (trip.getGroup() != null) {

			boolean isMember = groupMemberRepo.existsByGroupAndUser_UserId(trip.getGroup(), userId);

			if (!isMember) {
				throw new RuntimeException("여행 멤버만 조회할 수 있습니다.");
			}

		} else {

			// 개인 여행이면 생성자 확인
			if (!trip.getUser().getUserId().equals(userId.intValue())) {
				throw new RuntimeException("본인의 여행만 조회할 수 있습니다.");
			}
		}

		List<PaymentEntity> payments = paymentRepo.findByTrip_TripIdOrderByPaymentAtDesc(tripId);

		return payments.stream().map(payment -> PaymentDto.builder().paymentId(payment.getPaymentId()).tripId(tripId)
				.tripTitle(trip.getTripTitle()).merchantName(payment.getMerchantName()).amount(payment.getAmount())
				.currency(payment.getCurrency()).exchangeRate(payment.getExchangeRate())
				.krwAmount(payment.getKrwAmount()).paymentAt(payment.getPaymentAt()).result(true).build()).toList();
	}

}
