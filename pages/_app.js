import '@/styles/globals.css';
import { useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.Kakao || window.Kakao.isInitialized()) return;
    const key = process.env.NEXT_PUBLIC_KAKAO_KEY;
    if (key) window.Kakao.init(key);
  }, []);

  return (
    <>
      <Component {...pageProps} />
      <Analytics />
    </>
  );
}
