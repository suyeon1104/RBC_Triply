package com.triply.user;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "테스트용", description = "회원 CRUD API")
@RestController
@RequestMapping("/member")
public class MemberController {
	
	private final MemberRepository memberRepo;

	public MemberController(MemberRepository memberRepo) {
		this.memberRepo = memberRepo;
	}
	
	@Operation(summary = "회원 저장")
	@PostMapping("/save")
	public String save() {
		MemberEntity member = new MemberEntity();
		member.setName("홍길동");
		member.setAge(20);

		memberRepo.save(member);
		return "저장 완료";
	}

}
