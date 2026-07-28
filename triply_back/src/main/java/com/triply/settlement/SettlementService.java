package com.triply.settlement;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.group.GroupEntity;
import com.triply.group.GroupMemberRepository;
import com.triply.group.GroupRepository;
import com.triply.notification.NotificationEntity;
import com.triply.notification.NotificationService;
import com.triply.notification.NotificationType;
import com.triply.notification.SettlementNotificationCreator;
import com.triply.payment.PaymentEntity;
import com.triply.payment.PaymentRepository;
import com.triply.trip.TripEntity;
import com.triply.trip.TripRepository;
import com.triply.user.UserEntity;
import com.triply.user.UserRepository;
import com.triply.wallet.TransactionType;
import com.triply.wallet.WalletEntity;
import com.triply.wallet.WalletRepository;
import com.triply.wallet.WalletTransactionEntity;
import com.triply.wallet.WalletTransactionRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class SettlementService {

	private final WalletRepository walletRepo;
	private final PaymentRepository paymentRepo;
	private final WalletTransactionRepository walletTransactionRepo;
	private final TripRepository tripRepo;
	private final GroupMemberRepository groupMemberRepo;
	private final GroupRepository groupRepo;
	private final SettlementRepository settlementRepo;
	private final UserRepository userRepo;
	private final NotificationService notificationService;
	private final SettlementNotificationCreator settlementCreator;

	@Transactional
	public SettlementDto requestSettlement(SettlementDto settlementDto, Long userId) {

		// 1. 결제 조회
		PaymentEntity payment = paymentRepo.findById(settlementDto.getPaymentId())
				.orElseThrow(() -> new RuntimeException("결제 내역이 존재하지 않습니다."));

		// 2. 본인 결제인지 확인
		if (!payment.getUser().getUserId().equals(userId.intValue())) {
			throw new RuntimeException("본인의 결제만 정산 요청할 수 있습니다.");
		}

		// 3. 여행 연결 여부
		if (payment.getTrip() == null) {
			throw new RuntimeException("결제일에 해당하는 여행 정보가 없어 정산 요청이 불가능합니다.");
		}

		// 4. 그룹 연결 여부
		if (payment.getTrip().getGroup() == null) {
			throw new RuntimeException("여행에 그룹을 연결해주세요.");
		}

		// 5. 그룹원 수 확인
		long memberCount = groupMemberRepo.countByGroup(payment.getTrip().getGroup());

		if (memberCount < 2) {
			throw new RuntimeException("그룹원이 2명 이상이어야 합니다.");
		}

		// 6. 이미 정산 요청된 결제인지 확인
		if (settlementRepo.existsByPayment(payment)) {
			throw new RuntimeException("이미 정산이 요청된 결제입니다.");
		}

		// 7. 요청 목록 확인
		if (settlementDto.getSettlements() == null || settlementDto.getSettlements().isEmpty()) {
			throw new RuntimeException("정산 대상을 선택해주세요.");
		}

		// 8. 전체 정산 금액 검증
		long totalAmount = settlementDto.getSettlements().stream().mapToLong(SettlementRequestDto::getAmount).sum();

		if (totalAmount > payment.getKrwAmount()) {
			throw new RuntimeException("전체 정산 금액이 결제 금액을 초과합니다.");
		}

		// 9. 각 정산 요청 저장
		for (SettlementRequestDto request : settlementDto.getSettlements()) {

			// 9-1. 사용자 조회
			UserEntity fromUser = userRepo.findByUserId(request.getFromUserId().longValue());

			if (fromUser == null) {
				throw new RuntimeException("사용자가 존재하지 않습니다.");
			}

			// 9-2. 본인에게 요청 불가
			if (fromUser.getUserId().equals(payment.getUser().getUserId())) {
				throw new RuntimeException("본인에게는 정산을 요청할 수 없습니다.");
			}

			// 9-3. 그룹 멤버인지 확인
			boolean isMember = groupMemberRepo.existsByGroup_GroupIdAndUser_UserId(
					payment.getTrip().getGroup().getGroupId(), fromUser.getUserId());

			if (!isMember) {
				throw new RuntimeException("그룹 멤버에게만 정산을 요청할 수 있습니다.");
			}

			// 9-4. 금액 검증
			if (request.getAmount() == null || request.getAmount() <= 0) {
				throw new RuntimeException("정산 금액이 올바르지 않습니다.");
			}

			if (request.getAmount() > payment.getKrwAmount()) {
				throw new RuntimeException("결제 금액보다 큰 금액은 요청할 수 없습니다.");
			}

			// 9-5. 정산 저장
			SettlementEntity settlement = SettlementEntity.builder().payment(payment).fromUser(fromUser)
					.toUser(payment.getUser()).amount(request.getAmount()).status(SettlementStatus.PENDING).build();

			settlement = settlementRepo.save(settlement);

			// 알림 생성
			NotificationEntity notification = settlementCreator.create(settlement);

			notificationService.save(notification);
		}

		// 10. 응답
		return SettlementDto.builder().result(true).msg("정산 요청이 완료되었습니다.").build();
	}

	@Transactional(readOnly = true)
	public List<SettlementResponseDto> getSettlementList(Integer tripId, Long userId) {

		// 1. 여행 조회
		TripEntity trip = tripRepo.findById(tripId).orElseThrow(() -> new RuntimeException("여행이 존재하지 않습니다."));

		// 2. 여행 접근 권한 확인
		if (trip.getGroup() != null) {

			boolean isMember = groupMemberRepo.existsByGroupAndUser_UserId(trip.getGroup(), userId);

			if (!isMember) {
				throw new RuntimeException("여행 멤버만 조회할 수 있습니다.");
			}

		} else {

			if (!trip.getUser().getUserId().equals(userId.intValue())) {
				throw new RuntimeException("본인의 여행만 조회할 수 있습니다.");
			}
		}

		// 3. 해당 여행의 정산 조회
		List<SettlementEntity> settlements = settlementRepo.findByPayment_Trip_TripIdOrderByRequestedAtDesc(tripId);

		// 4. DTO 변환
		return settlements.stream().filter(settlement -> settlement.getFromUser().getUserId().equals(userId.intValue())
				|| settlement.getToUser().getUserId().equals(userId.intValue())).map(settlement -> {

					String myRole = null;

					if (settlement.getFromUser().getUserId().equals(userId.intValue())) {
						myRole = "SENDER";
					} else if (settlement.getToUser().getUserId().equals(userId.intValue())) {
						myRole = "RECEIVER";
					}

					return SettlementResponseDto.builder().settlementId(settlement.getSettlementId())

							.paymentId(settlement.getPayment().getPaymentId())

							.fromUserId(settlement.getFromUser().getUserId())
							.fromUserName(settlement.getFromUser().getUserName())

							.toUserId(settlement.getToUser().getUserId())
							.toUserName(settlement.getToUser().getUserName())

							.amount(settlement.getAmount())

							.status(settlement.getStatus())

							.requestedAt(settlement.getRequestedAt()).completedAt(settlement.getCompletedAt())

							.myRole(myRole)

							.build();
				}).toList();
	}

	@Transactional
	public SettlementResponseDto completeSettlement(Integer settlementId, Long userId) {

		// 1. 정산 조회
		SettlementEntity settlement = settlementRepo.findById(settlementId)
				.orElseThrow(() -> new RuntimeException("정산 내역이 존재하지 않습니다."));

		// 2. 정산 처리자가 돈 보내는 사람인지 확인
		if (!settlement.getFromUser().getUserId().equals(userId.intValue())) {
			throw new RuntimeException("본인의 정산만 처리할 수 있습니다.");
		}

		// 3. 정산 상태 확인
		if (settlement.getStatus() != SettlementStatus.PENDING) {
			throw new RuntimeException("처리 가능한 정산이 아닙니다.");
		}

		// 4. 보내는 사람 지갑 조회
		WalletEntity fromWallet = walletRepo.findByUser_UserId(settlement.getFromUser().getUserId().longValue());

		if (fromWallet == null) {
			throw new RuntimeException("보내는 사람의 지갑이 존재하지 않습니다.");
		}

		// 5. 받는 사람 지갑 조회
		WalletEntity toWallet = walletRepo.findByUser_UserId(settlement.getToUser().getUserId().longValue());

		if (toWallet == null) {
			throw new RuntimeException("받는 사람의 지갑이 존재하지 않습니다.");
		}

		// 6. 잔액 확인
		Long amount = settlement.getAmount();

		if (fromWallet.getBalance() < amount) {
			throw new RuntimeException("지갑 잔액이 부족합니다.");
		}

		// 7. 지갑 잔액 변경
		fromWallet.setBalance(fromWallet.getBalance() - amount);

		toWallet.setBalance(toWallet.getBalance() + amount);

		// 8. 보내는 사람 지갑 거래내역
		WalletTransactionEntity sendTransaction = WalletTransactionEntity.builder().wallet(fromWallet)
				.settlement(settlement).type(TransactionType.SETTLEMENT_OUT).amount(amount)
				.balanceAfter(fromWallet.getBalance()).build();

		// 9. 받는 사람 지갑 거래내역
		WalletTransactionEntity receiveTransaction = WalletTransactionEntity.builder().wallet(toWallet)
				.settlement(settlement).type(TransactionType.SETTLEMENT_IN).amount(amount)
				.balanceAfter(toWallet.getBalance()).build();

		walletTransactionRepo.save(sendTransaction);
		walletTransactionRepo.save(receiveTransaction);

		// 10. 정산 상태 변경
		settlement.setStatus(SettlementStatus.COMPLETED);
		settlement.setCompletedAt(LocalDateTime.now());

		// 11. 정산 요청 알림 삭제
		notificationService.deleteNotification(settlement.getSettlementId(), NotificationType.SETTLEMENT_REQUEST,
				settlement.getFromUser().getUserId());

		// 12. 응답
		return SettlementResponseDto.builder().settlementId(settlement.getSettlementId())

				.paymentId(settlement.getPayment().getPaymentId())

				.fromUserId(settlement.getFromUser().getUserId()).fromUserName(settlement.getFromUser().getUserName())

				.toUserId(settlement.getToUser().getUserId()).toUserName(settlement.getToUser().getUserName())

				.amount(settlement.getAmount())

				.status(settlement.getStatus())

				.requestedAt(settlement.getRequestedAt()).completedAt(settlement.getCompletedAt())

				.build();
	}

	@Transactional(readOnly = true)
	public List<SettlementResponseDto> getGroupSettlement(Integer groupId, Long userId) {

		// 그룹 존재 여부
		GroupEntity group = groupRepo.findById(groupId).orElseThrow(() -> new RuntimeException("그룹이 존재하지 않습니다."));

		// 그룹 멤버인지 확인
		boolean isMember = groupMemberRepo.existsByGroupAndUser_UserId(group, userId);

		if (!isMember) {
			throw new RuntimeException("그룹 멤버만 조회할 수 있습니다.");
		}

		// 해당 그룹 + 로그인 사용자의 정산만 조회
		List<SettlementEntity> settlements = settlementRepo.findByGroupIdAndUserId(groupId, userId.intValue());

		return settlements.stream().map(settlement -> SettlementResponseDto.builder()
				.settlementId(settlement.getSettlementId()).paymentId(settlement.getPayment().getPaymentId())
				.fromUserId(settlement.getFromUser().getUserId()).fromUserName(settlement.getFromUser().getUserName())
				.toUserId(settlement.getToUser().getUserId()).toUserName(settlement.getToUser().getUserName())
				.amount(settlement.getAmount()).status(settlement.getStatus()).requestedAt(settlement.getRequestedAt())
				.completedAt(settlement.getCompletedAt())
				.myRole(settlement.getFromUser().getUserId().equals(userId.intValue()) ? "SENDER" : "RECEIVER").build())
				.toList();
	}

	@Transactional(readOnly = true)
	public List<SettlementResponseDto> getSettlementByPayment(Integer paymentId, Long userId) {

		// 결제별 정산 조회
		List<SettlementEntity> settlements = settlementRepo.findByPayment_PaymentId(paymentId);

		if (settlements.isEmpty()) {
			throw new RuntimeException("정산 내역이 존재하지 않습니다.");
		}

		return settlements.stream().map(settlement -> {

			String myRole = null;

			// 로그인 유저 기준 역할 확인
			if (settlement.getFromUser().getUserId().equals(userId.intValue())) {

				// 돈 보내는 사람
				myRole = "SENDER";

			} else if (settlement.getToUser().getUserId().equals(userId.intValue())) {

				// 돈 받는 사람
				myRole = "RECEIVER";
			}

			return SettlementResponseDto.builder()

					.settlementId(settlement.getSettlementId())

					.paymentId(settlement.getPayment().getPaymentId())

					.fromUserId(settlement.getFromUser().getUserId())
					.fromUserName(settlement.getFromUser().getUserName())

					.toUserId(settlement.getToUser().getUserId()).toUserName(settlement.getToUser().getUserName())

					.amount(settlement.getAmount())

					.status(settlement.getStatus())

					.requestedAt(settlement.getRequestedAt())

					.completedAt(settlement.getCompletedAt())

					.myRole(myRole)

					.build();

		}).toList();
	}

}
