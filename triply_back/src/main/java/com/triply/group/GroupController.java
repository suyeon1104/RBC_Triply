package com.triply.group;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "그룹", description = "그룹 CRUD API")
@RestController
@RequestMapping("/api/v1/group")
public class GroupController {

	private final GroupService groupService;

	@Operation(summary = "그룹생성")
	@PostMapping("/createGroup")
	public ResponseEntity<?> createGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal Long userId) {
		try {

			GroupEntity group = groupService.createGroup(groupDto, userId);

			// 응답
			GroupDto responseGroupDto = GroupDto.builder().groupId(group.getGroupId()).groupTitle(group.getGroupTitle())
					.createdAt(group.getCreatedAt()).result(true).msg("새로운 그룹 추가가 완료되었습니다").build();

			return ResponseEntity.ok().body(responseGroupDto);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹목록 조회")
	@GetMapping("/getGroupList")
	public ResponseEntity<?> getGroupList(@AuthenticationPrincipal Long userId) {

		List<GroupEntity> groups = groupService.getGroup(userId);

		// 가져 온 리스트를 dto에 담아 전달
		List<GroupDto> response = groups.stream().map(group -> GroupDto.builder().groupId(group.getGroupId())
				.groupTitle(group.getGroupTitle()).createdAt(group.getCreatedAt()).result(true).build()).toList();

		return ResponseEntity.ok(response);
	}

	@Operation(summary = "그룹초대")
	@PostMapping("/inviteGroup")
	public ResponseEntity<?> inviteGroup(@RequestBody GroupInvitationDto inviteDto,
			@AuthenticationPrincipal Long userId) {
		try {

			GroupInvitationEntity invite = groupService.inviteGroup(inviteDto, userId);

			GroupInvitationDto responsInviteDto = GroupInvitationDto.builder().invitationId(invite.getInvitationId())
					.senderName(invite.getSender().getUserName()).receiverName(invite.getReceiver().getUserName())
					.groupName(invite.getGroup().getGroupTitle()).status(invite.getStatus()).build();

			return ResponseEntity.ok().body(responsInviteDto);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹초대답변")
	@PatchMapping("/inviteAnswer")
	public ResponseEntity<?> inviteAnswer(@RequestBody GroupInvitationDto inviteDto,
			@AuthenticationPrincipal Long userId) {
		try {
			GroupInvitationEntity invite = groupService.inviteAnswer(inviteDto, userId);

			GroupInvitationDto responsInviteDto = GroupInvitationDto.builder().invitationId(invite.getInvitationId())
					.senderName(invite.getSender().getUserName()).receiverName(invite.getReceiver().getUserName())
					.groupName(invite.getGroup().getGroupTitle()).status(invite.getStatus())
					.message(invite.getStatus() == InvitationStatus.ACCEPTED ? "그룹 초대를 수락했습니다." : "그룹 초대를 거절했습니다.")
					.build();

			return ResponseEntity.ok().body(responsInviteDto);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹 탈퇴")
	@DeleteMapping("/leaveGroup")
	public ResponseEntity<?> leaveGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal Long userId) {

		try {
			groupService.leaveGroup(groupDto.getGroupId(), userId);

			return ResponseEntity.ok(Map.of("msg", "그룹 탈퇴가 완료되었습니다."));

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹 삭제")
	@DeleteMapping("/deleteGroup")
	public ResponseEntity<?> deleteGroup(@RequestBody GroupDto groupDto, @AuthenticationPrincipal Long userId) {

		try {
			groupService.deleteGroup(groupDto.getGroupId(), userId);

			return ResponseEntity.ok(Map.of("msg", "그룹 삭제가 완료되었습니다."));

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "그룹 멤버 조회")
	@GetMapping("/{groupId}/members")
	public ResponseEntity<?> getGroupMembers(@PathVariable("groupId") Integer groupId,
			@AuthenticationPrincipal Long userId) {

		try {

			List<GroupMemberDto> response = groupService.getGroupMembers(groupId, userId);

			return ResponseEntity.ok(response);

		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

}
