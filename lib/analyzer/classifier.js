// 5개 축 + 2개 특수조건 → 12개 유형 판정 (PRD 섹션 7 의사코드 구현)

export function classify(axes, special) {
  const { when, rhythm, scope, communication, completion } = axes;

  // 특수 조건 먼저 체크 (행동 패턴이 가장 명확)
  if (special.isOpenSource) return 11; // 🌐 오픈소스 시민
  if (special.isWeekend)    return 4;  // 🌊 주말 해커

  // 시간대 × 리듬
  if (when === 'dawn' && (rhythm === 'steady' || rhythm === 'improver')) return 1; // 🌙 새벽 감성 코더
  if ((when === 'morning' || when === 'afternoon') && rhythm === 'steady') return 3; // ⚙️ 9 to 6 클린 코더
  if ((rhythm === 'deadline' || rhythm === 'burst') && (when === 'night' || when === 'irregular')) return 2; // 🔥 마감 직전 스프린터

  // 전문성 × 완성도
  if (scope === 'fullstack'  && completion === 'complete') return 8; // 🏗️ 풀스택 건축가
  if (scope === 'specialist' && completion === 'complete') return 6; // 🔩 한 우물 장인

  // 소통 방식 × 완성도/리듬
  if (communication === 'verbose'     && completion === 'complete') return 9;  // 📝 문서화 신봉자
  if (communication === 'concise'     && completion === 'complete') return 10; // ⚡ 침묵의 스나이퍼
  if (communication === 'convention'  && rhythm === 'steady')       return 12; // 🎯 컨벤션 원리주의자

  // 탐험가 × 완성도 (5 vs 7 분기)
  if (scope === 'explorer' && completion === 'starter' && special.languageCount >= 6) return 5; // 🗺️ 언어 수집가
  if (completion === 'starter') return 7; // 📦 아이디어 부자

  // 남은 새벽/오전/오후 조합
  if (when === 'dawn')                                return 1; // 🌙 새벽 감성 코더
  if (when === 'morning' || when === 'afternoon')     return 3; // ⚙️ 9 to 6 클린 코더

  // 최종 폴백
  return 2; // 🔥 마감 직전 스프린터
}
