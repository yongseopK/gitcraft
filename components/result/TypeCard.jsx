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
    <div className="rounded-2xl p-8 text-center w-full" style={{ background: '#161B22', border: '1px solid #30363D' }}>
      <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#21262D' }}>
        <span className="text-4xl leading-none">{emoji}</span>
      </div>

      <h1 className="text-2xl font-bold mb-2" style={{ color: '#E6EDF3' }}>{typeName}</h1>
      <p className="text-sm mb-6 leading-relaxed" style={{ color: '#7D8590' }}>{subtitle}</p>

      <div className="flex flex-wrap gap-2 justify-center">
        {Object.entries(axes).map(([key, val]) => (
          <span key={key} className="flex items-center gap-1 rounded-full px-3 py-1 text-xs" style={{ background: '#21262D', border: '1px solid #30363D' }}>
            <span style={{ color: '#7D8590' }}>{AXIS_NAMES[key]}</span>
            <span className="font-semibold" style={{ color: '#58A6FF' }}>{AXIS_LABELS[key]?.[val] ?? val}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
