import { Redis } from '@upstash/redis';

// env 없으면 캐시 비활성화 (로컬 개발 편의)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url:   process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const TTL = 60 * 60 * 24; // 24시간

function cacheKey(username) {
  const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  return `gitcraft:${username}:${today}`;
}

export async function getCached(username) {
  if (!redis) return null;
  try {
    return await redis.get(cacheKey(username));
  } catch {
    return null;
  }
}

export async function setCached(username, data) {
  if (!redis) return;
  try {
    await redis.set(cacheKey(username), data, { ex: TTL });
  } catch {
    // 캐시 실패는 무시 — 분석 결과 반환에 영향 없음
  }
}
