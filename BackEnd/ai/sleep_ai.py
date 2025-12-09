# sleep_ai.py - 최적화 버전 (모델 1회 로딩)

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

# --------------------------
# 🔥 1) 환경 변수 로드
# --------------------------
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_API_KEY)

model = genai.GenerativeModel("gemini-2.5-flash")


# --------------------------
# 🔥 2) 문서 로드 (1회)
# --------------------------
AI_DIR = Path(__file__).resolve().parent
with open(AI_DIR / "docs.txt", "r", encoding="utf-8") as f:
    sentences = [line.strip() for line in f.readlines() if line.strip()]


# --------------------------
# 🔥 3) 임베딩 모델 로드 (1회)
# --------------------------
print("[Embedding] 모델 로딩 중...")
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
vectors = embed_model.encode(sentences)

index = faiss.IndexFlatL2(vectors.shape[1])
index.add(np.array(vectors))
print("[Embedding] 준비됨")


# --------------------------
# 🔥 4) Reranker 로드 (1회)
# --------------------------
print("[Reranker] 로딩 중...")
reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")
print("[Reranker] 준비됨")


# --------------------------
# 🔥 5) 음성 생성 함수
# --------------------------
def tts_generate_memory(text):
    mp3_fp = BytesIO()
    tts = gTTS(text=text, lang='ko')
    tts.write_to_fp(mp3_fp)
    mp3_fp.seek(0)

    audio_base64 = base64.b64encode(mp3_fp.read()).decode('utf-8')
    return audio_base64


# --------------------------
# 🔥 6) 검색 + Reranking (빠르게 동작)
# --------------------------
def search_relevant_docs(caffeine, screen_time, sleep_time, top_k=5):
    query = f"""
    카페인 {caffeine}mg, 스크린타임 {screen_time}시간, 
    수면 {sleep_time}시간이 수면 건강에 미치는 과학적 영향 요약
    """

    q_vec = embed_model.encode([query])
    _, idx = index.search(q_vec, top_k)

    candidates = [sentences[i] for i in idx[0]]

    pairs = [[query, c] for c in candidates]
    scores = reranker.predict(pairs)

    ranked = sorted(zip(candidates, scores), key=lambda x: x[1], reverse=True)
    return [r[0] for r in ranked[:3]]


# --------------------------
# 🔥 7) 논문 요약 (Gemini 호출)
# --------------------------
def summarize_docs(doc_list):
    docs = "\n".join(doc_list)
    prompt = f"""
    다음 연구 결과를 기반으로 '수면 과학 핵심 요점'을 3줄로 정리해줘.

    연구 내용:
    {docs}

    요약 형식:
    - (과학 근거)
    - (신체/호르몬)
    - (행동 습관 영향)
    """
    return model.generate_content(prompt).text.strip()


# --------------------------
# 🔥 8) 실제 분석 함수 (매 요청마다 빠르게 실행됨)
# --------------------------
def run_feedback_api(user_name, caffeine, screen_time, sleep_time, style="친근하게"):

    docs = search_relevant_docs(caffeine, screen_time, sleep_time)
    summarized = summarize_docs(docs)

    # 사용자 스타일 반영
    tone = {
        "친근하게": "친근하고 부드럽게 설명해줘.",
        "전문가처럼": "전문가 말투로 설명해줘.",
        "유머 섞어서": "유머러스하게 말해줘.",
    }.get(style, "친근하게 설명해줘.")

    prompt = f"""
    당신은 수면 과학 전문가입니다.

    ▼ 연구 요약
    {summarized}

    ▼ 사용자 정보
    - 이름: {user_name}
    - 카페인 섭취: {caffeine}mg
    - 스크린타임: {screen_time}시간
    - 수면시간: {sleep_time}시간

    ▼ 요구사항
    위 연구 기반으로, 사용자의 생활 패턴을 분석하고 {tone}
    - 핵심 요점만 2~3문장으로 정리해줘.
    - 중복 없이 깔끔하게 말해줘.
    """

    answer = model.generate_content(prompt).text.strip()
    return answer
