import re
from fastapi import UploadFile
from typing import List
from docx import Document
import fitz  # PyMuPDF
from io import BytesIO

def extract_education(text: str) -> str:
    patterns = [
        r"(Bachelor(?:'s)? of [A-Za-z\s]+)",
        r"(Master(?:'s)? of [A-Za-z\s]+)",
        r"(B\.?Tech|M\.?Tech|B\.?Sc|M\.?Sc|Ph\.?D)",
        r"(B\.?E|M\.?E|MBA|BBA)"
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(0)
    return "Not mentioned"

def extract_experience(text: str) -> List[str]:
    experience = []
    lines = text.split("\n")
    for line in lines:
        if re.search(r"\b(experience|worked|internship|project)\b", line, re.IGNORECASE):
            experience.append(line.strip())
    return experience or ["Experience not explicitly mentioned"]

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
    return "\n".join(para.text for para in doc.paragraphs)
