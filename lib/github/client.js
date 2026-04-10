const BASE_URL = 'https://api.github.com';

const headers = {
  Accept: 'application/vnd.github+json',
  ...(process.env.GITHUB_TOKEN && {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
  }),
};

export async function githubFetch(path) {
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  if (res.status === 404) throw new Error('NOT_FOUND');
  if (res.status === 403) throw new Error('RATE_LIMIT');
  if (!res.ok) throw new Error(`GITHUB_ERROR_${res.status}`);
  return res.json();
}
