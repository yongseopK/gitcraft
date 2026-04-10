import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingScreen from '@/components/home/LoadingScreen';
import TypeCard from '@/components/result/TypeCard';
import StatsGrid from '@/components/result/StatsGrid';
import ShareBar from '@/components/result/ShareBar';

const ERROR_MESSAGES = {
  404: '존재하지 않는 GitHub 유저입니다',
  422: '분석 가능한 공개 데이터가 없습니다',
  429: 'GitHub API 한도 초과, 잠시 후 다시 시도해주세요',
};

export default function ResultPage() {
  const router = useRouter();
  const { username } = router.query;

  const [result, setResult] = useState(null);
  const [error, setError]   = useState(null);

  useEffect(() => {
    if (!username) return;

    const controller = new AbortController();

    fetch(`/api/analyze?username=${username}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) return res.json().then((d) => Promise.reject({ status: res.status, ...d }));
        return res.json();
      })
      .then(setResult)
      .catch((err) => {
        if (err.name === 'AbortError') return; // 언마운트로 인한 취소는 무시
        setError(err);
      });

    return () => controller.abort();
  }, [username]);

  const pageTitle = result
    ? `${result.emoji} ${result.typeName} — @${username} · GitCraft`
    : `@${username} 분석 중 · GitCraft`;

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        {result && (
          <>
            <meta property="og:title" content={`나는 ${result.emoji} ${result.typeName}`} />
            <meta property="og:description" content={result.subtitle} />
            <meta property="og:image" content={`/api/og?username=${username}&typeId=${result.typeId}`} />
            <meta property="og:type" content="website" />
            <meta name="twitter:card" content="summary_large_image" />
          </>
        )}
      </Head>

      <main className="min-h-screen flex flex-col items-center px-4 py-10" style={{ background: '#0D1117' }}>
        <div className="w-full max-w-sm flex flex-col gap-4">
          {/* 헤더 */}
          <div className="flex items-center gap-2 mb-2">
            <button
              onClick={() => router.push('/')}
              className="text-sm transition-colors cursor-pointer" style={{ color: '#7D8590' }}
            >
              ← 홈
            </button>
            <span className="text-sm" style={{ color: '#7D8590' }}>@{username}</span>
          </div>

          {/* 로딩 */}
          {!result && !error && <LoadingScreen username={username ?? ''} />}

          {/* 에러 */}
          {error && (
            <div className="rounded-2xl p-8 text-center" style={{ background: '#161B22', border: '1px solid #30363D' }}>
              <p className="text-3xl mb-3">😵</p>
              <p className="font-semibold mb-1" style={{ color: '#E6EDF3' }}>분석 실패</p>
              <p className="text-sm" style={{ color: '#7D8590' }}>
                {ERROR_MESSAGES[error.status] ?? error.error ?? '오류가 발생했습니다'}
              </p>
              <button
                onClick={() => router.push('/')}
                className="mt-5 text-sm font-semibold cursor-pointer"
                style={{ color: '#58A6FF' }}
              >
                다시 시도하기
              </button>
            </div>
          )}

          {/* 결과 */}
          {result && (
            <>
              <TypeCard
                emoji={result.emoji}
                typeName={result.typeName}
                subtitle={result.subtitle}
                axes={result.axes}
              />
              <StatsGrid stats={result.stats} />
              <ShareBar
                username={username}
                typeId={result.typeId}
                typeName={result.typeName}
                emoji={result.emoji}
                subtitle={result.subtitle}
              />
              <button
                onClick={() => router.push('/')}
                className="text-sm text-center py-2 cursor-pointer transition-colors"
                style={{ color: '#7D8590' }}
              >
                친구 GitHub도 분석하기 →
              </button>
            </>
          )}
        </div>
      </main>
    </>
  );
}
