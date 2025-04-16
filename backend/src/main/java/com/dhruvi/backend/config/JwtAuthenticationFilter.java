package com.dhruvi.backend.config;

import com.dhruvi.backend.service.JwtUtil;
import com.dhruvi.backend.model.User;
import com.dhruvi.backend.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        String jwt = null;
        String email = null;

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7); // remove "Bearer "
            email = jwtUtil.extractUsername(jwt);
            System.out.println("📬 Extracted email from token: " + email);
        }

        // If email is found and no current authentication exists
        if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            System.out.println("📬 Extracted email from token: " + email);
            System.out.println("👀 Searching user by email...");
            Optional<User> userOptional = userRepository.findByEmailIgnoreCase(email);
            System.out.println("✅ User present: " + userOptional.isPresent());

            if (userOptional.isPresent() && jwtUtil.validateToken(jwt, userOptional.get())) {
                User user = userOptional.get();

                // ✅ Provide at least one role/authority
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        filterChain.doFilter(request, response);
    }
}
