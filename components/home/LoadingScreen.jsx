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
      <p className="text-sm font-semibold text-[--color-text-secondary]">@{username}</p>
      <p className="text-lg font-medium text-[--color-text] min-h-7 animate-[fadeIn_0.3s_ease]">
        {STEPS[step].text}
      </p>
      <div className="flex gap-1.5 mt-2">
        {STEPS.map((_, i) => (
          <span
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${i <= step ? 'bg-[--color-primary]' : 'bg-[--color-border]'}`}
          />
        ))}
      </div>
    </div>
  );
}
