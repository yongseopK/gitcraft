import { ImageResponse } from '@vercel/og';
import { TYPES } from '@/lib/types/definitions';

export const config = { runtime: 'edge' };

const COLORS = {
  1: '#6366F1', 2: '#EF4444', 3: '#3182F6', 4: '#0EA5E9',
  5: '#8B5CF6', 6: '#F59E0B', 7: '#EC4899', 8: '#10B981',
  9: '#06B6D4', 10: '#64748B', 11: '#22C55E', 12: '#3182F6',
};

const USERNAME_RE = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,37}[a-zA-Z0-9]$|^[a-zA-Z0-9]$/;

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  // username 검증
  const rawUsername = searchParams.get('username') ?? '';
  const username = USERNAME_RE.test(rawUsername) ? rawUsername : 'unknown';

  // typeId는 1~12 범위만 허용 — 나머지 파라미터는 TYPES에서 가져옴 (외부 입력 신뢰 안 함)
  const typeId = Math.min(12, Math.max(1, Number(searchParams.get('typeId') ?? 0)));
  const type = TYPES[typeId];

  const accent = COLORS[typeId] ?? '#3182F6';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F9FAFB',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px', background: accent,
        }} />

        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 48, marginBottom: 20,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          {type.emoji}
        </div>

        <div style={{ fontSize: 36, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>
          {type.name}
        </div>

        <div style={{ fontSize: 18, color: '#8B95A1', marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
          {type.subtitle}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 14, color: '#8B95A1' }}>@{username}</div>
          <div style={{ width: 4, height: 4, borderRadius: '50%', background: '#E5E8EB' }} />
          <div style={{ fontSize: 14, fontWeight: 600, color: accent }}>GitCraft</div>
        </div>
      </div>
    ),
    { width: 600, height: 315 }
  );
}
