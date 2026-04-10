const BASE_URL   = 'https://api.github.com';
const TIMEOUT_MS = 8000;

// 헤더는 런타임 중 변경되지 않으므로 모듈 초기화 시 1회만 생성
const HEADERS = Object.freeze({
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
});

export async function githubFetch(path) {
  const controller = new AbortController();
  const timer      = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: HEADERS,
      signal:  controller.signal,
    });

    if (res.status === 404) throw new Error('NOT_FOUND');
    if (res.status === 403) throw new Error('RATE_LIMIT');
    if (res.status === 429) throw new Error('RATE_LIMIT');
    if (!res.ok)            throw new Error(`GITHUB_ERROR_${res.status}`);

    return res.json();
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('GITHUB_TIMEOUT');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}
