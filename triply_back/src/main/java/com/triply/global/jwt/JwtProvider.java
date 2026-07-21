package com.triply.global.jwt;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtProvider {

	// 사용법 JwtProvider.createToken(userId)

	// jwt.secret=${JWT_SECRET}로 꼭 나중에 빼주기!!!!!!!!!!
	private final SecretKey key = Keys
			.hmacShaKeyFor("test-secret-key-test-secret-key-test-secret-key".getBytes(StandardCharsets.UTF_8));

	private final long expirationTime = 1000 * 60 * 60 * 24;// 24시간

	// JWT 생성
	public String createToken(Integer userId) {

		Date now = new Date();

		return Jwts.builder().subject(String.valueOf(userId)).issuedAt(now)
				.expiration(new Date(now.getTime() + expirationTime)).signWith(key).compact();
	}

	// JWT 검증 + userId 반환
	public Long validateAndGetUserId(String token) {

		Claims claims = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload();

		return Long.parseLong(claims.getSubject());
	}
}
