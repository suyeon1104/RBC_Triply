package com.triply.wallet;

import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import com.triply.user.UserEntity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Setter
@Getter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class WalletEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer walletId;

	@Builder.Default
	@Column(nullable = false)
	private Long balance = 0L;

	@UpdateTimestamp
	@Column(nullable = false)
	private LocalDateTime updatedAt;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id", nullable = false, unique = true)
	private UserEntity user;
}
