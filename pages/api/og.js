import { ImageResponse } from '@vercel/og';

export const config = { runtime: 'edge' };

const COLORS = {
  1: '#6366F1', 2: '#EF4444', 3: '#3182F6', 4: '#0EA5E9',
  5: '#8B5CF6', 6: '#F59E0B', 7: '#EC4899', 8: '#10B981',
  9: '#06B6D4', 10: '#64748B', 11: '#22C55E', 12: '#3182F6',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') ?? 'unknown';
  const typeId   = Number(searchParams.get('typeId') ?? 0);
  const emoji    = searchParams.get('emoji') ?? '⚒️';
  const typeName = searchParams.get('typeName') ?? '';
  const subtitle = searchParams.get('subtitle') ?? '';

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
        {/* 배경 액센트 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px', background: accent,
        }} />

        {/* 이모지 */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: '#fff', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 48, marginBottom: 20,
          boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
        }}>
          {emoji}
        </div>

        {/* 유형명 */}
        <div style={{ fontSize: 36, fontWeight: 700, color: '#191F28', marginBottom: 8 }}>
          {typeName}
        </div>

        {/* 부제 */}
        <div style={{ fontSize: 18, color: '#8B95A1', marginBottom: 32, textAlign: 'center', maxWidth: 400 }}>
          {subtitle}
        </div>

        {/* 유저네임 + 브랜드 */}
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
