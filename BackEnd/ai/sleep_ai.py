# sleep_ai.py
import os

def run_feedback_api(user_name, caffeine, screen_time, sleep_time, style="친근하게"):
    import google.generativeai as genai
    from pathlib import Path
    from dotenv import load_dotenv
    from sentence_transformers import SentenceTransformer, CrossEncoder
    import numpy as np
    import faiss

    # .env 로드
    BASE_DIR = Path(__file__).resolve().parent.parent
    load_dotenv(BASE_DIR / ".env")

    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    genai.configure(api_key=GEMINI_API_KEY)

    model = genai.GenerativeModel("gemini-2.5-flash")

    # 문장 로드
    BASE_DIR = Path(__file__).resolve().parent
    with open(BASE_DIR / "docs.txt", "r", encoding="utf-8") as f:

    # 임베딩 모델
    embed_model = SentenceTransformer("all-MiniLM-L6-v2")
    vectors = embed_model.encode(sentences)
    index = faiss.IndexFlatL2(vectors.shape[1])
    index.add(np.array(vectors))

    # Reranker 추가
    reranker = CrossEncoder("cross-encoder/ms-marco-MiniLM-L-6-v2")

    # 검색 + Reranking
    def search_relevant_docs(caffeine, screen_time, sleep_time, top_k=5):
        query = f"""
                카페인 {caffeine}mg, 스크린타임 {screen_time}시간, 수면 {sleep_time}시간이
                수면 건강에 미치는 과학적 영향 요약
                """
        q_vec = embed_model.encode([query])
        _, idx = index.search(q_vec, top_k)
        candidates = [sentences[i] for i in idx[0]]

        # reranking
        pairs = [[query, c] for c in candidates]
        scores = reranker.predict(pairs)
        ranked = sorted(zip(candidates, scores),
                        key=lambda x: x[1], reverse=True)
        return [r[0] for r in ranked[:3]]  # top 3만

    # 논문 문장 자연스러운 요약
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

    # 실제 실행
    docs = search_relevant_docs(caffeine, screen_time, sleep_time)
    summarized = summarize_docs(docs)

    # 최종 프롬프트 생성
    def build_prompt():
        tone = {
            "친근하게": "친근하고 부드럽게 설명해줘.",
            "전문가처럼": "전문가 말투로 설명해줘.",
            "유머 섞어서": "약간 유머러스하게 말해줘."
        }.get(style, "친근하게 설명해줘.")

        return f"""
                당신은 수면 과학 전문가입니다.

                ▼ 연구 요약 (모델이 이해하기 좋게 정제됨)
                {summarized}

                ▼ 사용자 정보
                - 이름: {user_name}
                - 카페인 섭취: {caffeine}mg
                - 스크린타임: {screen_time}시간
                - 수면시간: {sleep_time}시간

                ▼ 요구사항
                위 연구 기반으로, 사용자의 생활 패턴을 분석하고
                {tone}
                - 연구 요약을 기반으로 ‘핵심만’ 담아서 2~3문장으로 말해줘.
                - 절대 반복하지 말고, 너무 길게 설명하지 마.
                """

    answer = model.generate_content(build_prompt()).text.strip()
    return answer
