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
        {/* 배경 glow */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 360, height: 360, borderRadius: '50%',
          background: type.color, opacity: 0.15,
          filter: 'blur(60px)',
          display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, left: -60,
          width: 240, height: 240, borderRadius: '50%',
          background: type.color, opacity: 0.08,
          filter: 'blur(40px)',
          display: 'flex',
        }} />

        {/* 상단 바 */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: 4, background: type.color,
          display: 'flex',
        }} />

        {/* 메인 콘텐츠 */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          flex: 1, padding: '44px 52px 36px',
          justifyContent: 'space-between',
        }}>
          {/* 상단: 유형 배지 */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
          }}>
            <div style={{
              background: type.color + '22',
              border: `1px solid ${type.color}55`,
              borderRadius: 20, padding: '5px 14px',
              fontSize: 13, fontWeight: 600, color: type.color,
              display: 'flex',
            }}>
              개발자 유형 분석
            </div>
          </div>

          {/* 중앙: 이모지 + 이름 + 설명 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 64, lineHeight: 1, display: 'flex' }}>{type.emoji}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', lineHeight: 1.2, display: 'flex' }}>
              {type.name}
            </div>
            <div style={{ fontSize: 17, color: '#8B95A1', lineHeight: 1.5, display: 'flex' }}>
              {type.subtitle}
            </div>
          </div>

          {/* 하단: 유저네임 + 브랜드 */}
          <div style={{
            display: 'flex', alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: '#30363D',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14,
              }}>👤</div>
              <div style={{ fontSize: 15, color: '#8B95A1', display: 'flex' }}>@{username}</div>
            </div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
            }}>
              <div style={{ fontSize: 13, color: '#484F58', display: 'flex' }}>powered by</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: type.color, display: 'flex' }}>GitCraft</div>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 600, height: 315 }
  );
}
