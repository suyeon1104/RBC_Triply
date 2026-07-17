package com.triply.global.jwt;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

	private final JwtProvider jwtProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {

		System.out.println("REQUEST : " + request.getRequestURI());
		String token = resolveToken(request);

		if (token != null) {

			try {

				Long userId = jwtProvider.validateAndGetUserId(token);

				UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userId,
						null, AuthorityUtils.NO_AUTHORITIES);

				SecurityContextHolder.getContext().setAuthentication(authentication);

			} catch (Exception e) {

				SecurityContextHolder.clearContext();
			}
		}

		filterChain.doFilter(request, response);
	}

	private String resolveToken(HttpServletRequest request) {

		String bearer = request.getHeader("Authorization");

		if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {

			return bearer.substring(7);
		}

		return null;
	}
}
