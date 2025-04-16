from sentence_transformers import SentenceTransformer
from numpy import dot
from numpy.linalg import norm

# Load BERT model for semantic embeddings
bert_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embeddings(text: str):
    """
    Convert text to semantic embeddings using BERT.
    """
    return bert_model.encode(text)

def calculate_similarity(embedding1, embedding2):
    """
    Raw cosine similarity between two embedding vectors.
    """
    return dot(embedding1, embedding2) / (norm(embedding1) * norm(embedding2))

def scaled_score(similarity: float) -> float:
    """
    Scale raw similarity to realistic 0–100 match score.
    Boosts resumes that semantically align well with the job even if wording differs.
    """
    if similarity >= 0.65:
        return round(90 + (similarity - 0.65) * 100, 2)  # 90–100
    elif similarity >= 0.55:
        return round(75 + (similarity - 0.55) * 150, 2)  # 75–90
    elif similarity >= 0.45:
        return round(60 + (similarity - 0.45) * 150, 2)  # 60–75
    elif similarity >= 0.35:
        return round(40 + (similarity - 0.35) * 200, 2)  # 40–60
    else:
        return round(similarity * 100, 2)  # fallback for weak matches
