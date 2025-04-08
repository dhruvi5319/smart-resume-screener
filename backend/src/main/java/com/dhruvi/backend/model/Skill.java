package com.dhruvi.backend.model;

import jakarta.persistence.Embeddable;

@Embeddable
public class Skill {
    private String name;
    private int score;
    private boolean isMatch;

    public Skill() {}

    public Skill(String name, int score, boolean isMatch) {
        this.name = name;
        this.score = score;
        this.isMatch = isMatch;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getScore() {
        return score;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public boolean isMatch() {
        return isMatch;
    }

    public void setMatch(boolean match) {
        isMatch = match;
    }
}
