import { useState } from 'react';
import { useRouter } from 'next/router';

export default function UsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const clean = username.trim();
    if (!clean) return;

    if (!/^[a-zA-Z0-9-]{1,39}$/.test(clean)) {
      setError('올바른 GitHub 유저네임을 입력해주세요');
      return;
    }

    setError('');
    router.push(`/result/${clean}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <div className={`flex items-center bg-white border rounded-xl px-4 transition-colors ${error ? 'border-red-400' : 'border-[--color-border] focus-within:border-[--color-primary]'}`}>
        <span className="text-sm text-[--color-text-secondary] whitespace-nowrap select-none">
          github.com/
        </span>
        <input
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(''); }}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          className="flex-1 py-3.5 pl-1 text-sm bg-transparent outline-none text-[--color-text] placeholder:text-[--color-text-secondary]"
        />
      </div>

      {error && <p className="text-xs text-red-500 pl-1">{error}</p>}

      <button
        type="submit"
        disabled={!username.trim()}
        className="py-3.5 bg-[--color-primary] text-white rounded-xl text-base font-semibold transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-default cursor-pointer"
      >
        내 개발자 유형 분석하기
      </button>
    </form>
  );
}
