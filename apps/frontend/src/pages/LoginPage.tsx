import { FormEvent, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Clipboard,
  KeyRound,
  Loader2,
  LockKeyhole,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { registerAccess } from '../lib/api';

interface Props {
  onLogin: (password: string) => Promise<void>;
}

type Mode = 'login' | 'register' | 'success';

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>('login');
  const [password, setPassword] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [registering, setRegistering] = useState(false);
  const [error, setError] = useState('');
  const [dialogError, setDialogError] = useState('');
  const [copied, setCopied] = useState(false);

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

  const handleRegister = async (event: FormEvent) => {
    event.preventDefault();
    const value = apiKey.trim();
    if (!value || registering) return;

    setRegistering(true);
    setDialogError('');
    try {
      const result = await registerAccess(value);
      setGeneratedPassword(result.password);
      setPassword(result.password);
      setApiKey('');
      setCopied(false);
      setMode('success');
    } catch (err: any) {
      setDialogError(err.message || '注册失败，请检查 DeepSeek API Key');
    } finally {
      setRegistering(false);
    }
  };

  const handleCopy = async () => {
    if (!generatedPassword) return;
    try {
      await navigator.clipboard.writeText(generatedPassword);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setDialogError('复制失败，请手动复制口令');
    }
  };

  const returnToLogin = () => {
    setMode('login');
    setError('');
    setDialogError('');
  };

  const renderHeader = (subtitle: string, icon: 'lock' | 'key' | 'check') => (
    <div className="flex items-center gap-3 mb-5">
      <div className="h-9 w-9 rounded-lg bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
        {icon === 'lock' && <LockKeyhole size={18} />}
        {icon === 'key' && <KeyRound size={18} />}
        {icon === 'check' && <Check size={18} />}
      </div>
      <div>
        <h1 className="text-base font-semibold text-white">Wiki Chat</h1>
        <p className="text-xs text-gray-500">{subtitle}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex items-center justify-center px-4">
      {mode === 'login' && (
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm border border-gray-800 bg-gray-900/80 rounded-lg p-5 shadow-2xl shadow-black/30"
        >
          {renderHeader('输入访问口令', 'lock')}

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
          <div className="mt-2 flex justify-start">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className="text-xs text-blue-300 hover:text-blue-200 transition-colors flex items-center gap-1"
            >
              <UserPlus size={13} />
              注册
            </button>
          </div>

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
      )}

      {mode === 'register' && (
        <form
          onSubmit={handleRegister}
          className="w-full max-w-sm border border-gray-800 bg-gray-900/80 rounded-lg p-5 shadow-2xl shadow-black/30"
        >
          {renderHeader('注册访问口令', 'key')}

          <label className="block text-xs text-gray-400 mb-1.5" htmlFor="deepseek-api-key">
            DeepSeek API Key
          </label>
          <input
            id="deepseek-api-key"
            type="password"
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            autoFocus
            autoComplete="off"
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />

          <div className="mt-4 grid grid-cols-[auto_1fr] gap-2">
            <button
              type="button"
              onClick={returnToLogin}
              disabled={registering}
              className="h-9 px-3 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-gray-800 disabled:opacity-60 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft size={16} />
              返回
            </button>
            <button
              type="submit"
              disabled={registering || !apiKey.trim()}
              className="h-9 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-400 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
            >
              {registering ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
              注册
            </button>
          </div>
        </form>
      )}

      {mode === 'success' && (
        <div className="w-full max-w-sm border border-gray-800 bg-gray-900/80 rounded-lg p-5 shadow-2xl shadow-black/30">
          {renderHeader('注册成功', 'check')}

          <label className="block text-xs text-gray-400 mb-1.5" htmlFor="generated-password">
            生成的访问口令
          </label>
          <div className="flex gap-2">
            <input
              id="generated-password"
              type="text"
              readOnly
              value={generatedPassword}
              className="min-w-0 flex-1 bg-gray-950 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="h-9 w-10 rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors flex items-center justify-center"
              title="复制口令"
            >
              {copied ? <Check size={16} /> : <Clipboard size={16} />}
            </button>
          </div>

          <button
            type="button"
            onClick={returnToLogin}
            className="mt-4 w-full h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
          >
            <Check size={16} />
            注册成功，返回登录
          </button>
        </div>
      )}

      {dialogError && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div
            role="alertdialog"
            aria-modal="true"
            className="w-full max-w-sm border border-red-900 bg-gray-900 rounded-lg p-5 shadow-2xl shadow-black/40"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-red-600/15 border border-red-500/30 flex items-center justify-center text-red-300">
                <AlertTriangle size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">注册失败</h2>
                <p className="mt-1 text-xs text-red-200">{dialogError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDialogError('')}
              className="mt-4 w-full h-9 rounded-lg bg-red-600 hover:bg-red-500 text-sm font-medium text-white transition-colors"
            >
              知道了
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
