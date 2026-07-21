package com.triply.user;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Service
public class UserServiceImpl implements UserService {
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

	public void patchPw(PatchPwDto patchPwDto, Long userId) {

		UserEntity user = userRepo.findByUserId(userId);

		if (user == null) {
			throw new RuntimeException("사용자를 찾을 수 없습니다.");
		}

		if (!bCryptPasswordEncoder.matches(patchPwDto.getUserPw(), user.getLoginPw())) {
			throw new RuntimeException("기존 비밀번호가 일치하지 않습니다.");
		}

		user.setLoginPw(bCryptPasswordEncoder.encode(patchPwDto.getNewUserPw()));

		userRepo.save(user);
	}

}
