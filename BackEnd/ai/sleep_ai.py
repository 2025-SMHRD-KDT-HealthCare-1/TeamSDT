import os
from pathlib import Path
import numpy as np
import faiss
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer, CrossEncoder
import google.generativeai as genai
from gtts import gTTS
from io import BytesIO
import base64
import warnings

warnings.filterwarnings("ignore")

# 📌 .env 로드
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.5-flash")

# 📌 docs.txt 로드
AI_DIR = Path(__file__).resolve().parent
with open(AI_DIR / "docs.txt", "r", encoding="utf-8") as f:
    sentences = [line.strip() for line in f.readlines() if line.strip()]

# 📌 Embedding 모델
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = embed_model.encode(sentences)

index = faiss.IndexFlatL2(vectors.shape[1])
index.add(np.array(vectors))

# 📌 Reranker
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

# ============ 기능 함수 ============

def tts_generate_memory(text):
    mp3_fp = BytesIO()
    tts = gTTS(text=text, lang='ko')
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)
    return base64.b64encode(mp3_fp.read()).decode('utf-8')

def search_docs(caffeine, screen_time, sleep_time, top_k=5):
    query = f"""
    카페인 {caffeine}mg, 스크린타임 {screen_time}시간,
    수면 {sleep_time}시간의 과학적 영향 설명
    """
    q_vec = embed_model.encode([query])
    _, idx = index.search(q_vec, top_k)

    candidates = [sentences[i] for i in idx[0]]
    scores = reranker.predict([[query, c] for c in candidates])

    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [r[0] for r in ranked[:3]]

def summarize(docs):
    docs_join = "\n".join(docs)
    prompt = f"""
    다음 연구 내용을 3줄 핵심 요약해줘:

    {docs_join}

    - 과학적 핵심 요점
    - 신체/호르몬 반응
    - 행동 영향
    """
    return model.generate_content(prompt).text.strip()

def run_feedback_api(user_name, caffeine, screen_time, sleep_time, style="친근하게"):

    docs = search_docs(caffeine, screen_time, sleep_time)
    summary = summarize(docs)

    tone = {
        "친근하게": "친근하고 부드러운 말투로",
        "전문가처럼": "전문가 말투로",
        "유머 섞어서": "가볍게 유머 섞어서",
    }.get(style, "친근하게")

    prompt = f"""
    당신은 수면 전문 AI입니다.

    ▼ 연구 요약
    {summary}

    ▼ 사용자 생활 패턴
    - 이름: {user_name}
    - 카페인: {caffeine}mg
    - 스크린타임: {screen_time}시간
    - 수면시간: {sleep_time}시간

    ▼ 지시사항
    {tone} 2~3문장으로 핵심만 설명해줘.
    """

    return model.generate_content(prompt).text.strip()
