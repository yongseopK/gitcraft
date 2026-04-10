import { analyzeWhen, analyzeWeekend } from './axes/when';
import { analyzeRhythm } from './axes/rhythm';
import { analyzeScope } from './axes/scope';
import { analyzeCommunication } from './axes/communication';
import { analyzeCompletion } from './axes/completion';
import { classify } from './classifier';
import { TYPES } from '../types/definitions';

/**
 * 수집된 GitHub 원시 데이터 → 유형 판정 결과
 * @param {RawData} rawData - fetcher.js의 fetchUserData 반환값
 * @returns {AnalysisResult}
 */
export function analyze(rawData) {
  const { commits, repos, meta } = rawData;

  // 5개 축 분석
  const when         = analyzeWhen(commits);
  const rhythm       = analyzeRhythm(commits, repos);
  const scope        = analyzeScope(repos);
  const communication = analyzeCommunication(commits);
  const completion   = analyzeCompletion(repos);

  // 2개 특수 조건
  const weekend = analyzeWeekend(commits);
  const special = {
    isOpenSource:  meta.forkRatio >= 0.35,
    isWeekend:     weekend.isWeekend,
    languageCount: scope.topLanguages?.length ?? 0,
    weekendRatio:  weekend.weekendRatio,
    forkRatio:     meta.forkRatio,
  };

  // 유형 판정
  const typeId = classify(
    {
      when:          when.result,
      rhythm:        rhythm.result,
      scope:         scope.result,
      communication: communication.result,
      completion:    completion.result,
    },
    special
  );

  const type = TYPES[typeId];

  // 결과 화면에서 쓸 통계 (PRD 섹션 7 결과 데이터 구조)
  const stats = buildStats(commits, repos, meta);

  return {
    typeId,
    typeName:    type.name,
    emoji:       type.emoji,
    subtitle:    type.subtitle,
    axes: {
      when:          when.result,
      rhythm:        rhythm.result,
      scope:         scope.result,
      communication: communication.result,
      completion:    completion.result,
    },
    axesDetail: { when, rhythm, scope, communication, completion },
    special,
    stats,
  };
}

function buildStats(commits, repos, meta) {
  // 시간대별 커밋 분포 (KST 시간 기준 0~23시)
  const KST_OFFSET = 9 * 60 * 60 * 1000;
  const hourDist = Array(24).fill(0);
  for (const { date } of commits) {
    const h = new Date(new Date(date).getTime() + KST_OFFSET).getUTCHours();
    hourDist[h]++;
  }

  // 요일별 커밋 분포 (KST 기준 0=일 ~ 6=토)
  const weekdayDist = Array(7).fill(0);
  for (const { date } of commits) {
    const d = new Date(new Date(date).getTime() + KST_OFFSET).getUTCDay();
    weekdayDist[d]++;
  }

  const peakHour = hourDist.indexOf(Math.max(...hourDist));

  // 상위 언어
  const langTotals = {};
  for (const repo of repos) {
    for (const [lang, bytes] of Object.entries(repo.languages)) {
      langTotals[lang] = (langTotals[lang] ?? 0) + bytes;
    }
  }
  const grandTotal = Object.values(langTotals).reduce((s, b) => s + b, 0);
  const topLanguages = Object.entries(langTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([name, bytes]) => ({ name, ratio: grandTotal > 0 ? bytes / grandTotal : 0 }));

  return {
    topLanguages,
    peakHour,
    hourDist,
    weekdayDist,
    avgCommitsPerRepo: meta.totalCommits / repos.length,
    totalRepos:    meta.analyzedRepos,
    totalCommits:  meta.totalCommits,
  };
}
