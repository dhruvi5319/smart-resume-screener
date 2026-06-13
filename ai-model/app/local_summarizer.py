"""
Local fine-tuned summarizer — a drop-in replacement for `openai_summarizer`.

Loads Llama 3.2 3B Instruct + the LoRA adapter
(https://huggingface.co/dhruvi5319/llama-3.2-3b-resume-fit-summary) once on first
use, and produces the same 4-point fit summary the GPT-3.5 path produced — but
locally, with no API key and no per-call cost.

Enabled by setting `USE_LOCAL_MODEL=true` (see scorer.py). The model is loaded
lazily and cached (singleton) so the cost is paid once, on the first request.

Base model is gated, so HF_TOKEN must be set in the environment to download it.
"""

import os
from functools import lru_cache

import torch
from transformers import AutoModelForCausalLM, AutoTokenizer
from peft import PeftModel

BASE_MODEL = os.getenv("BASE_MODEL", "meta-llama/Llama-3.2-3B-Instruct")
LORA_ADAPTER = os.getenv("LORA_ADAPTER", "dhruvi5319/llama-3.2-3b-resume-fit-summary")

# Same length caps used during training/distillation, so the model sees inputs
# in the same shape it was trained on.
RESUME_CAP = 4000
JD_CAP = 2500


def _build_prompt(resume: str, job: str) -> str:
    # MUST match the prompt the model was trained on (openai_summarizer's prompt).
    return f"""
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


@lru_cache(maxsize=1)
def _load():
    """Load base model + adapter once and cache (singleton)."""
    token = os.getenv("HF_TOKEN")
    device = (
        "cuda" if torch.cuda.is_available()
        else "mps" if torch.backends.mps.is_available()
        else "cpu"
    )
    dtype = torch.float32 if device == "cpu" else torch.float16

    tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL, token=token)
    base = AutoModelForCausalLM.from_pretrained(BASE_MODEL, torch_dtype=dtype, token=token)
    model = PeftModel.from_pretrained(base, LORA_ADAPTER)
    model.to(device).eval()
    return tokenizer, model, device


def generate_summary(resume: str, job: str) -> str:
    tokenizer, model, device = _load()
    prompt = _build_prompt(resume[:RESUME_CAP], job[:JD_CAP])
    enc = tokenizer.apply_chat_template(
        [{"role": "user", "content": prompt}],
        add_generation_prompt=True, return_tensors="pt", return_dict=True,
    ).to(device)
    with torch.no_grad():
        out = model.generate(
            **enc, max_new_tokens=300, do_sample=False,
            repetition_penalty=1.2, pad_token_id=tokenizer.eos_token_id,
        )
    return tokenizer.decode(
        out[0][enc["input_ids"].shape[1]:], skip_special_tokens=True
    ).strip()
