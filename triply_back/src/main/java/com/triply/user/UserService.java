package com.triply.user;

public interface UserService {
	UserEntity joinUser(UserEntity user);

	UserEntity findByLoginId(String loginId);

	UserEntity getByCredentials(String loginId, String loginPw);

	UserEntity getUser(Long userId);

	UserEntity updateUser(UserDto userDto, Long userId);

	void patchPw(PatchPwDto patchPwDto, Long userId);
}
