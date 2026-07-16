package com.triply.user;

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
public class UserDto {

	private Integer userId;

	private String loginId;

	private String loginPw;

	private String userName;

	private String userPhone;

	private String userImg;

	// response
	private boolean result;
	private String msg;

	// token
	private String token;
}
