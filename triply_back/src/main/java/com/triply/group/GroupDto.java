package com.triply.group;

import java.time.LocalDateTime;

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
public class GroupDto {

	private Integer groupId;
	private String groupTitle;
	private LocalDateTime createdAt;

	// response
	private boolean result;
	private String msg;
}
