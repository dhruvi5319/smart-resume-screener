---
title: Smart Resume Screener AI
sdk: docker
app_port: 7860
pinned: false
---

# Smart Resume Screener — AI service

FastAPI microservice for [Smart Resume Screener](https://github.com/dhruvi5319/smart-resume-screener). Scores resumes against job descriptions using Sentence-BERT semantic similarity (`all-MiniLM-L6-v2`), OpenAI-generated qualitative summaries, and regex-based education/experience extraction.

This Space is called by the project's Spring Boot backend, not by the browser directly. See the main repo for full architecture.

## Configuration

Set as Space secrets (Settings → Variables and secrets):

| Secret | Purpose |
|---|---|
| `OPENAI_API_KEY` | Required. Used by the `gpt-3.5-turbo` summarizer. |

## Endpoint

`POST /analyze-file` (multipart):

- `resume_file` — PDF or DOCX
- `job_description` — string
- `required_skills` — comma-separated skills

Returns `match_score`, `summary`, `extracted_skills`, `education`, `experience`, `relevant_keywords`.
