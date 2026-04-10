import Head from 'next/head';
import UsernameForm from '@/components/home/UsernameForm';

export default function Home() {
  return (
    <>
      <Head>
        <title>GitCraft — 코드가 증명하는 나의 개발자 유형</title>
        <meta name="description" content="GitHub 커밋 데이터로 당신의 개발자 유형을 분석합니다" />
      </Head>

      <main className="min-h-screen bg-[--color-bg] flex flex-col items-center justify-center px-4">
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          {/* 로고 */}
          <div className="text-center">
            <p className="text-4xl mb-3">⚒️</p>
            <h1 className="text-2xl font-bold text-[--color-text]">GitCraft</h1>
            <p className="text-sm text-[--color-text-secondary] mt-2 leading-relaxed">
              설문 말고, 커밋으로 증명하는<br />나의 개발자 유형
            </p>
          </div>

          <UsernameForm />

          <p className="text-xs text-[--color-text-secondary] text-center">
            GitHub 공개 데이터만 사용 · 로그인 불필요
          </p>
        </div>
      </main>
    </>
  );
}
