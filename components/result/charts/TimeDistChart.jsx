const SLOTS = [
  { label: '새벽', range: [0, 6] },
  { label: '오전', range: [6, 12] },
  { label: '오후', range: [12, 18] },
  { label: '저녁', range: [18, 21] },
  { label: '야간', range: [21, 24] },
];

export default function TimeDistChart({ hourDist, peakHour }) {
  const slotCounts = SLOTS.map(({ range: [s, e] }) =>
    hourDist.slice(s, e).reduce((a, b) => a + b, 0)
  );
  const max = Math.max(...slotCounts, 1);
  const peakSlot = SLOTS.findIndex(({ range: [s, e] }) => peakHour >= s && peakHour < e);

  return (
    <div className="flex items-end gap-1 h-14">
      {SLOTS.map(({ label }, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1 justify-end">
          <div
            className={`w-full rounded-t transition-all ${i === peakSlot ? 'bg-[--color-primary]' : 'bg-[--color-border]'}`}
            style={{ height: `${Math.max(4, (slotCounts[i] / max) * 40)}px` }}
          />
          <span className="text-[10px] text-[--color-text-secondary]">{label}</span>
        </div>
      ))}
    </div>
  );
}
