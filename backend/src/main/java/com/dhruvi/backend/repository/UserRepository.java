package com.dhruvi.backend.repository;

import com.dhruvi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    // ✅ Add this line
    Optional<User> findByEmailIgnoreCase(String email);

    boolean existsByEmail(String email);
}