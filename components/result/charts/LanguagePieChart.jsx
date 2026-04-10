const COLORS = ['#3182F6', '#FF6B35', '#00C897', '#FFB800', '#9B59B6'];

const ABBR = {
  'JavaScript': 'JS', 'TypeScript': 'TS', 'CoffeeScript': 'Coffee',
  'C++': 'C++', 'C#': 'C#', 'Objective-C': 'ObjC',
  'Visual Basic .NET': 'VB.NET', 'Assembly': 'Asm',
};

function shortName(name) {
  if (ABBR[name]) return ABBR[name];
  if (name.length <= 10) return name;
  return name.slice(0, 9) + '…';
}

export default function LanguagePieChart({ topLanguages }) {
  if (!topLanguages?.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {topLanguages.slice(0, 4).map(({ name, ratio }, i) => (
        <div key={name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
          <span className="text-xs shrink-0" style={{ color: '#E6EDF3' }}>{shortName(name)}</span>
          <span className="text-xs w-8 text-right shrink-0" style={{ color: '#7D8590' }}>
            {Math.round(ratio * 100)}%
          </span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#30363D' }}>
            <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: COLORS[i] }} />
          </div>
        </div>
      ))}
    </div>
  );
}
