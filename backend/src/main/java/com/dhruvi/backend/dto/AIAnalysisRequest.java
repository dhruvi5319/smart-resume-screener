package com.dhruvi.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class AIAnalysisRequest {

    @JsonProperty("resume_text")
    private String resumeText;

    @JsonProperty("job_description")
    private String jobDescription;

    @JsonProperty("required_skills")
    private List<String> requiredSkills;

    // Getters and setters
    public String getResumeText() {
        return resumeText;
    }

    public void setResumeText(String resumeText) {
        this.resumeText = resumeText;
    }

    public String getJobDescription() {
        return jobDescription;
    }

    public void setJobDescription(String jobDescription) {
        this.jobDescription = jobDescription;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
