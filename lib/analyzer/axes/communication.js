// 축4: 소통 방식 (Communication)

const CONVENTION_RE = /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?:/i;
// 이모지: 유니코드 이모지 범위 + 일반적인 텍스트 이모지
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/u;

export function analyzeCommunication(commits) {
  if (commits.length === 0) return { result: 'normal' };

  let conventionCount = 0;
  let emojiCount = 0;
  let totalLen = 0;

  for (const { message } of commits) {
    if (CONVENTION_RE.test(message)) conventionCount++;
    if (EMOJI_RE.test(message)) emojiCount++;
    // 한글/영문 모두 1자 기준
    totalLen += [...message].length;
  }

  const total = commits.length;
  const conventionRatio = conventionCount / total;
  const emojiRatio = emojiCount / total;
  const avgLen = totalLen / total;

  // 우선순위: 컨벤션 > 이모지 > 설명충 > 요약파 > 보통
  if (conventionRatio >= 0.5)  return { result: 'convention', conventionRatio, avgLen };
  if (emojiRatio >= 0.3)       return { result: 'emoji',      emojiRatio,      avgLen };
  if (avgLen >= 40)            return { result: 'verbose',    avgLen };
  if (avgLen <= 15)            return { result: 'concise',    avgLen };

  return { result: 'normal', avgLen };
}
