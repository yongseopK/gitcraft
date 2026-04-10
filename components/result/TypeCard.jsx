const AXIS_LABELS = {
  when:          { dawn: '새벽형', morning: '오전형', afternoon: '오후형', night: '야간형', irregular: '불규칙형' },
  rhythm:        { steady: '꾸준형', burst: '몰아치기형', deadline: '마감형', irregular: '불규칙형' },
  scope:         { specialist: '전문가형', fullstack: '풀스택형', explorer: '탐험가형' },
  communication: { convention: '컨벤션파', emoji: '이모지형', verbose: '설명충형', concise: '요약파형', normal: '보통형' },
  completion:    { complete: '완성형', starter: '시작형', improver: '개선형', normal: '보통형' },
};

const AXIS_NAMES = {
  when: '시간대', rhythm: '리듬', scope: '전문성',
  communication: '소통', completion: '완성도',
};

export default function TypeCard({ emoji, typeName, subtitle, axes }) {
  return (
    <div className="bg-white rounded-2xl p-8 text-center shadow-sm w-full">
      <div className="w-20 h-20 bg-[--color-bg] rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl leading-none">{emoji}</span>
      </div>

      <h1 className="text-2xl font-bold text-[--color-text] mb-2">{typeName}</h1>
      <p className="text-sm text-[--color-text-secondary] mb-6 leading-relaxed">{subtitle}</p>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(axes).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1 bg-[--color-bg] rounded-full px-3 py-1 text-xs">
            <span className="text-[--color-text-secondary]">{AXIS_NAMES[key]}</span>
            <span className="text-[--color-primary] font-semibold">{AXIS_LABELS[key]?.[val] ?? val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
