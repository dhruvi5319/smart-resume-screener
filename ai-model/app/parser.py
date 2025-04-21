import re
from fastapi import UploadFile
from typing import List
from docx import Document
import fitz  # PyMuPDF
from io import BytesIO

def extract_education(text: str) -> List[str]:
    education_lines = []
    lines = text.split('\n')
    capture = False

    for line in lines:
        line = line.strip()
        # Start capturing after detecting Education section
        if re.search(r"education", line, re.IGNORECASE):
            capture = True
            continue
        if capture:
            # Stop capturing at next major section
            if re.search(r"(experience|skills|projects|certifications|technical)", line, re.IGNORECASE):
                break
            if line:  # Skip empty lines
                education_lines.append(line)

    combined = " ".join(education_lines)
    
    patterns = [
        r"(Masters? in [A-Za-z\s]+)",
        r"(Bachelors? in [A-Za-z\s]+)",
        r"(Bachelor(?:'s)?(?: of| in)? [A-Za-z\s&]+)",
        r"(Master(?:'s)?(?: of| in)? [A-Za-z\s&]+)",
        r"(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|MBA|BBA|BCA|MCA)",
        r"(High School Diploma|Higher Secondary|10th Grade|12th Grade)",
        r"(Diploma(?: in [A-Za-z &]+)?)"
    ]

    results = set()
    for pattern in patterns:
        for match in re.findall(pattern, combined, re.IGNORECASE):
            results.add(match.strip())

    return list(results) if results else ["Education not explicitly mentioned"]

def extract_experience(text: str) -> List[str]:
    experience_lines = []
    lines = text.split("\n")
    capture = False

    for line in lines:
        line = line.strip()
        if re.search(r"(experience|professional background|employment history)", line, re.IGNORECASE):
            capture = True
            continue
        if capture:
            if line == "" or re.match(r"^(education|skills|projects|certifications)", line, re.IGNORECASE):
                break
            experience_lines.append(line)

    return experience_lines if experience_lines else ["Experience not explicitly mentioned"]

def extract_text_from_file(file: UploadFile) -> str:
    content = file.file.read()
    if not content:
        raise ValueError(f"❌ File received is empty or unreadable: {file.filename}")
    
    print(f"✅ Received file: {file.filename} | Size: {len(content)} bytes")

    if file.filename.endswith(".pdf"):
        return extract_text_from_pdf_bytes(content)
    elif file.filename.endswith(".docx"):
        return extract_text_from_docx_bytes(content)
    else:
        raise ValueError("Unsupported file format. Please upload a PDF or DOCX.")

def extract_text_from_pdf_bytes(pdf_bytes: bytes) -> str:
    text = ""
    with fitz.open(stream=pdf_bytes, filetype="pdf") as doc:
        for page in doc:
            text += page.get_text()
    return text

def extract_text_from_docx_bytes(docx_bytes: bytes) -> str:
    doc = Document(BytesIO(docx_bytes))
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())