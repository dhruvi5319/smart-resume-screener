package com.dhruvi.backend.repository;

import com.dhruvi.backend.model.Candidate;
import com.dhruvi.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CandidateRepository extends JpaRepository<Candidate, String> {
    List<Candidate> findByUploadedBy(User uploadedBy); // ✅ Filter by user
}
