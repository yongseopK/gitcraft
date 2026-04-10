// 축3: 전문성 방향 (Scope)

const FRONTEND_LANGS = new Set(['JavaScript', 'TypeScript', 'HTML', 'CSS', 'Vue', 'Svelte']);
const BACKEND_LANGS  = new Set(['Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby', 'Kotlin', 'C', 'C++']);

export function analyzeScope(repos) {
  // 전체 레포의 언어 바이트 수 합산
  const totals = Object.create(null); // prototype pollution 방지
  for (const repo of repos) {
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      totals[lang] = (totals[lang] ?? 0) + bytes;
    }
  }

  const grandTotal = Object.values(totals).reduce((s, b) => s + b, 0);
  if (grandTotal === 0) return { result: 'specialist', topLanguages: [] };

  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .map(([name, bytes]) => ({ name, bytes, ratio: bytes / grandTotal }));

  const languageCount = sorted.length;

  // 프론트/백엔드 비율 계산
  let frontRatio = 0;
  let backRatio = 0;
  for (const { name, ratio } of sorted) {
    if (FRONTEND_LANGS.has(name)) frontRatio += ratio;
    if (BACKEND_LANGS.has(name))  backRatio  += ratio;
  }

  // 우선순위: 풀스택 > 전문가 > 탐험가
  if (frontRatio >= 0.2 && backRatio >= 0.2) {
    return { result: 'fullstack', frontRatio, backRatio, topLanguages: sorted.slice(0, 5) };
  }

  const top2Ratio = sorted.slice(0, 2).reduce((s, l) => s + l.ratio, 0);
  if (top2Ratio >= 0.8) {
    return { result: 'specialist', top2Ratio, topLanguages: sorted.slice(0, 5) };
  }

  if (languageCount >= 5) {
    return { result: 'explorer', languageCount, topLanguages: sorted.slice(0, 5) };
  }

  // 기본값: 전문가형으로 처리
  return { result: 'specialist', top2Ratio, topLanguages: sorted.slice(0, 5) };
}
