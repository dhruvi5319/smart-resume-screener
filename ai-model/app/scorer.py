from .model import get_embeddings, calculate_similarity, scaled_score
from .parser import (
    extract_education,
    extract_experience,
    extract_text_from_file,
)
from .openai_summarizer import generate_summary
from typing import List, Dict


def compute_skill_scores(resume_text: str, jd_skills: List[str]) -> List[Dict]:
    """
    Score skills based on presence and frequency in the resume text.
    """
    scored_skills = []
    resume_text_lower = resume_text.lower()

    for jd_skill in jd_skills:
        skill = jd_skill.lower()
        occurrences = resume_text_lower.count(skill)
        score = min(occurrences * 20, 100)  # Cap max score at 100
        is_match = occurrences > 0

        scored_skills.append({
            "name": jd_skill,
            "score": score,
            "match": is_match
        })

    return scored_skills


def analyze_resume(resume_text: str, job_desc: str, required_skills: List[str]):
    """
    Perform AI-powered resume analysis using:
    - BERT-based semantic similarity
    - Scaled 0–100 fit score
    - Skill matching
    - Education & experience parsing
    - OpenAI summary generation
    """
    # Get BERT embeddings
    resume_embed = get_embeddings(resume_text)
    job_embed = get_embeddings(job_desc)

    # Semantic similarity + scaled match score
    similarity = calculate_similarity(resume_embed, job_embed)
    match_score = scaled_score(similarity)

    # Skill relevance scoring
    scored_skills = compute_skill_scores(resume_text, required_skills)

    # Extract additional info
    education = extract_education(resume_text)
    experience = extract_experience(resume_text)
    relevant_keywords = list(set(required_skills + experience))

    # Generate OpenAI-powered fit summary
    summary = generate_summary(resume_text, job_desc)

    return {
        "match_score": match_score,
        "fit_percentage": match_score,
        "summary": summary,
        "extracted_skills": scored_skills,
        "education": education,
        "experience": experience,
        "relevant_keywords": relevant_keywords
    }
