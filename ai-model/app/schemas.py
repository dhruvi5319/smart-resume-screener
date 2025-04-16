from pydantic import BaseModel
from typing import List

class SkillScore(BaseModel):
    name: str
    score: int
    match: bool

class AnalyzeRequest(BaseModel):
    resume_text: str
    job_description: str
    required_skills: List[str]

class AnalyzeResponse(BaseModel):
    match_score: float
    fit_percentage: float
    summary: str
    extracted_skills: List[SkillScore]
    education: str
    experience: List[str]
    relevant_keywords: List[str]
