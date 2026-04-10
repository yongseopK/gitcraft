import { ImageResponse } from '@vercel/og';
import { TYPES } from '@/lib/types/definitions';
import { USERNAME_RE } from '@/lib/validation';

export const config = { runtime: 'edge' };

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const rawUsername = searchParams.get('username') ?? '';
  const username    = USERNAME_RE.test(rawUsername) ? rawUsername : 'unknown';
  const typeId      = Math.min(12, Math.max(1, Number(searchParams.get('typeId') ?? 1)));
  const type        = TYPES[typeId];

  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%',
        display: 'flex', flexDirection: 'column',
        background: '#0D1117',
        fontFamily: 'sans-serif',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* 배경 glow — 우상단 */}
        <div style={{
          position: 'absolute', top: -120, right: -120,
          width: 480, height: 480, borderRadius: '50%',
          background: type.color, opacity: 0.18,
          filter: 'blur(80px)',
          display: 'flex',
        }} />
        {/* 배경 glow — 좌하단 */}
        <div style={{
          position: 'absolute', bottom: -80, left: -80,
          width: 320, height: 320, borderRadius: '50%',
          background: type.color, opacity: 0.08,
          filter: 'blur(60px)',
          display: 'flex',
        }} />

        {/* 상단 컬러 바 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 5, background: type.color,
          display: 'flex',
        }} />

        {/* 콘텐츠 */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          flex: 1, padding: '52px 56px 48px',
          justifyContent: 'space-between',
        }}>

          {/* 상단: 브랜드 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              background: type.color + '22',
              border: `1px solid ${type.color}44`,
              borderRadius: 24, padding: '6px 16px',
              fontSize: 14, fontWeight: 600, color: type.color,
              display: 'flex',
            }}>
              GitCraft · 개발자 유형 분석
            </div>
          </div>

          {/* 중앙: 이모지 + 유형명 + 설명 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ fontSize: 80, lineHeight: 1, display: 'flex' }}>{type.emoji}</div>
            <div style={{
              fontSize: 48, fontWeight: 800, color: '#FFFFFF',
              lineHeight: 1.15, letterSpacing: '-0.5px', display: 'flex',
            }}>
              {type.name}
            </div>
            <div style={{ fontSize: 20, color: '#6E7681', lineHeight: 1.5, display: 'flex' }}>
              {type.subtitle}
            </div>
          </div>

          {/* 하단: 유저네임 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: type.color, display: 'flex',
            }} />
            <div style={{ fontSize: 16, color: '#484F58', display: 'flex' }}>@{username}의 GitHub 분석 결과</div>
          </div>
        </div>
      </div>
    ),
    { width: 600, height: 600 }
  );
}
