package com.triply.wallet;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface WalletTransactionRepository extends JpaRepository<WalletTransactionEntity, Integer> {

	List<WalletTransactionEntity> findByWalletOrderByTransactionAtDescTransactionIdDesc(WalletEntity wallet);

}
