package com.dhruvi.backend.dto;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonProperty;

public class AIAnalysisResponse {

    @JsonProperty("match_score")
    private double matchScore;

    @JsonProperty("fit_percentage")
    private double fitPercentage;

    private String summary;

    @JsonProperty("extracted_skills")
    private List<SkillScore> extractedSkills;

    private List<String>  education;
    private List<String> experience;

    @JsonProperty("relevant_keywords")
    private List<String> relevantKeywords;

    // Getters and Setters

    public double getMatchScore() { return matchScore; }
    public void setMatchScore(double matchScore) { this.matchScore = matchScore; }

    public double getFitPercentage() { return fitPercentage; }
    public void setFitPercentage(double fitPercentage) { this.fitPercentage = fitPercentage; }

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<SkillScore> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(List<SkillScore> extractedSkills) { this.extractedSkills = extractedSkills; }

    public List<String> getEducation() { return education; }
    public void setEducation(List<String> education) { this.education = education; }

    public List<String> getExperience() { return experience; }
    public void setExperience(List<String> experience) { this.experience = experience; }

    public List<String> getRelevantKeywords() { return relevantKeywords; }
    public void setRelevantKeywords(List<String> relevantKeywords) { this.relevantKeywords = relevantKeywords; }

    // Inner class for extracted_skills
    public static class SkillScore {
        private String name;
        private int score;
        private boolean match;

        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public int getScore() { return score; }
        public void setScore(int score) { this.score = score; }

        public boolean isMatch() { return match; }
        public void setMatch(boolean match) { this.match = match; }
    }
}