// 프로젝트 루트/mic/snoreBreathAnalyzer.ts

type Sample = {
  level: number;      // dB (0에 가까울수록 큰 소리, -80 ~ 0 정도)
  timestamp: number;  // ms
};

export type AnalysisState = {
  isSnoring: boolean;    // 지금 코골이 중인지
  isBreathing: boolean;  // 호흡 감지되는지
  isApnea: boolean;      // 10초 이상 호흡 없음 의심
  snoreCount: number;    // 누적 코골이 이벤트 수
  lastBreathAgoSec: number; // 마지막 호흡으로부터 경과 시간(sec)
};

export class SnoreBreathAnalyzer {
  private windowMs = 30_000; // 최근 30초만 분석
  private samples: Sample[] = [];

  private snoreThreshold = -25;    // 이 값보다 크면(덜 음수면) 코골이 후보
  private breathLow = -50;         // 호흡 대략 범위
  private breathHigh = -25;

  private lastSnoreTime = 0;
  private lastBreathTime = 0;
  private snoreCount = 0;

  addSample(sample: Sample): AnalysisState {
    this.samples.push(sample);
    const now = sample.timestamp;

    // 오래된 샘플 제거
    this.samples = this.samples.filter(
      (s) => now - s.timestamp <= this.windowMs
    );

    // 코골이: 큰 소리 스파이크 + 최소 1초 간격
    let isSnoring = false;
    if (sample.level > this.snoreThreshold) {
      if (now - this.lastSnoreTime > 1000) {
        this.lastSnoreTime = now;
        this.snoreCount += 1;
        isSnoring = true;
      }
    }

    // 호흡: 중간 정도 소리가 2~8초 간격으로 반복된다고 가정
    let isBreathing = false;
    if (
      sample.level > this.breathLow &&
      sample.level < this.breathHigh
    ) {
      const diffSec = (now - this.lastBreathTime) / 1000;
      if (this.lastBreathTime === 0 || diffSec > 1.5) {
        this.lastBreathTime = now;
        isBreathing = true;
      }
    }

    const lastBreathAgoSec =
      this.lastBreathTime === 0
        ? 999
        : (now - this.lastBreathTime) / 1000;

    const isApnea = lastBreathAgoSec > 10; // 10초 이상 호흡 없음

    return {
      isSnoring,
      isBreathing,
      isApnea,
      snoreCount: this.snoreCount,
      lastBreathAgoSec,
    };
  }
}
