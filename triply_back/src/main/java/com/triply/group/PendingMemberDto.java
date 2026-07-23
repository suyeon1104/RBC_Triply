package com.triply.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PendingMemberDto {

	private Integer invitationId;

	private Integer userId;

	private String userName;

	private String userImg;

	private InvitationStatus status;
}