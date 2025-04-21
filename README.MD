
# 🧠 Smart Resume Screener

An AI-powered full-stack web application that analyzes resumes against job descriptions to help recruiters identify the best candidates based on skills, strengths, and overall match score.

## 🔧 Tech Stack

- **Frontend:** React + TypeScript + Tailwind CSS
- **Backend:** Spring Boot (Java)
- **AI Layer:** FastAPI (Python) with NLP & OpenAI integration
- **Database:** PostgreSQL
- **Authentication:** JWT (JSON Web Token)

---

## 📸 Features

- Upload resume files (PDF/DOCX)
- AI-driven resume analysis & skill extraction
- Match score calculation vs job descriptions
- Visualization of key metrics (skills, strengths, weaknesses)
- Candidate filtering by job role & score
- Authentication with JWT

---

## ⚙️ How to Run Locally

### 1. Clone the Repository
```bash
git clone https://github.com/dhruvi5319/smart-resume-screener.git
cd smart-resume-screener
```

### 2. Backend - Spring Boot
```bash
cd backend
./mvnw spring-boot:run
```

### 3. Frontend - React
```bash
cd frontend
npm install
npm run dev
```

### 4. AI Microservice - FastAPI
```bash
cd ai
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## 🔐 Demo Credentials

| Email | Password |
|-------|----------|
| dhruvi@gmail.com | 12345678 |

---

## 📦 API Endpoints

### `POST /api/resumes/upload`
Uploads a resume and analyzes it with AI.

**Headers:**
```
Authorization: Bearer <token>
```

**Form-Data Body:**
- `file`: resume.pdf
- `jobDescriptionId`: job ID

**Returns:** Candidate object with analysis details.

---

## 🧠 AI Analysis Output

- `match_score`: 0-100%
- `summary`: AI-generated summary of (fit+strength+weakness)
- `skills`: extracted + matched
- `education` / `experience`: structured data extraction

---

## 📂 Folder Structure

```
smart-resume-screener/
├── backend/            # Spring Boot backend
├── frontend/           # React UI
├── ai-model/           # FastAPI AI service
├── docs/               # Technical docs and presentation
└── README.md
```

---

## 📢 Authors

- [Dhruvi Rathod](https://github.com/dhruvi5319)

---

## ✅ Final Deliverables

- ✅ Working full-stack application
- ✅ Technical documentation (API + architecture)
- ✅ Presentation deck with demo link and credentials