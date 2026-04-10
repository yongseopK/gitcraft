const COLORS = ['#3182F6', '#FF6B35', '#00C897', '#FFB800', '#9B59B6'];

export default function LanguagePieChart({ topLanguages }) {
  if (!topLanguages?.length) return null;

  return (
    <div className="flex flex-col gap-1.5">
      {topLanguages.slice(0, 4).map(({ name, ratio }, i) => (
        <div key={name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full shrink-0" style={{ background: COLORS[i] }} />
          <span className="text-xs text-[--color-text] truncate flex-1">{name}</span>
          <span className="text-xs text-[--color-text-secondary] w-8 text-right shrink-0">
            {Math.round(ratio * 100)}%
          </span>
          <div className="w-12 h-1.5 bg-[--color-border] rounded-full overflow-hidden shrink-0">
            <div className="h-full rounded-full" style={{ width: `${ratio * 100}%`, background: COLORS[i] }} />
          </div>
        </div>
      ))}
    </div>
  );
}
