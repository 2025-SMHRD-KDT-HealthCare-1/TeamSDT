#sleep_ai_wrapper.py
import sys
import json
import os

# 모든 경고/로그 끄기
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TOKENIZERS_PARALLELISM'] = 'false'

import warnings
warnings.filterwarnings("ignore")
from sleep_ai import run_feedback_api, tts_generate_memory  # sleep_ai.py에 있는 함수 가져오기

if __name__ == "__main__":
    # 터미널에서 받은 입력 처리
    # input_data = sys.stdin.read()
    # UTF-8로 stdin 읽기
    raw = sys.stdin.buffer.read()
    input_data = raw.decode("utf-8", errors="ignore")

    params = json.loads(input_data)

    # 파라미터 받기
    user_name = params.get("user_name")
    caffeine = params.get("caffeine")
    screen_time = params.get("screen_time")
    sleep_time = params.get("sleep_time")
    style = params.get("style", "친근하게")

    # AI 피드백 실행
    result_text = run_feedback_api(user_name, caffeine, screen_time, sleep_time, style)

    # Base64 음성 생성
    audio_base64 = tts_generate_memory(result_text)

    # JSON 형태로만 출력 (print 하나만!)
    output = {
        "text": result_text,
        "audio_base64": True      
    }

    # JSON만 딱 1줄 출력
    # 4) JSON을 UTF-8 바이트로 출력 (가장 중요)
    sys.stdout.buffer.write(json.dumps(output, ensure_ascii=False).encode("utf-8"))
    sys.stdout.flush()