from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

def generate_summary(resume: str, job: str) -> str:
    prompt = f"""
    You are an AI assistant tasked with evaluating a candidate's resume against a job description.

    1. Summarize the candidate's experience and qualifications.
    2. Identify their key strengths from the resume.
    3. Identify possible weaknesses or missing qualifications based on the job description.
    4. Evaluate their overall fit for the position.

    Resume:
    {resume}

    Job Description:
    {job}

    Provide a concise paragraph covering the above 4 points.
    """

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=0.7
    )

    return response.choices[0].message.content.strip()