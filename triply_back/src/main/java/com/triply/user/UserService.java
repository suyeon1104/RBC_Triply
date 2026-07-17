package com.triply.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserService {
	private final UserRepository userRepo;
	final private BCryptPasswordEncoder bCryptPasswordEncoder;

	public UserEntity joinUser(UserEntity user) {
		UserEntity newUser = userRepo.save(user);
		return newUser;
	}

	public UserEntity findByLoginId(String loginId) {
		return userRepo.findByLoginId(loginId);
	}

	public UserEntity getByCredentials(String loginId, String loginPw) {

		UserEntity user = userRepo.findByLoginId(loginId);

		if (user != null && bCryptPasswordEncoder.matches(loginPw, user.getLoginPw())) {
			return user;
		} else
			return null;
	}

	public UserEntity getUser(Long userId) {
		UserEntity user = userRepo.findByUserId(userId);

		if (user != null) {
			return user;
		} else
			return null;
	}

	public UserEntity updateUser(UserDto userDto, Long userId) {
		UserEntity userEntity = userRepo.findByUserId(userId);

		UserEntity updateUser = UserEntity.builder().userId(userEntity.getUserId()).userName(userDto.getUserName())
				.loginId(userEntity.getLoginId()).loginPw(userEntity.getLoginPw()).userPhone(userDto.getUserPhone())
				.build();

		return userRepo.save(updateUser);
	}

	public UserEntity getByCredentialsPw(String userPw, Long userId) {
		UserEntity user = userRepo.findByUserId(userId);

		if (user != null && bCryptPasswordEncoder.matches(userPw, user.getLoginPw())) {
			return user;
		} else
			return null;
	}

	public UserEntity updateUserPw(UserDto user, Long userId) {
		UserEntity userEntity = userRepo.findByUserId(userId);

		userEntity.setLoginPw(user.getLoginPw());

		return userRepo.save(userEntity);
	}

}
