import { analyzeTime } from './axes/when';
import { analyzeRhythm } from './axes/rhythm';
import { analyzeScope } from './axes/scope';
import { analyzeCommunication } from './axes/communication';
import { analyzeCompletion } from './axes/completion';
import { classify } from './classifier';
import { TYPES } from '../types/definitions';

export function analyze(rawData) {
  const { commits, repos, meta } = rawData;

  const time         = analyzeTime(commits);          // when + weekend + hourDist + weekdayDist (단일 패스)
  const rhythm       = analyzeRhythm(commits, repos);
  const scope        = analyzeScope(repos);
  const communication = analyzeCommunication(commits);
  const completion   = analyzeCompletion(repos);

  const special = {
    isOpenSource:  meta.forkRatio >= 0.35,
    isWeekend:     time.isWeekend,
    languageCount: scope.topLanguages?.length ?? 0,
  };

  const typeId = classify(
    {
      when:          time.when,
      rhythm:        rhythm.result,
      scope:         scope.result,
      communication: communication.result,
      completion:    completion.result,
    },
    special
  );

  const type  = TYPES[typeId];
  const stats = buildStats(time, scope, repos, meta);

  return {
    typeId,
    typeName:  type.name,
    emoji:     type.emoji,
    subtitle:  type.subtitle,
    axes: {
      when:          time.when,
      rhythm:        rhythm.result,
      scope:         scope.result,
      communication: communication.result,
      completion:    completion.result,
    },
    stats,
  };
}

// scope.topLanguages 재사용 — 언어 집계 중복 계산 제거
function buildStats(time, scope, repos, meta) {
  const peakHour = time.hourDist.indexOf(Math.max(...time.hourDist));

  return {
    topLanguages:      scope.topLanguages,
    peakHour,
    hourDist:          time.hourDist,
    weekdayDist:       time.weekdayDist,
    avgCommitsPerRepo: meta.totalCommits / repos.length,
    totalRepos:        meta.analyzedRepos,
    totalCommits:      meta.totalCommits,
  };
}
