/**
 * src/pages/ReviewPage.tsx
 * Review Queue page for wiki update proposals
 */
import { useState, useEffect } from 'react';
import { getReviews, updateReview, generatePrompt } from '../lib/api';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Copy,
  FileEdit,
  AlertTriangle,
} from 'lucide-react';

const typeLabels: Record<string, string> = {
  create_page: '新建页面',
  update_page: '更新页面',
  add_source_reference: '添加来源引用',
  add_wikilink: '添加 Wikilink',
  fix_broken_link: '修复断链',
  merge_duplicate: '合并重复',
  mark_reviewed: '标记已审查',
  improve_summary: '改进摘要',
  split_page: '拆分页面',
};

const severityColors: Record<string, string> = {
  low: 'bg-blue-600/20 text-blue-300',
  medium: 'bg-yellow-600/20 text-yellow-300',
  high: 'bg-orange-600/20 text-orange-300',
  critical: 'bg-red-600/20 text-red-300',
};

const statusIcons: Record<string, typeof Clock> = {
  pending: Clock,
  approved: CheckCircle2,
  rejected: XCircle,
  applied: CheckCircle2,
  failed: AlertTriangle,
  archived: Clock,
};

export default function ReviewPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await getReviews();
      setItems(data);
    } catch (err) {
      console.error('Failed to load reviews:', err);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateReview(id, { status });
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status } : item))
      );
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleCopyPrompt = async (convId: string) => {
    try {
      const result = await generatePrompt({ conversation_id: convId });
      await navigator.clipboard.writeText(result.prompt);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-3">
        <h2 className="text-sm font-semibold flex items-center gap-2">
          <ClipboardCheck size={16} className="text-blue-400" />
          审查队列
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {items.length} 个待审查项
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-500 border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <ClipboardCheck size={32} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">暂无审查项</p>
            <p className="text-xs mt-1">
              发起对话后可生成 Wiki 更新建议。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const StatusIcon = statusIcons[item.status] || Clock;
              return (
                <div
                  key={item.id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${severityColors[item.severity] || severityColors.low}`}>
                          {typeLabels[item.type] || item.type}
                        </span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                          item.severity === 'high' || item.severity === 'critical'
                            ? 'bg-red-600/20 text-red-300'
                            : 'bg-gray-600/20 text-gray-300'
                        }`}>
                          {item.severity}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-500">
                          <StatusIcon size={10} />
                          {item.status}
                        </span>
                      </div>
                      <p className="text-sm mt-1.5">{item.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{item.summary}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.related_raw_files?.map((f: string, i: number) => (
                          <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/10 text-blue-300">
                            {f}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-gray-500">
                          From: {item.source_conversation_id?.slice(0, 8)}...
                        </span>
                        <span className="text-[10px] text-gray-500">
                          → {item.target_page || '-'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 flex-shrink-0">
                      {item.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(item.id, 'approved')}
                            className="p-1 rounded hover:bg-emerald-600/20 text-gray-400 hover:text-emerald-400 transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 size={14} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(item.id, 'rejected')}
                            className="p-1 rounded hover:bg-red-600/20 text-gray-400 hover:text-red-400 transition-colors"
                            title="Reject"
                          >
                            <XCircle size={14} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleCopyPrompt(item.source_conversation_id)}
                        className="p-1 rounded hover:bg-blue-600/20 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Copy Claude Code Prompt"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Suggested patch preview */}
                  {item.suggested_patch && (
                    <details className="mt-2">
                      <summary className="text-[10px] text-gray-500 cursor-pointer hover:text-gray-300">
                        查看补丁草案
                      </summary>
                      <pre className="mt-1 text-[10px] text-gray-300 bg-gray-900 rounded p-2 overflow-x-auto max-h-32">
                        {item.suggested_patch}
                      </pre>
                    </details>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
