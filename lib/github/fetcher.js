import { githubFetch } from './client';

const MAX_REPOS = 10;
const MAX_COMMITS_PER_REPO = 100;

/**
 * 분석에 필요한 GitHub 데이터 전체 수집 (총 22 req)
 * @returns {Promise<RawData>}
 */
export async function fetchUserData(username) {
  // 1단계: 유저 프로필 (1 req)
  const user = await githubFetch(`/users/${username}`);

  // 2단계: 전체 레포 목록 (1 req)
  // fork 여부 포함해서 가져옴 → 특수조건B(오픈소스형) 판정용
  const allRepos = await githubFetch(
    `/users/${username}/repos?per_page=100&type=owner&sort=pushed`
  );

  const forkCount = allRepos.filter((r) => r.fork).length;
  const forkRatio = allRepos.length > 0 ? forkCount / allRepos.length : 0;

  // 분석 대상: fork 제외, pushed_at 최근 순 상위 10개
  const targetRepos = allRepos
    .filter((r) => !r.fork)
    .slice(0, MAX_REPOS);

  if (targetRepos.length === 0) {
    throw new Error('NO_PUBLIC_REPOS');
  }

  // 3단계 + 4단계: 커밋 & 언어 병렬 수집 (최대 20 req)
  const repoData = await Promise.all(
    targetRepos.map((repo) => fetchRepoData(username, repo.name))
  );

  // 커밋 전체를 하나의 배열로 flatten
  const allCommits = repoData.flatMap((r) => r.commits);
  const totalCommits = allCommits.length;

  if (totalCommits < 5) {
    throw new Error('NOT_ENOUGH_COMMITS');
  }

  return {
    user: {
      login: user.login,
      name: user.name,
      avatarUrl: user.avatar_url,
      publicRepos: user.public_repos,
    },
    repos: repoData.map((r) => ({
      name: r.name,
      commitCount: r.commits.length,
      createdAt: r.createdAt,
      pushedAt: r.pushedAt,
      languages: r.languages,
    })),
    commits: allCommits,
    meta: {
      totalRepos: allRepos.length,
      forkCount,
      forkRatio,
      analyzedRepos: targetRepos.length,
      totalCommits,
    },
  };
}

/**
 * 레포 1개의 커밋 + 언어 수집
 */
async function fetchRepoData(owner, repo) {
  const repoInfo = await githubFetch(`/repos/${owner}/${repo}`);

  const [rawCommits, languages] = await Promise.all([
    githubFetch(
      `/repos/${owner}/${repo}/commits?per_page=${MAX_COMMITS_PER_REPO}`
    ).catch(() => []), // 빈 레포나 접근 불가 시 빈 배열
    githubFetch(`/repos/${owner}/${repo}/languages`).catch(() => ({})),
  ]);

  const commits = rawCommits.map((c) => ({
    sha: c.sha,
    message: c.commit.message.split('\n')[0], // 첫 줄만 (subject line)
    date: c.commit.author.date,               // ISO 8601 UTC
  }));

  return {
    name: repo,
    createdAt: repoInfo.created_at,
    pushedAt: repoInfo.pushed_at,
    commits,
    languages, // { TypeScript: 123456, JavaScript: 78901, ... }
  };
}
