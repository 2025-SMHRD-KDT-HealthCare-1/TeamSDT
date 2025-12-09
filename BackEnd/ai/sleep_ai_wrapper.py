import sys
import json
import os

os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TOKENIZERS_PARALLELISM'] = 'false'

from sleep_ai import run_feedback_api, tts_generate_memory

if __name__ == "__main__":
    raw = sys.stdin.buffer.read()
    input_data = raw.decode("utf-8", errors="ignore")

    params = json.loads(input_data)

    user_name = params.get("user_name")
    caffeine = params.get("caffeine")
    screen_time = params.get("screen_time")
    sleep_time = params.get("sleep_time")  # ⭐ 숫자여야 함
    style = params.get("style", "친근하게")

    # AI 분석 실행
    result_text = run_feedback_api(user_name, caffeine, screen_time, sleep_time, style)
    audio_base64 = tts_generate_memory(result_text)

    output = {
        "text": result_text,
        "audio_base64": audio_base64
    }

    sys.stdout.buffer.write(
        json.dumps(output, ensure_ascii=False).encode("utf-8")
    )
    sys.stdout.flush()
