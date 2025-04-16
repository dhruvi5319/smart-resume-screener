package com.dhruvi.backend.model;

import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "uploadedBy", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore // ✅ Add this line to avoid serialization error
    private List<Candidate> uploadedCandidates = new ArrayList<>();


    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<Candidate> getUploadedCandidates() {
        return uploadedCandidates;
    }
    
    public void setUploadedCandidates(List<Candidate> uploadedCandidates) {
        this.uploadedCandidates = uploadedCandidates;
    }
    

}