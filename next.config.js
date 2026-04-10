/** @type {import('next').NextConfig} */

const securityHeaders = [
  // MIME 타입 스니핑 방지
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // 클릭재킹 방지 — 외부 iframe 삽입 금지
  { key: 'X-Frame-Options', value: 'DENY' },
  // Referer 헤더 최소화 — 분석 결과 URL이 외부로 누출되지 않도록
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // 불필요한 브라우저 기능 비활성화
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // XSS 필터 (구형 브라우저)
  { key: 'X-XSS-Protection', value: '1; mode=block' },
];

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

module.exports = nextConfig;
