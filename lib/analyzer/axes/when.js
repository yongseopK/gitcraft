// 축1: 활동 시간대 + 주말 분석 — 단일 패스로 모든 시간 데이터 계산
export const KST_OFFSET = 9 * 60 * 60 * 1000;

export function analyzeTime(commits) {
  const slotCounts = { dawn: 0, morning: 0, afternoon: 0, night: 0 };
  const hourDist    = Array(24).fill(0);
  const weekdayDist = Array(7).fill(0);

  for (const { date } of commits) {
    const kstMs = new Date(date).getTime() + KST_OFFSET;
    const h = new Date(kstMs).getUTCHours();
    const d = new Date(kstMs).getUTCDay();

    hourDist[h]++;
    weekdayDist[d]++;

    if (h < 6)       slotCounts.dawn++;
    else if (h < 12) slotCounts.morning++;
    else if (h < 18) slotCounts.afternoon++;
    else             slotCounts.night++;
  }

  const total = commits.length || 1;
  const ratio = {
    dawn:      slotCounts.dawn / total,
    morning:   slotCounts.morning / total,
    afternoon: slotCounts.afternoon / total,
    night:     slotCounts.night / total,
  };

  let when;
  if (ratio.dawn >= 0.25)                                      when = 'dawn';
  else if (ratio.night >= 0.45)                                when = 'night';
  else {
    const peak = Object.entries(ratio).reduce((a, b) => a[1] > b[1] ? a : b)[0];
    if (peak === 'morning'   && ratio.morning   >= 0.30) when = 'morning';
    else if (peak === 'afternoon' && ratio.afternoon >= 0.30) when = 'afternoon';
    else                                                 when = 'irregular';
  }

  const weekendCommits = weekdayDist[0] + weekdayDist[6]; // 일 + 토
  const weekendRatio   = weekendCommits / total;

  return { when, ratio, hourDist, weekdayDist, weekendRatio, isWeekend: weekendRatio >= 0.55 };
}
