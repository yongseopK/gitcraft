import { fetchUserData } from '@/lib/github/fetcher';
import { analyze } from '@/lib/analyzer';
import { getCached, setCached } from '@/lib/cache';
import { USERNAME_RE } from '@/lib/validation';

const ipHits      = new Map();
const RATE_LIMIT  = 10;
const RATE_WINDOW = 60 * 60 * 1000;

function checkRateLimit(ip) {
  const now   = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  // 만료 항목은 다음 접근 시 덮어쓰이므로 별도 정리 불필요
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim()
    ?? req.socket?.remoteAddress
    ?? 'unknown';

  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: '요청이 너무 많습니다. 1시간 후 다시 시도해주세요.' });
  }

  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'username이 필요합니다' });
  }

  const clean = username.trim();
  if (!USERNAME_RE.test(clean)) {
    return res.status(400).json({ error: '올바른 GitHub 유저네임이 아닙니다' });
  }

  const normalized = clean.toLowerCase();

  try {
    const cached = await getCached(normalized);
    if (cached) return res.status(200).json({ ...cached, fromCache: true });

    const rawData = await fetchUserData(normalized);
    const result  = analyze(rawData);

    await setCached(normalized, result);

    return res.status(200).json({ ...result, fromCache: false });
  } catch (err) {
    const errorMap = {
      NOT_FOUND:          { status: 404, message: '존재하지 않는 GitHub 유저입니다' },
      RATE_LIMIT:         { status: 429, message: 'GitHub API 한도 초과, 잠시 후 다시 시도해주세요' },
      NO_PUBLIC_REPOS:    { status: 422, message: '분석 가능한 공개 레포지토리가 없습니다' },
      NOT_ENOUGH_COMMITS: { status: 422, message: '커밋 데이터가 너무 적어 분석할 수 없습니다' },
      GITHUB_TIMEOUT:     { status: 504, message: 'GitHub 응답이 너무 느립니다. 잠시 후 다시 시도해주세요' },
    };

    const mapped = errorMap[err.message];
    if (mapped) return res.status(mapped.status).json({ error: mapped.message });

    console.error('[analyze]', err);
    return res.status(500).json({ error: '분석 중 오류가 발생했습니다' });
  }
}
