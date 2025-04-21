package com.dhruvi.backend.model;

import jakarta.persistence.*;
import java.util.List;

@Entity
public class Candidate {

    @Id
    private String id;

    private String name;
    private String email;
    private String phone;
    private String jobTitle;
    private String resumeId;
    private int matchScore;
    private List<String> education;
    @Column(length = 5000) // Optional: allow long summaries
    private String summary;

    @ElementCollection
    private List<String> experience;

    @ElementCollection
    private List<String> strengths;

    @ElementCollection
    private List<String> weaknesses;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "candidate_skills", joinColumns = @JoinColumn(name = "candidate_id"))
    private List<Skill> skills;
    
    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    // Getters & Setters

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getResumeId() {
        return resumeId;
    }

    public void setResumeId(String resumeId) {
        this.resumeId = resumeId;
    }

    public int getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(int matchScore) {
        this.matchScore = matchScore;
    }

    public List<String> getEducation() {
        return education;
    }

    public void setEducation(List<String> education) {
        this.education = education;
    }

    public List<String> getExperience() {
        return experience;
    }

    public void setExperience(List<String> experience) {
        this.experience = experience;
    }

    public List<String> getStrengths() {
        return strengths;
    }

    public void setStrengths(List<String> strengths) {
        this.strengths = strengths;
    }

    public List<String> getWeaknesses() {
        return weaknesses;
    }

    public void setWeaknesses(List<String> weaknesses) {
        this.weaknesses = weaknesses;
    }

    public List<Skill> getSkills() {
        return skills;
    }

    public void setSkills(List<Skill> skills) {
        this.skills = skills;
    }
    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
    public User getUploadedBy() {
        return uploadedBy;
    }
    
    public void setUploadedBy(User uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

}
