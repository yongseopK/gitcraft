# GitCraft

GitHub 커밋 데이터로 나의 개발자 유형을 분석해주는 서비스.

OAuth 없이 GitHub 유저네임만 입력하면 12가지 유형 중 하나를 판정해준다.

**→ [git.typecraft.kr](https://git.typecraft.kr)**

---

## 개발자 유형 (12종)

| 유형 | 설명 |
|------|------|
| 🌙 새벽 감성 코더 | 세상이 잠든 시간에 코딩하는 낭만주의자 |
| 🔥 마감 직전 스프린터 | 평소엔 잠잠, D-1에 폭발 |
| ⚙️ 9 to 6 클린 코더 | 퇴근 후엔 진짜 쉬는 건강한 개발자 |
| 🌊 주말 해커 | 평일은 생존, 주말은 창조 |
| 🗺️ 언어 수집가 | 새 언어 보면 일단 Hello World부터 |
| 🔩 한 우물 장인 | 하나를 파도 제대로 판다 |
| 📦 아이디어 부자 | 레포는 많은데 main이 없다 |
| 🏗️ 풀스택 건축가 | 프론트도 백엔드도 내 영역 |
| 📝 문서화 신봉자 | README 없으면 코드가 아니다 |
| ⚡ 침묵의 스나이퍼 | 커밋은 적지만 하나하나 크다 |
| 🌐 오픈소스 시민 | 혼자보단 함께, Fork와 PR의 달인 |
| 🎯 컨벤션 원리주의자 | feat: fix: docs: 없으면 커밋 못 한다 |

---

## 분석 방식

GitHub Public API로 최근 레포 10개의 커밋을 수집 (OAuth 불필요)하여 5개 축으로 분석한다.

| 축 | 측정 항목 |
|----|-----------|
| **When** | 커밋 시간대 (새벽 / 오전 / 오후 / 저녁 / 야간) |
| **Rhythm** | 커밋 패턴 (마감 집중형 vs 꾸준형) |
| **Scope** | 언어·레포 다양성 |
| **Communication** | 커밋 메시지 품질 (컨벤션, 길이) |
| **Completion** | 레포 완성도 (커밋 수, 마지막 푸시) |

특수 조건 2개가 우선 적용된다.

- **주말형**: 주말 커밋 비율 ≥ 55%
- **오픈소스형**: fork 레포 비율 ≥ 35%

---

## 기술 스택

- **Framework**: Next.js 15 (Pages Router)
- **Styling**: Tailwind CSS v4
- **Cache**: Upstash Redis (24h TTL)
- **OG Image**: @vercel/og (Edge Runtime)
- **Deploy**: Vercel

---

## 로컬 실행

```bash
git clone https://github.com/yongseopK/gitcraft.git
cd gitcraft
npm install
```

`.env.local` 파일 생성:

```
GITHUB_TOKEN=ghp_your_token_here        # 선택 (없으면 rate limit 60 req/h)
UPSTASH_REDIS_REST_URL=https://...      # 선택 (없으면 캐시 비활성화)
UPSTASH_REDIS_REST_TOKEN=...            # 선택
NEXT_PUBLIC_KAKAO_KEY=...               # 선택 (카카오 공유)
```

```bash
npm run dev
# http://localhost:3000
```

`GITHUB_TOKEN` 없이도 실행되지만 GitHub API rate limit이 60 req/h로 제한된다.  
토큰은 [여기서](https://github.com/settings/tokens) 발급 (권한 불필요, public repo 접근만).
