import TimeDistChart from './charts/TimeDistChart';
import LanguagePieChart from './charts/LanguagePieChart';

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

export default function StatsGrid({ stats }) {
  const { topLanguages, peakHour, hourDist, weekdayDist, avgCommitsPerRepo, totalRepos, totalCommits } = stats;

  const peakLabel = `${String(peakHour).padStart(2, '0')}~${String(peakHour + 1).padStart(2, '0')}시`;
  const peakDayIdx = weekdayDist.indexOf(Math.max(...weekdayDist));
  const maxDay = Math.max(...weekdayDist, 1);

  return (
    <div className="grid grid-cols-2 gap-3 w-full">
      {/* 활동 시간대 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-[--color-text-secondary] mb-1 font-medium">활동 시간대</p>
        <p className="text-lg font-bold text-[--color-text] mb-3">{peakLabel} 집중</p>
        <TimeDistChart hourDist={hourDist} peakHour={peakHour} />
      </div>

      {/* 주력 언어 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-[--color-text-secondary] mb-1 font-medium">주력 언어</p>
        <p className="text-lg font-bold text-[--color-text] mb-3">{topLanguages[0]?.name ?? '-'}</p>
        <LanguagePieChart topLanguages={topLanguages} />
      </div>

      {/* 커밋 요약 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-[--color-text-secondary] mb-1 font-medium">분석 커밋</p>
        <p className="text-lg font-bold text-[--color-text]">{totalCommits.toLocaleString()}개</p>
        <p className="text-xs text-[--color-text-secondary] mt-1">
          {totalRepos}개 레포 · 평균 {Math.round(avgCommitsPerRepo)}개
        </p>
      </div>

      {/* 최다 활동 요일 */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs text-[--color-text-secondary] mb-1 font-medium">가장 바쁜 요일</p>
        <p className="text-lg font-bold text-[--color-text] mb-3">{WEEKDAYS[peakDayIdx]}요일</p>
        <div className="flex items-end gap-0.5 h-10">
          {WEEKDAYS.map((day, i) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-0.5 justify-end">
              <div
                className={`w-full rounded-t transition-all ${i === peakDayIdx ? 'bg-[--color-primary]' : 'bg-[--color-border]'}`}
                style={{ height: `${Math.max(3, (weekdayDist[i] / maxDay) * 28)}px` }}
              />
              <span className="text-[9px] text-[--color-text-secondary]">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
