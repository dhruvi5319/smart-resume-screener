package com.dhruvi.backend.repository;

import com.dhruvi.backend.model.Resume;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResumeRepository extends JpaRepository<Resume, Long> {
}
