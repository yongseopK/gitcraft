import { useState } from 'react';

export default function ShareBar({ username, typeName, emoji, typeId, subtitle }) {
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/result/${username}`
    : '';

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleKakao() {
    if (!window.Kakao?.isInitialized()) return;
    window.Kakao.Share.sendDefault({
      objectType: 'feed',
      content: {
        title: `나는 ${emoji} ${typeName}`,
        description: 'GitHub 커밋이 증명하는 나의 개발자 유형',
        imageUrl: `${window.location.origin}/api/og?username=${username}&typeId=${typeId}`,
        link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
      },
      buttons: [{ title: '내 유형 알아보기', link: { mobileWebUrl: shareUrl, webUrl: shareUrl } }],
    });
  }

  return (
    <div className="flex flex-col gap-2 w-full">
      <button
        onClick={handleKakao}
        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer hover:opacity-90 transition-opacity"
        style={{ background: '#FEE500', color: '#191919' }}
      >
        <span>카카오톡으로 공유하기</span>
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm cursor-pointer transition-colors"
        style={{ background: '#21262D', border: '1px solid #30363D', color: '#E6EDF3' }}
      >
        {copied ? '✓ 링크 복사됨' : '🔗 링크 복사'}
      </button>
    </div>
  );
}
