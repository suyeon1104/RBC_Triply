package com.triply.wallet;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletRepository extends JpaRepository<WalletEntity, Integer> {

	boolean existsByUser_UserId(Long userId);

	WalletEntity findByUser_UserId(Long userId);

}
