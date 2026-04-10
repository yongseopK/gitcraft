// 축2: 커밋 리듬 (Rhythm)

const WEEKS = 26; // 분석 기간: 최근 26주

export function analyzeRhythm(commits, repos) {
  const weeklyMap = buildWeeklyMap(commits);
  const weeklyCounts = Object.values(weeklyMap); // 각 주간 커밋 수 배열

  // 꾸준형: 활동 주간 60%+ AND 표준편차 ≤ 평균의 50%
  const activeWeeks = weeklyCounts.filter((c) => c > 0).length;
  const activeRatio = activeWeeks / WEEKS;
  const mean = weeklyCounts.reduce((s, c) => s + c, 0) / weeklyCounts.length;
  const stddev = Math.sqrt(
    weeklyCounts.reduce((s, c) => s + (c - mean) ** 2, 0) / weeklyCounts.length
  );

  if (activeRatio >= 0.6 && mean > 0 && stddev <= mean * 0.5) {
    return { result: 'steady', activeRatio, stddev, mean };
  }

  // 마감형: 레포별로 후반 1/3에 커밋이 55%+ 인 레포 비율 ≥ 50%
  const deadlineRepos = repos.filter((repo) => {
    if (repo.commits.length < 6) return false;
    const sorted = [...repo.commits].sort((a, b) => new Date(a.date) - new Date(b.date));
    const cutoff = Math.floor(sorted.length * (2 / 3));
    const lateCommits = sorted.slice(cutoff).length;
    return lateCommits / sorted.length >= 0.55;
  });

  if (repos.length > 0 && deadlineRepos.length / repos.length >= 0.5) {
    return { result: 'deadline', deadlineRepoRatio: deadlineRepos.length / repos.length };
  }

  // 몰아치기형: 상위 20% 주간이 전체 커밋의 60%+
  const sorted = [...weeklyCounts].sort((a, b) => b - a);
  const top20Count = Math.max(1, Math.ceil(sorted.length * 0.2));
  const top20Sum = sorted.slice(0, top20Count).reduce((s, c) => s + c, 0);
  const totalCommits = weeklyCounts.reduce((s, c) => s + c, 0);

  if (totalCommits > 0 && top20Sum / totalCommits >= 0.6) {
    return { result: 'burst', top20Ratio: top20Sum / totalCommits };
  }

  return { result: 'irregular' };
}

function buildWeeklyMap(commits) {
  const now = Date.now();
  const map = {};

  // 26주치 슬롯 초기화
  for (let i = 0; i < WEEKS; i++) {
    map[i] = 0;
  }

  for (const { date } of commits) {
    const diff = now - new Date(date).getTime();
    const weekIndex = Math.floor(diff / (7 * 24 * 60 * 60 * 1000));
    if (weekIndex >= 0 && weekIndex < WEEKS) {
      map[weekIndex]++;
    }
  }

  return map;
}
