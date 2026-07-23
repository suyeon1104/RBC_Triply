package com.triply.group;

import java.time.LocalDateTime;
import java.util.List;

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
public class GroupDetailDto {

	// 그룹 정보
	private Integer groupId;
	private String groupTitle;
	private LocalDateTime createdAt;

	// 연결된 플래너 개수
	private Integer plannerCount;

	// 그룹 멤버
	private List<GroupMemberDto> members;

	// 초대 중인 멤버
	private List<PendingMemberDto> pendingMembers;

	// response
	private boolean result;
	private String msg;
}
