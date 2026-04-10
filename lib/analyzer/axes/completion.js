// 축5: 완성도 (Completion)

const THREE_MONTHS_MS = 90 * 24 * 60 * 60 * 1000;
const ONE_YEAR_MS = 365 * 24 * 60 * 60 * 1000;

export function analyzeCompletion(repos) {
  if (repos.length === 0) return { result: 'normal' };

  const now = Date.now();
  const commitCounts = repos.map((r) => r.commitCount);
  const avgCommits = commitCounts.reduce((s, c) => s + c, 0) / repos.length;

  const sparseRepos = repos.filter((r) => r.commitCount <= 5).length;
  const sparseRatio = sparseRepos / repos.length;

  // 완성형: 평균 커밋 ≥ 30 AND 빈 레포 비율 ≤ 30%
  if (avgCommits >= 30 && sparseRatio <= 0.3) {
    return { result: 'complete', avgCommits, sparseRatio };
  }

  // 개선형: 1년 이상 된 레포 중 최근 3개월 내 커밋이 있는 비율 ≥ 40%
  const oldRepos = repos.filter(
    (r) => now - new Date(r.createdAt).getTime() >= ONE_YEAR_MS
  );
  if (oldRepos.length >= 2) {
    const recentlyUpdated = oldRepos.filter(
      (r) => now - new Date(r.pushedAt).getTime() <= THREE_MONTHS_MS
    ).length;
    if (recentlyUpdated / oldRepos.length >= 0.4) {
      return { result: 'improver', oldRepos: oldRepos.length, recentlyUpdated };
    }
  }

  // 시작형: 빈 레포 비율 ≥ 50%
  if (sparseRatio >= 0.5) {
    return { result: 'starter', sparseRatio, avgCommits };
  }

  return { result: 'normal', avgCommits, sparseRatio };
}
