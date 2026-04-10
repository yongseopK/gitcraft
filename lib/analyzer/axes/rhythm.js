// 축2: 커밋 리듬 (Rhythm)
const WEEKS = 26;

export function analyzeRhythm(commits, repos) {
  const weeklyMap    = buildWeeklyMap(commits);
  const weeklyCounts = Object.values(weeklyMap);

  const activeWeeks  = weeklyCounts.filter((c) => c > 0).length;
  const activeRatio  = activeWeeks / WEEKS;
  const mean         = weeklyCounts.reduce((s, c) => s + c, 0) / weeklyCounts.length;
  const stddev       = Math.sqrt(
    weeklyCounts.reduce((s, c) => s + (c - mean) ** 2, 0) / weeklyCounts.length
  );

  if (activeRatio >= 0.6 && mean > 0 && stddev <= mean * 0.5) {
    return { result: 'steady', activeRatio, stddev, mean };
  }

  // 마감형: 레포별 후반 1/3에 커밋 55%+ 인 레포 비율 ≥ 50%
  const deadlineRepos = repos.filter((repo) => {
    if (repo.commits.length < 6) return false;
    // 날짜를 미리 숫자로 파싱해서 sort comparator 내 Date 객체 생성 방지
    const sorted = repo.commits
      .map((c) => Date.parse(c.date))
      .sort((a, b) => a - b);
    const cutoff     = Math.floor(sorted.length * (2 / 3));
    const lateCommits = sorted.length - cutoff;
    return lateCommits / sorted.length >= 0.55;
  });

  if (repos.length > 0 && deadlineRepos.length / repos.length >= 0.5) {
    return { result: 'deadline', deadlineRepoRatio: deadlineRepos.length / repos.length };
  }

  // 몰아치기형: 상위 20% 주간이 전체의 60%+
  const sorted      = [...weeklyCounts].sort((a, b) => b - a);
  const top20Count  = Math.max(1, Math.ceil(sorted.length * 0.2));
  const top20Sum    = sorted.slice(0, top20Count).reduce((s, c) => s + c, 0);
  const totalCommits = weeklyCounts.reduce((s, c) => s + c, 0);

  if (totalCommits > 0 && top20Sum / totalCommits >= 0.6) {
    return { result: 'burst', top20Ratio: top20Sum / totalCommits };
  }

  return { result: 'irregular' };
}

function buildWeeklyMap(commits) {
  const now = Date.now();
  const map = {};
  for (let i = 0; i < WEEKS; i++) map[i] = 0;

  for (const { date } of commits) {
    const weekIndex = Math.floor((now - Date.parse(date)) / (7 * 24 * 60 * 60 * 1000));
    if (weekIndex >= 0 && weekIndex < WEEKS) map[weekIndex]++;
  }

  return map;
}
