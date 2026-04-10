import { useState, useEffect } from 'react';

const STEPS = [
  { text: '레포지토리 탐색 중...', icon: '🔍' },
  { text: '새벽 커밋 기록 확인 중...', icon: '🌙' },
  { text: '코딩 패턴 분석 중...', icon: '📊' },
  { text: '개발자 DNA 해석 중...', icon: '🧬' },
];

export default function LoadingScreen({ username }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step >= STEPS.length - 1) return;
    const timer = setTimeout(() => setStep((s) => s + 1), 1200);
    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="flex flex-col items-center gap-4 py-10">
      <span className="text-5xl animate-pulse">{STEPS[step].icon}</span>
      <p className="text-sm font-semibold" style={{ color: '#7D8590' }}>@{username}</p>
      <p className="text-lg font-medium min-h-7 animate-[fadeIn_0.3s_ease]" style={{ color: '#E6EDF3' }}>
        {STEPS[step].text}
      </p>
      <div className="flex gap-1.5 mt-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full transition-colors duration-300"
            style={{ background: i <= step ? '#58A6FF' : '#30363D' }}
          />
        ))}
      </div>
    </div>
  );
}
