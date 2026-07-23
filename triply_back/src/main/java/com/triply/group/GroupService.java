package com.triply.group;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.triply.notification.GroupInviteNotificationCreator;
import com.triply.notification.NotificationEntity;
import com.triply.notification.NotificationService;
import com.triply.notification.NotificationType;
import com.triply.trip.TripRepository;
import com.triply.user.UserEntity;
import com.triply.user.UserRepository;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class GroupService {
	private final GroupRepository groupRepo;
	private final GroupMemberRepository groupMemberRepo;
	private final GroupInvitationRepository inviteRepo;
	private final UserRepository userRepo;
	private final TripRepository tripRepo;
	private final NotificationService notificationService;
	private final GroupInviteNotificationCreator groupInviteCreator;

	@Transactional
	public GroupEntity createGroup(GroupDto groupDto, Long userId) {

		// 로그인한 사용자 조회
		UserEntity user = userRepo.findByUserId(userId);

		// 그룹 생성
		GroupEntity group = GroupEntity.builder().groupTitle(groupDto.getGroupTitle()).user(user).build();

		group = groupRepo.save(group);

		// 그룹 생성자를 멤버로 등록
		GroupMemberEntity member = GroupMemberEntity.builder().group(group).user(user).role(GroupRole.OWNER).build();

		groupMemberRepo.save(member);

		return group;
	}

	public List<GroupEntity> getGroup(Long userId) {
		List<GroupMemberEntity> members = groupMemberRepo.findByUser_UserId(userId.intValue());

		return members.stream().map(member -> member.getGroup()).toList();
	}

	public GroupInvitationEntity inviteGroup(GroupInvitationDto inviteDto, Long userId) {
		// 초대 보내는 사용자 조회
		UserEntity sender = userRepo.findByUserId(userId);
		if (sender == null) {
			throw new IllegalArgumentException("초대를 보내는 사용자를 찾을 수 없습니다.");
		}

		// 초대 받는 사용자 조회
		UserEntity receiver = userRepo.findByLoginId(inviteDto.getLoginId());
		if (receiver == null) {
			throw new IllegalArgumentException("초대할 사용자가 존재하지 않습니다.");
		}

		// 초대하려는 그룹 조회
		GroupEntity group = groupRepo.findByGroupId(inviteDto.getGroupId());
		if (group == null) {
			throw new IllegalArgumentException("그룹을 찾을 수 없습니다.");
		}

		// 자기 자신 초대 방지
		if (sender.getUserId().equals(receiver.getUserId())) {
			throw new IllegalArgumentException("자기 자신은 초대할 수 없습니다.");
		}
		// 이미 그룹 멤버인지 확인
		if (groupMemberRepo.existsByGroupAndUser(group, receiver)) {
			throw new IllegalArgumentException("이미 그룹에 속한 사용자입니다.");
		}
		// 이미 대기 중인 초대가 있는지 확인
		if (inviteRepo.existsByGroupAndReceiverAndStatus(group, receiver, InvitationStatus.PENDING)) {
			throw new IllegalArgumentException("이미 초대를 보낸 사용자입니다.");
		}

		GroupInvitationEntity invite = GroupInvitationEntity.builder().sender(sender).receiver(receiver).group(group)
				.status(InvitationStatus.PENDING).build();

		invite = inviteRepo.save(invite);

		// 알림 생성
		NotificationEntity notification = groupInviteCreator.create(invite);

		// 알림 저장
		notificationService.save(notification);

		return invite;
	}

	@Transactional
	public GroupInvitationEntity inviteAnswer(GroupInvitationDto inviteDto, Long userId) {
		GroupInvitationEntity invite = inviteRepo.findByInvitationId(inviteDto.getInvitationId());

		if (invite == null) {
			throw new IllegalArgumentException("초대를 찾을 수 없습니다.");
		}

		// 본인 초대인지 확인
		if (!invite.getReceiver().getUserId().equals(userId.intValue())) {
			throw new IllegalArgumentException("처리 권한이 없습니다.");
		}

		// 이미 처리된 초대인지 확인
		if (invite.getStatus() != InvitationStatus.PENDING) {
			throw new IllegalArgumentException("이미 처리된 초대입니다.");
		}

		if (inviteDto.getStatus() == InvitationStatus.ACCEPTED) {
			// 초대 수락 - 멤버 추가
			GroupMemberEntity member = GroupMemberEntity.builder().group(invite.getGroup()).user(invite.getReceiver())
					.role(GroupRole.MEMBER).build();
			groupMemberRepo.save(member);
			invite.setStatus(InvitationStatus.ACCEPTED);
		} else if (inviteDto.getStatus() == InvitationStatus.REJECTED) {
			// 초대 거절
			invite.setStatus(InvitationStatus.REJECTED);
		}

		invite = inviteRepo.save(invite);

		// 그룹 초대 알림 삭제
		notificationService.deleteNotification(invite.getInvitationId(), NotificationType.GROUP_INVITE,
				invite.getReceiver().getUserId());

		return invite;
	}

	public void leaveGroup(Integer groupId, Long userId) {
		Integer id = userId.intValue();

		GroupMemberEntity member = groupMemberRepo.findByGroup_GroupIdAndUser_UserId(groupId, id);

		if (member.getRole() == GroupRole.OWNER) {
			throw new IllegalArgumentException("그룹장은 탈퇴할 수 없습니다.");
		}

		groupMemberRepo.delete(member);
	}

	@Transactional
	public void deleteGroup(Integer groupId, Long userId) {
		GroupEntity group = groupRepo.findByGroupId(groupId);

		if (group == null) {
			throw new IllegalArgumentException("그룹이 존재하지 않습니다.");
		}

		// 그룹장 확인
		if (!group.getUser().getUserId().equals(userId.intValue())) {
			throw new IllegalArgumentException("그룹 삭제 권한이 없습니다.");
		}

		// 그룹 초대 삭제
		inviteRepo.deleteByGroup(group);

		// 그룹 멤버 삭제
		groupMemberRepo.deleteByGroup(group);

		// 그룹 삭제
		groupRepo.delete(group);

		// 추후 알림 삭제까지 구현할지 고민필요
	}

	@Transactional(readOnly = true)
	public List<GroupMemberDto> getGroupMembers(Integer groupId, Long userId) {

		GroupEntity group = groupRepo.findById(groupId).orElseThrow(() -> new RuntimeException("그룹이 존재하지 않습니다."));

		// 로그인한 사용자가 그룹원인지 확인
		boolean isMember = groupMemberRepo.existsByGroupAndUser_UserId(group, userId);

		if (!isMember) {
			throw new RuntimeException("그룹 멤버만 조회할 수 있습니다.");
		}

		List<GroupMemberEntity> members = groupMemberRepo.findByGroup(group);

		return members.stream()
				.map(member -> GroupMemberDto.builder().userId(member.getUser().getUserId())
						.userName(member.getUser().getUserName()).userImg(member.getUser().getUserImg())
						.role(member.getRole()).me(member.getUser().getUserId().equals(userId.intValue())).build())
				.toList();
	}

	@Transactional(readOnly = true)
	public GroupDetailDto getGroupDetail(Integer groupId, Long userId) {

		// 그룹 존재 여부
		GroupEntity group = groupRepo.findById(groupId).orElseThrow(() -> new RuntimeException("그룹이 존재하지 않습니다."));

		// 로그인한 사용자가 그룹원인지 확인
		boolean isMember = groupMemberRepo.existsByGroupAndUser_UserId(group, userId);

		if (!isMember) {
			throw new RuntimeException("그룹 멤버만 조회할 수 있습니다.");
		}

		// 그룹 멤버 조회 (기존 메서드 재사용)
		List<GroupMemberDto> members = getGroupMembers(groupId, userId);

		// 초대 중인 멤버 조회
		List<PendingMemberDto> pendingMembers = inviteRepo.findByGroupAndStatus(group, InvitationStatus.PENDING)
				.stream()
				.map(invitation -> PendingMemberDto.builder().invitationId(invitation.getInvitationId())
						.userId(invitation.getReceiver().getUserId()).userName(invitation.getReceiver().getUserName())
						.userImg(invitation.getReceiver().getUserImg()).status(invitation.getStatus()).build())
				.toList();

		// 연결된 플래너 개수
		Integer plannerCount = tripRepo.countByGroup(group);

		return GroupDetailDto.builder().groupId(group.getGroupId()).groupTitle(group.getGroupTitle())
				.createdAt(group.getCreatedAt()).plannerCount(plannerCount).members(members)
				.pendingMembers(pendingMembers).result(true).build();
	}

}
