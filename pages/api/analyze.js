import { fetchUserData } from '@/lib/github/fetcher';
import { analyze } from '@/lib/analyzer';
import { getCached, setCached } from '@/lib/cache';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { username } = req.query;
  if (!username || typeof username !== 'string') {
    return res.status(400).json({ error: 'username이 필요합니다' });
  }

  const clean = username.trim().toLowerCase();

  try {
    // 캐시 확인
    const cached = await getCached(clean);
    if (cached) {
      return res.status(200).json({ ...cached, fromCache: true });
    }

    // GitHub 데이터 수집 + 분석
    const rawData = await fetchUserData(clean);
    const result  = analyze(rawData);

    // 캐시 저장
    await setCached(clean, result);

    return res.status(200).json({ ...result, fromCache: false });
  } catch (err) {
    const errorMap = {
      NOT_FOUND:          { status: 404, message: '존재하지 않는 GitHub 유저입니다' },
      RATE_LIMIT:         { status: 429, message: 'GitHub API 한도 초과, 잠시 후 다시 시도해주세요' },
      NO_PUBLIC_REPOS:    { status: 422, message: '분석 가능한 공개 레포지토리가 없습니다' },
      NOT_ENOUGH_COMMITS: { status: 422, message: '커밋 데이터가 너무 적어 분석할 수 없습니다' },
    };

    const mapped = errorMap[err.message];
    if (mapped) {
      return res.status(mapped.status).json({ error: mapped.message });
    }

    console.error('[analyze]', err);
    return res.status(500).json({ error: '분석 중 오류가 발생했습니다' });
  }
}
