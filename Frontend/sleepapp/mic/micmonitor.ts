// app/mic/micMonitor.ts
import { Audio } from "expo-av";

// 현재 마이크 상태
let recording: Audio.Recording | null = null;

// dB 변화 측정된 값을 밖에서 전달받도록 콜백 지정
let onLevelChange: ((db: number) => void) | null = null;

// interval id (number 타입으로 강제 지정)
let levelInterval: number | null = null;

/**
 * 외부에서 dB 콜백 등록하는 함수
 */
export function setMicCallback(cb: (db: number) => void) {
  onLevelChange = cb;
}

/**
 * 마이크 녹음 시작
 */
export async function startMicMonitor() {
  try {
    console.log("🎤 마이크 권한 요청");
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.log("❌ 마이크 권한 없음");
      return;
    }

    console.log("🎤 녹음 옵션 적용 중...");
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true, // ← 백그라운드 유지 핵심
    });

    console.log("🎤 녹음 시작...");
    const result = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    recording = result.recording;

    // 0.2초마다 dB 추출
    levelInterval = setInterval(async () => {
      if (!recording) return;

      try {
        const status = await recording.getStatusAsync();

        if (status.metering) {
          const db = status.metering; // dB 값
          if (onLevelChange) onLevelChange(db);
        }
      } catch {}
    }, 200) as unknown as number;

    console.log("🎤 마이크 감지 시작 완료");
  } catch (error) {
    console.log("❌ startMicMonitor 에러:", error);
  }
}

/**
 * 마이크 모니터링 종료
 */
export async function stopMicMonitor() {
  try {
    if (levelInterval) clearInterval(levelInterval);
    levelInterval = null;

    if (recording) {
      await recording.stopAndUnloadAsync();
      recording = null;
    }

    console.log("🛑 마이크 모니터링 종료");
  } catch (e) {
    console.log("stopMicMonitor error:", e);
  }
}
