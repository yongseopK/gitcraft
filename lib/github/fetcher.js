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
  // created_at, pushed_at, fork 필드가 이미 포함됨 → 별도 /repos/{owner}/{repo} 불필요
  const allRepos = await githubFetch(
    `/users/${username}/repos?per_page=100&type=owner&sort=pushed`
  );

  if (!Array.isArray(allRepos)) throw new Error('GITHUB_ERROR_REPOS');

  const forkCount = allRepos.filter((r) => r.fork).length;
  const forkRatio = allRepos.length > 0 ? forkCount / allRepos.length : 0;

  // 분석 대상: fork 제외, pushed_at 최근 순 상위 10개
  const targetRepos = allRepos
    .filter((r) => !r.fork && r.name)
    .slice(0, MAX_REPOS);

  if (targetRepos.length === 0) throw new Error('NO_PUBLIC_REPOS');

  // 3단계 + 4단계: 커밋 & 언어 병렬 수집 (최대 20 req = 레포 10개 × 2)
  const repoData = await Promise.all(
    targetRepos.map((repo) => fetchRepoData(username, repo))
  );

  const allCommits = repoData.flatMap((r) => r.commits);

  if (allCommits.length < 5) throw new Error('NOT_ENOUGH_COMMITS');

  return {
    user: {
      login:       user.login,
      name:        user.name,
      avatarUrl:   user.avatar_url,
      publicRepos: user.public_repos,
    },
    repos: repoData.map((r) => ({
      name:        r.name,
      commitCount: r.commits.length,
      createdAt:   r.createdAt,
      pushedAt:    r.pushedAt,
      languages:   r.languages,
    })),
    commits: allCommits,
    meta: {
      totalRepos:    allRepos.length,
      forkCount,
      forkRatio,
      analyzedRepos: targetRepos.length,
      totalCommits:  allCommits.length,
    },
  };
}

/**
 * 레포 1개의 커밋 + 언어 수집 (2 req — repoInfo는 repos 목록에서 이미 확보)
 * @param {string} owner
 * @param {object} repoMeta - /repos 목록의 레포 항목
 */
async function fetchRepoData(owner, repoMeta) {
  const repoName = encodeURIComponent(repoMeta.name);

  const [rawCommits, languages] = await Promise.all([
    githubFetch(
      `/repos/${owner}/${repoName}/commits?per_page=${MAX_COMMITS_PER_REPO}`
    ).catch(() => []),
    githubFetch(
      `/repos/${owner}/${repoName}/languages`
    ).catch(() => ({})),
  ]);

  const commits = (Array.isArray(rawCommits) ? rawCommits : [])
    .filter((c) => c?.commit?.author?.date)
    .map((c) => ({
      sha:     c.sha,
      message: (c.commit.message ?? '').split('\n')[0].slice(0, 200),
      date:    c.commit.author.date,
    }));

  return {
    name:      repoMeta.name,
    createdAt: repoMeta.created_at,
    pushedAt:  repoMeta.pushed_at,
    commits,
    languages: (languages && typeof languages === 'object') ? languages : {},
  };
}
