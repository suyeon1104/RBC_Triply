package com.triply.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Setter
public class GroupInvitationDto {

	// 요청용
	private Integer groupId;
	private String loginId;

	// 응답용
	private Integer invitationId;
	private String senderName;
	private String receiverName;
	private String groupName;
	private InvitationStatus status;
	private String message; // 없어도?

}
