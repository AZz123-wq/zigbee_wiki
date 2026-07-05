import { FormEvent, useState } from 'react';
import { Loader2, LockKeyhole, LogIn } from 'lucide-react';

interface Props {
  onLogin: (password: string) => Promise<void>;
}

export default function LoginPage({ onLogin }: Props) {
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const value = password.trim();
    if (!value || submitting) return;

    setSubmitting(true);
    setError('');
    try {
      await onLogin(value);
      setPassword('');
    } catch (err: any) {
      setError(err.message || '访问口令不正确');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm border border-gray-800 bg-gray-900/80 rounded-lg p-5 shadow-2xl shadow-black/30"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="h-9 w-9 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
            <LockKeyhole size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-white">Wiki Chat</h1>
            <p className="text-xs text-gray-500">输入访问口令</p>
          </div>
        </div>

        <label className="block text-xs text-gray-400 mb-1.5" htmlFor="access-password">
          访问口令
        </label>
        <input
          id="access-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          autoComplete="current-password"
          className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />

        {error && (
          <div className="mt-3 text-xs text-red-300 bg-red-950/40 border border-red-900 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !password.trim()}
          className="mt-4 w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 size={16} className="animate-spin" /> : <LogIn size={16} />}
          登录
        </button>
      </form>
    </div>
  );
}
