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
        alignItems: 'center', justifyContent: 'center',
        background: '#F9FAFB', fontFamily: 'sans-serif',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px', background: type.color,
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
          <div style={{ fontSize: 14, fontWeight: 600, color: type.color }}>GitCraft</div>
        </div>
      </div>
    ),
    { width: 600, height: 315 }
  );
}
