package com.triply.user;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.triply.global.jwt.JwtProvider;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Tag(name = "회원", description = "회원 CRUD API")
@RestController
@RequestMapping("/api-server/v1")
public class UserController {

	private final PasswordEncoder passwordEncoder;
	private final UserService userService;
	private final JwtProvider tokenProvider;

	@Operation(summary = "회원가입")
	@PostMapping("/auth/join")
	public ResponseEntity<?> joinUser(@RequestBody UserDto userDto) {
		try {
			UserEntity user = UserEntity.builder().userName(userDto.getUserName()).loginId(userDto.getLoginId())
					.loginPw(passwordEncoder.encode(userDto.getLoginPw())).userPhone(userDto.getUserPhone()).build();

			UserEntity registeredUser = userService.joinUser(user);
			UserDto responseUserDTO = UserDto.builder().result(true).msg("회원가입이 완료되었습니다").build();

			return ResponseEntity.ok().body(responseUserDTO);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "아이디 중복확인")
	@PostMapping("/auth/idCheck")
	public ResponseEntity<?> checkUser(@RequestBody UserDto userDto) {
		try {
			UserEntity user = userService.findByLoginId(userDto.getLoginId());
			UserDto responseUserDTO;
			if (user != null) {
				// 중복 회원 존재
				responseUserDTO = UserDto.builder().result(false).msg("사용할 수 없는 닉네임입니다.").build();
			} else {
				responseUserDTO = UserDto.builder().result(true).msg("사용가능한 닉네임입니다.").build();
			}
			return ResponseEntity.ok().body(responseUserDTO);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}

	@Operation(summary = "전화번호 본인확인")
	@GetMapping("/auth/phoneCheck")
	public ResponseEntity<?> checkPhone() {

		int code = (int) (Math.random() * 900000) + 100000;

		return ResponseEntity.ok().body(Map.of("code", code));
	}

	@Operation(summary = "로그인")
	@PostMapping("/auth/signin")
	public ResponseEntity<?> loginUser(@RequestBody UserDto userDto) {
		UserEntity user = userService.getByCredentials(userDto.getLoginId(), userDto.getLoginPw());

		UserDto responseUserDTO;
		if (user != null) {
			String token = tokenProvider.createToken(user.getUserId());
			responseUserDTO = UserDto.builder().result(true).msg("로그인이 완료되었습니다").token(token).build();

			return ResponseEntity.ok().body(responseUserDTO);
		} else {
			responseUserDTO = UserDto.builder().result(false).msg("아이디 또는 비밀번호가 일치하지 않습니다").build();
			return ResponseEntity.ok().body(responseUserDTO);
		}
	}

	// 회원 정보 조회
	@Operation(summary = "프로필 조회")
	@GetMapping("/getProfile")
	public ResponseEntity<?> getUser(@AuthenticationPrincipal Long userId) {

		UserEntity userEntity = userService.getUser(userId);

		if (userEntity == null) {
			return ResponseEntity.notFound().build();
		}

		UserDto user = UserDto.builder().userName(userEntity.getUserName()).loginId(userEntity.getLoginId())
				.userPhone(userEntity.getUserPhone()).result(true).build();

		return ResponseEntity.ok(user);
	}

	// 회원정보 수정
	@Operation(summary = "프로필 정보 수정, 비밀번호는 X")
	@PatchMapping("/patchProfile")
	public ResponseEntity<?> updateUser(@RequestBody UserDto userDto, @AuthenticationPrincipal Long userId) {
		try {

			UserEntity user = userService.updateUser(userDto, userId);

			// 응답용
			UserDto responseUserDTO = UserDto.builder().userName(user.getUserName()).loginId(user.getLoginId())
					.userPhone(user.getUserPhone()).result(true).msg("회원정보 수정이 완료되었습니다").build();

			return ResponseEntity.ok().body(responseUserDTO);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}

	@Operation(summary = "비밀번호 변경")
	@PatchMapping("/patchPw")
	public ResponseEntity<?> patchPw(@RequestBody PatchPwDto patchPwDto, @AuthenticationPrincipal Long userId) {
		try {
			UserEntity userEntity = userService.getByCredentialsPw(patchPwDto.getUserPw(), userId);
			UserDto responseUserDTO;
			if (userEntity != null) {
				// 현재 비밀번호 일치 확인 후 비밀번호 수정
				UserDto user = UserDto.builder().loginPw(passwordEncoder.encode(patchPwDto.getNewUserPw())).build();
				UserEntity updateUser = userService.updateUserPw(user, userId);
				responseUserDTO = UserDto.builder().result(true).msg("비밀번호 수정이 완료되었습니다").build();
			} else {
				responseUserDTO = UserDto.builder().result(false).msg("현재 비밀번호가 일치하지 않습니다").build();
			}

			return ResponseEntity.ok().body(responseUserDTO);
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}

	}

}
