# Smart Resume Screener (ScreenWise)

An AI-powered resume-to-job-description matcher for HR teams. Recruiters define job descriptions, upload candidate resumes (PDF / DOCX), and the system returns a calibrated 0–100 match score, per-skill scoring, structured education/experience extraction, and a GPT-generated qualitative summary.

> The repo is `smart-resume-screener`; the user-facing product brand is **ScreenWise**.

**Live demo:** _TODO: add the deployed frontend URL._
**Deployed backend (Spring Boot, Railway):** `https://brave-liberation-production.up.railway.app`
**Deployed AI service (FastAPI, Railway):** `https://smart-resume-screener-production.up.railway.app`
**Demo access:** Contact [the author](https://github.com/dhruvi5319) for credentials.

<!-- TODO: replace with a real screenshot or GIF of the upload + results flow. -->
![ScreenWise dashboard](docs/images/dashboard.png)

---

## How it works

The system is a three-tier pipeline. Each upload flows through it once:

1. **Browser → Spring Boot.** The React app POSTs `multipart/form-data` (resume `file` + `jobDescriptionId`) to `/api/resumes/upload` with a JWT bearer token.
2. **Spring Boot → FastAPI AI service.** The backend looks up the job description, joins its `requiredSkills` into a CSV, and proxies the resume bytes to `POST /analyze-file` on the AI service via `RestTemplate`.
3. **FastAPI runs the analysis.** It extracts text (PyMuPDF for PDF, python-docx for DOCX), encodes both documents with Sentence-BERT, computes calibrated similarity, scores skills, extracts education/experience by regex, and calls OpenAI for a qualitative summary.
4. **Persistence.** Spring Boot saves a `Resume` row (with the raw file bytes as `@Lob`) and a `Candidate` row (with match score, skills, education, experience, summary) linked to the uploading user, then returns the candidate JSON.
5. **Render.** The Dashboard lists candidates as cards (paginated, filterable by job title and minimum match score). Clicking a card opens a Recharts dashboard with a donut match-score gauge and a horizontal skills bar chart.

```
Browser (Vite/React)               Spring Boot 3.4              FastAPI AI service                OpenAI
       │                                  │                              │                          │
       │  POST /api/resumes/upload        │                              │                          │
       │   file + jobDescriptionId        │                              │                          │
       │   Authorization: Bearer ...      │                              │                          │
       │ ───────────────────────────────► │                              │                          │
       │                                  │  load JobDescription         │                          │
       │                                  │  build skills CSV            │                          │
       │                                  │  POST /analyze-file          │                          │
       │                                  │  (multipart)                 │                          │
       │                                  │ ───────────────────────────► │                          │
       │                                  │                              │  PDF/DOCX → text         │
       │                                  │                              │  Sentence-BERT embeds    │
       │                                  │                              │  cosine → scaled score   │
       │                                  │                              │  skill counts            │
       │                                  │                              │  regex extract           │
       │                                  │                              │  generate_summary(...)   │
       │                                  │                              │ ───────────────────────► │
       │                                  │                              │   gpt-3.5-turbo          │
       │                                  │                              │ ◄─────────────────────── │
       │                                  │ ◄─────────────────────────── │                          │
       │                                  │  save Resume + Candidate     │                          │
       │ ◄─────────────────────────────── │                              │                          │
```

---

## ML and scoring details

### Semantic similarity (`ai-model/app/model.py`)

Both the resume and the job description are encoded with `sentence-transformers/all-MiniLM-L6-v2` (384-dim). Cosine similarity is computed from first principles with NumPy: `dot(a, b) / (norm(a) * norm(b))`.

### Score calibration (`ai-model/app/model.py:20`)

Raw cosine values from MiniLM on long documents cluster in a narrow `[0.3, 0.7]` band, which is not intuitive for end users. The system applies a deliberate piecewise mapping to spread that range across 0–100:

| Raw cosine similarity | Mapped match score |
|---|---|
| `≥ 0.65` | 90 – 100 |
| `0.55 – 0.65` | 75 – 90 |
| `0.45 – 0.55` | 60 – 75 |
| `0.35 – 0.45` | 40 – 60 |
| `< 0.35` | similarity × 100 (linear fallback) |

The boundaries were chosen so a strong semantic match lands in the 90s while an off-field resume stays well below 50. The match score color tiers in the UI (`frontend/src/components/MatchScoreChart.tsx`) layer on top of this:

| Match score | Label | Color |
|---|---|---|
| `≥ 85` | Excellent Match | green `#1cad61` |
| `70 – 85` | Strong Match | `#5fb832` |
| `55 – 70` | Good Match | orange `#f98204` |
| `40 – 55` | Potential Match | `#ff9800` |
| `< 40` | Low Match | red `#ea384c` |

### Skill scoring (`ai-model/app/scorer.py:11`)

Each required skill is matched against the resume text case-insensitively. The per-skill score is `min(occurrences × 20, 100)`, paired with a boolean `match` flag. The UI uses both signals — bars show score magnitude; bar color encodes the `match` flag plus a green/orange/red tier.

### GPT summary (`ai-model/app/openai_summarizer.py`)

A single structured prompt to `gpt-3.5-turbo` (`temperature=0.7`) asks for four points in one concise paragraph:

1. Summary of candidate experience and qualifications
2. Key strengths from the resume
3. Weaknesses or missing qualifications relative to the JD
4. Overall fit

The output is stored on the `Candidate` (`@Column(length = 5000)`) and rendered as the "AI Summary" block on the candidate-details page.

### Structured extraction (`ai-model/app/parser.py`)

Education and experience are pulled by scanning for section headers (`education`, `experience`, `professional background`, …) and capturing lines until the next major section, then matching common degree/role patterns with regex (e.g. `Bachelors? in`, `M\.?Sc`, `MBA`, `Diploma`).

---

## Why semantic matching beats keyword matching

Keyword-based ATS systems reward surface-level vocabulary overlap. A resume that literally says "Python, AWS, PostgreSQL" outranks one that says "built ML pipelines on GCP using Postgres and FastAPI," even though the second candidate is the stronger backend-with-cloud engineer. ScreenWise encodes both documents into a 384-dimensional embedding space where *meaning* drives proximity, not vocabulary — "machine learning engineer" sits near "AI engineer," and "Postgres" near "PostgreSQL." The piecewise calibration then translates those geometric distances into an interpretable 0–100 number, and the keyword-occurrence skill scorer is kept as an independent signal so explicit hits still carry weight.

---

## Example response

The FastAPI `/analyze-file` returns this shape (see `ai-model/app/schemas.py:14`):

```jsonc
{
  "match_score": 92.5,
  "fit_percentage": 92.5,
  "summary": "The candidate has 4 years of backend engineering experience ...",
  "extracted_skills": [
    { "name": "Python",     "score": 100, "match": true  },
    { "name": "AWS",        "score": 60,  "match": true  },
    { "name": "PostgreSQL", "score": 0,   "match": false }
  ],
  "education": ["Bachelors in Computer Science"],
  "experience": ["Backend Engineer at ...", "..."],
  "relevant_keywords": ["Python", "AWS", "PostgreSQL", "..."]
}
```

Spring Boot maps this onto a `Candidate` entity, adds `id`, `name` (from the original filename), `jobTitle`, and `uploadedBy` (the authenticated user), and persists it.

_TODO: add a real (anonymized) resume + JD pair under `docs/examples/` so reviewers can see end-to-end behavior._

---

## Evaluation

_TODO (Week 1 roadmap task): build a small eval set of 10 hand-scored resume / job-description pairs (mix of obvious fits, obvious non-fits, borderline cases). For each pair, record (a) a manual 0–100 fit score, (b) the system's `match_score`, and (c) whether the GPT summary correctly identifies the main strength and weakness. Aggregate into a ~200-word writeup here — call out where the system agrees with human judgment and where it diverges (borderline cases in the 50–70 band are the likely failure mode)._

---

## Tech stack

| Layer | Stack |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui (Radix), TanStack Query, React Router 6, axios, Recharts, react-hook-form + zod, sonner |
| Backend (API + auth + orchestration) | Spring Boot 3.4.4, Java 17, Spring Security, Spring Data JPA, Hibernate, JJWT 0.11.5, Lombok |
| AI service | FastAPI, sentence-transformers (`all-MiniLM-L6-v2`), PyTorch, PyMuPDF (`fitz`), python-docx, OpenAI Python SDK, python-dotenv |
| Database | PostgreSQL (Railway-hosted in production) |
| Auth | HS256 JWT bearer tokens, 1-hour expiration (`app.jwt.expiration=3600000`); password hashing with BCrypt |
| Deployment | Both backend and AI service deployed on Railway; frontend deployment TODO |

---

## Data model (Spring Boot JPA)

| Entity | Key fields | Notes |
|---|---|---|
| `User` | `id`, `name`, `email` (unique), `password` (BCrypt) | One-to-many to `Candidate` via `uploadedBy` |
| `JobDescription` | `id`, `title`, `department`, `location`, `requiredSkills` (`@ElementCollection`), `description` (TEXT), `createdAt` | `getRequiredSkillsCsv()` joins skills for the AI call |
| `Resume` | `id`, `fileName`, `fileType`, raw `data` (`@Lob` bytes), FK to `JobDescription` | Original file is persisted in the DB |
| `Candidate` | `String id` (UUID-prefixed), name, email, phone, jobTitle, matchScore, education/experience/strengths/weaknesses (collections), `summary` (5000 chars), skills (`@ElementCollection` of `Skill`), `uploadedBy` (FK to User) | Created on upload; one per resume |
| `Skill` (`@Embeddable`) | `name`, `score`, `isMatch` | Stored in `candidate_skills` |

JPA uses `spring.jpa.hibernate.ddl-auto=update`, so schema changes auto-apply on boot.

---

## API surface

### Spring Boot (`com.dhruvi.backend.controller`)

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/auth/signup` | public | `SignupRequest{name,email,password}` → string status |
| `POST` | `/api/auth/login` | public | `LoginRequest{email,password}` → `LoginResponse{token,name,email,id}` |
| `POST` | `/api/resumes/upload` | bearer JWT | multipart `file` + `jobDescriptionId` (Long) → `Candidate` |
| `GET` | `/api/resumes/all` | bearer | List all `Resume` rows |
| `GET` | `/api/resumes/candidate` | bearer | List all candidates (any user) |
| `GET` | `/api/resumes/candidates` | bearer | List candidates uploaded by the current user |
| `POST` | `/api/job-descriptions` | bearer | Create a job description |
| `GET` | `/api/job-descriptions` | bearer | List all job descriptions |
| `POST` | `/api/ai/analyze-file` | bearer | Multipart proxy directly to the AI service |
| `POST` | `/api/ai/match` | bearer | JSON `MatchRequest` → `MatchResponse` (calls `localhost:5000/api/match`; appears legacy / unused) |

### FastAPI (`ai-model/app/main.py`)

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/analyze-file` | multipart `resume_file` + `job_description` + `required_skills` (CSV string) → `AnalyzeResponse` |

---

## Local setup

### Prerequisites

- Java 17, Maven (wrapper included)
- Node 18+ and npm
- Python 3.10+
- PostgreSQL running locally (or a connection string to a hosted instance)
- An OpenAI API key

### 1. Clone

```bash
git clone https://github.com/dhruvi5319/smart-resume-screener.git
cd smart-resume-screener
```

### 2. Backend — Spring Boot

```bash
cd backend
# Edit src/main/resources/application.properties:
#   - spring.datasource.url / username / password   → your local Postgres
#   - app.jwt.secret                                → a fresh Base64 32-byte secret
./mvnw spring-boot:run         # http://localhost:8080
```

JPA auto-creates / migrates tables on first run (`ddl-auto=update`). File upload limit is `10MB`.

### 3. AI microservice — FastAPI

```bash
cd ai-model
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env           # set OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

The first request downloads the `all-MiniLM-L6-v2` model (~90 MB) into the sentence-transformers cache.

By default, the Spring Boot `AIService` calls the production AI URL on Railway. To point it at your local FastAPI, set `ai.model.url=http://localhost:8000` in `application.properties` (or as an env var).

### 4. Frontend — React + Vite

```bash
cd frontend
npm install
# Edit .env:
#   VITE_API_URL=http://localhost:8080
npm run dev                    # http://localhost:5173
```

The frontend reads `VITE_API_URL` from `.env` for every backend call.

---

## Folder structure

```
smart-resume-screener/
├── backend/                  Spring Boot 3.4 (auth, persistence, AI orchestration)
│   ├── src/main/java/com/dhruvi/backend/
│   │   ├── controller/       AuthController, ResumeUploadController, AIController, JobDescriptionController
│   │   ├── service/          AuthService, JwtUtil, AIService, ResumeService, MatchService
│   │   ├── config/           SecurityConfig, JwtAuthenticationFilter
│   │   ├── model/            User, Resume, Candidate, JobDescription, Skill (JPA entities)
│   │   ├── repository/       JpaRepository interfaces
│   │   └── dto/              Auth, match, JD, AI-response DTOs
│   └── src/main/resources/application.properties
├── frontend/                 React + Vite UI
│   └── src/
│       ├── pages/            Index (landing), Login, Register, Dashboard, CandidateDetails, NotFound
│       ├── components/       CandidateCard, ResumeUploader, JobDescriptionForm, MatchScoreChart, SkillsChart, Navbar
│       ├── services/api.ts   uploadResume, saveJobDescription, fetchJobDescriptions, fetchCandidates
│       ├── types/            TS interfaces (Candidate, Skill, JobDescription, …)
│       └── config.ts         exposes VITE_API_URL
├── ai-model/                 FastAPI AI service
│   └── app/
│       ├── main.py           /analyze-file
│       ├── model.py          BERT load + cosine + piecewise scoring
│       ├── scorer.py         analyze_resume orchestrator + skill scoring
│       ├── parser.py         PDF / DOCX text + section regex
│       ├── openai_summarizer.py
│       └── schemas.py        AnalyzeResponse / SkillScore pydantic models
├── docs/                     Technical documentation and presentation (PDFs)
└── README.MD
```

---

## Known issues and follow-ups

The roadmap explicitly says *don't refactor; just surface what exists.* This section documents things to clean up rather than the code's intended design.

### Security

- **`backend/src/main/resources/application.properties`** contains a hardcoded production Railway Postgres URL with username and password (lines 11–13), plus a hardcoded `app.jwt.secret` (line 31). **Rotate both, move to environment variables, and purge from git history.**
- `SecurityConfig.java:34–38` matches `/api/**` as `permitAll()`, which makes the JWT filter advisory rather than enforcing. The filter still parses the token and populates `SecurityContextHolder` when one is present, so endpoints like `/api/resumes/upload` that cast `authentication.getPrincipal()` to `User` will NPE on unauthenticated requests rather than 401. Either tighten the matchers to only allow `/api/auth/**`, or guard the controller code.
- `CORS` is `*` everywhere (backend `SecurityConfig` and FastAPI `main.py`).
- `services/api.ts:68` and `pages/Login.tsx:63,71` log the JWT bearer token to the browser console.

### Code cleanup

- `MatchService` posts to `http://localhost:5000/api/match`, a different port and path than the FastAPI AI service. The corresponding `/api/ai/match` endpoint appears to be legacy — verify and remove if dead.
- File-size limits are inconsistent: backend allows 10MB (`spring.servlet.multipart.max-file-size`), frontend `ResumeUploader` rejects anything over 5MB.
- `ai-model/app/generate_code_from_story.py` is an unrelated side experiment (uses GPT-4 to generate boilerplate React + Spring Boot code from a user story). Move out of the AI service or delete.
- Two stray files in `ai-model/app/` — `Sure, here is the boilerplate code for your requirements:` and `Sure, here's the boilerplate code for the frontend and backend.` — are 26-byte leftovers from `generate_code_from_story.py`. Safe to delete.
- `Candidate.setEmail("unknown@example.com")` and `setPhone("(000) 000-0000")` in `ResumeUploadController.java:77` — placeholder values; the parser does not actually extract these from the resume.

---

## Project status

Working full-stack application with both the Spring Boot backend and the FastAPI AI service deployed on Railway. Next milestones (per the AI engineer roadmap): build a Ragas-based evaluation harness, add a cross-encoder re-ranking layer, and compare `all-MiniLM-L6-v2` against `all-mpnet-base-v2` on a structured eval set.

## Author

[Dhruvi Rathod](https://github.com/dhruvi5319)
