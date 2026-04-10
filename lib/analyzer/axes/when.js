// 축1: 활동 시간대 (When)
// 커밋 timestamp UTC → UTC+9 변환 후 시간대 분포 계산

const KST_OFFSET = 9 * 60 * 60 * 1000;

function getKSTHour(isoDate) {
  return new Date(new Date(isoDate).getTime() + KST_OFFSET).getUTCHours();
}

export function analyzeWhen(commits) {
  const counts = { dawn: 0, morning: 0, afternoon: 0, night: 0 };

  for (const { date } of commits) {
    const h = getKSTHour(date);
    if (h < 6)        counts.dawn++;
    else if (h < 12)  counts.morning++;
    else if (h < 18)  counts.afternoon++;
    else              counts.night++;
  }

  const total = commits.length;
  const ratio = {
    dawn:      counts.dawn / total,
    morning:   counts.morning / total,
    afternoon: counts.afternoon / total,
    night:     counts.night / total,
  };

  // 우선순위: 새벽 > 야간 > 오전 > 오후 > 불규칙
  if (ratio.dawn >= 0.25) return { result: 'dawn', ratio };
  if (ratio.night >= 0.45) return { result: 'night', ratio };

  const peak = Object.entries(ratio).reduce((a, b) => (a[1] > b[1] ? a : b))[0];
  if (peak === 'morning' && ratio.morning >= 0.30) return { result: 'morning', ratio };
  if (peak === 'afternoon' && ratio.afternoon >= 0.30) return { result: 'afternoon', ratio };

  return { result: 'irregular', ratio };
}

// 특수조건A: 주말형 판정 (classifier에서 호출)
export function analyzeWeekend(commits) {
  let weekend = 0;
  for (const { date } of commits) {
    const day = new Date(new Date(date).getTime() + KST_OFFSET).getUTCDay();
    if (day === 0 || day === 6) weekend++;
  }
  const weekendRatio = weekend / commits.length;
  return { isWeekend: weekendRatio >= 0.55, weekendRatio };
}
