package com.dhruvi.backend.repository;

import com.dhruvi.backend.model.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
}
