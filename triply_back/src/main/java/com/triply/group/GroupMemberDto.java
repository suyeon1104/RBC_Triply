package com.triply.group;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupMemberDto {

	private Integer userId;

	private String userName;

	private String userImg;

	private GroupRole role;

	private Boolean me;

}
