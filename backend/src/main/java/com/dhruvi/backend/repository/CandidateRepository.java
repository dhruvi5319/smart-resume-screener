package com.dhruvi.backend.repository;

import com.dhruvi.backend.model.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
}
