const SLOTS = [
  { label: '새벽', range: [0, 6] },
  { label: '오전', range: [6, 12] },
  { label: '오후', range: [12, 18] },
  { label: '저녁', range: [18, 21] },
  { label: '야간', range: [21, 24] },
];

const COLOR_ACTIVE  = '#3182F6';
const COLOR_PASSIVE = '#E5E8EB';

export default function TimeDistChart({ hourDist, peakHour }) {
  const slotCounts = SLOTS.map(({ range: [s, e] }) =>
    hourDist.slice(s, e).reduce((a, b) => a + b, 0)
  );
  const max       = Math.max(...slotCounts, 1);
  const peakSlot  = SLOTS.findIndex(({ range: [s, e] }) => peakHour >= s && peakHour < e);

  return (
    <div className="flex items-end gap-1 h-14">
      {SLOTS.map(({ label }, i) => (
        <div key={label} className="flex-1 flex flex-col items-center gap-1 justify-end">
          <div
            style={{
              width: '100%',
              height: `${Math.max(4, (slotCounts[i] / max) * 40)}px`,
              background: i === peakSlot ? COLOR_ACTIVE : COLOR_PASSIVE,
              borderRadius: '3px 3px 0 0',
              transition: 'height 0.4s ease',
            }}
          />
          <span className="text-[10px] text-[--color-text-secondary]">{label}</span>
        </div>
      ))}
    </div>
  );
}
