package com.triply.user;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<UserEntity, Integer> {
	UserEntity findByLoginId(String loginId);

	UserEntity findByUserId(Long userId);
}
