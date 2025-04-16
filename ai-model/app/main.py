from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from app.schemas import AnalyzeResponse
from app.scorer import analyze_resume
from app.parser import extract_text_from_file
import json
import logging

app = FastAPI()

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@app.post("/analyze-file", response_model=AnalyzeResponse)
def analyze_file(
    resume_file: UploadFile = File(...),
    job_description: str = Form(...),
    required_skills: str = Form(...)  # e.g., "python, aws, postgresql"
):
    try:
        resume_text = extract_text_from_file(resume_file)
        logger.info("📄 Resume extracted (length: %d characters)", len(resume_text))

        # ✅ Parse comma-separated string into a clean list
        parsed_skills = [s.strip() for s in required_skills.split(",") if s.strip()]
        logger.info("🔍 Parsed required_skills: %s", parsed_skills)

        result = analyze_resume(resume_text, job_description, parsed_skills)

        return AnalyzeResponse(**result)

    except Exception as e:
        logger.error("❌ Error analyzing resume: %s", str(e), exc_info=True)
        raise HTTPException(status_code=500, detail=str(e))