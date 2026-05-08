/**
 * src/pages/CheckPage.tsx
 * Wiki health check page with results and Claude Code prompt generation
 */
import { useState, useEffect } from 'react';
import { runCheck, getLatestCheck, generatePrompt } from '../lib/api';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  Info,
  Copy,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import type { CheckResult } from '../lib/types';

const severityIcons: Record<string, typeof ShieldCheck> = {
  critical: AlertTriangle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const severityColors: Record<string, string> = {
  critical: 'text-red-400',
  error: 'text-red-400',
  warning: 'text-yellow-400',
  info: 'text-blue-400',
};

const severityLabels: Record<string, string> = {
  critical: '严重',
  error: '错误',
  warning: '警告',
  info: '建议',
};

export default function CheckPage() {
  const [result, setResult] = useState<CheckResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadLatest();
  }, []);

  const loadLatest = async () => {
    setLoading(true);
    try {
      const data = await getLatestCheck();
      setResult(data);
    } catch {
      setResult(null);
    }
    setLoading(false);
  };

  const handleCheck = async () => {
    setChecking(true);
    try {
      const data = await runCheck();
      setResult(data);
    } catch (err: any) {
      console.error('检查失败:', err);
    }
    setChecking(false);
  };

  const handleCopyPrompt = async () => {
    if (!result) return;
    try {
      const prompt = await generatePrompt({
        check_issues: result.issues,
      });
      await navigator.clipboard.writeText(prompt.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-emerald-400" />
          <div>
            <h2 className="text-sm font-semibold text-gray-200">Wiki 健康检查</h2>
            <p className="text-xs text-gray-500">
              {result ? `上次检查: ${new Date(result.created_at).toLocaleString('zh-CN')}` : '尚未检查'}
            </p>
          </div>
        </div>
        <button
          onClick={handleCheck}
          disabled={checking}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs hover:bg-emerald-500 disabled:opacity-50 transition-colors"
        >
          <RefreshCw size={14} className={checking ? 'animate-spin' : ''} />
          {checking ? '检查中...' : '执行检查'}
        </button>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent" />
          </div>
        ) : !result ? (
          <div className="text-center py-12 text-gray-500">
            <ShieldCheck size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">暂无检查结果</p>
            <p className="text-xs mt-1">点击"执行检查"分析 Wiki 健康状态。</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {/* Score card */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className={`text-4xl font-bold ${getScoreColor(result.health_score)}`}>
                  {result.health_score}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-200">健康评分</p>
                  <p className="text-xs text-gray-400">{result.summary}</p>
                </div>
              </div>
              <div className="flex gap-3 mt-3">
                <span className="text-xs bg-red-600/20 text-red-300 px-2 py-0.5 rounded">
                  {result.critical + result.errors} 个错误
                </span>
                <span className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-0.5 rounded">
                  {result.warnings} 个警告
                </span>
                <span className="text-xs bg-blue-600/20 text-blue-300 px-2 py-0.5 rounded">
                  {result.suggestions} 个建议
                </span>
              </div>
            </div>

            {/* Copy prompt button */}
            <div className="flex justify-end">
              <button
                onClick={handleCopyPrompt}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-300 text-xs hover:bg-blue-600/30 transition-colors"
              >
                <Copy size={12} />
                {copied ? '已复制!' : '复制 Claude Code 修复提示词'}
              </button>
            </div>

            {/* Issues list */}
            <div className="space-y-2">
              {result.issues.map((issue) => {
                const Icon = severityIcons[issue.severity] || Info;
                const sevLabel = severityLabels[issue.severity] || issue.severity;
                return (
                  <div
                    key={issue.id}
                    className="bg-gray-800/30 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600/50 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Icon size={14} className={`mt-0.5 flex-shrink-0 ${severityColors[issue.severity]}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-200">{issue.title}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityColors[issue.severity]} bg-opacity-10 bg-current`}>
                            {sevLabel}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">{issue.message}</p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          文件: <code className="text-gray-400">{issue.file}</code>
                        </p>
                        {issue.suggestion && (
                          <p className="text-[10px] text-blue-300 mt-1">
                            修复建议: {issue.suggestion}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
