/**
 * src/components/ArchiveTimeline.tsx
 * 7-step timeline stepper for conversation archive process
 */
import { useState } from 'react';
import { generatePrompt } from '../lib/api';
import {
  MessageSquare,
  Search,
  Brain,
  FileEdit,
  ShieldCheck,
  Save,
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
  XCircle,
  Copy,
} from 'lucide-react';

interface Props {
  archive: any;
}

const stepConfig: Record<string, { icon: typeof CheckCircle2; label: string }> = {
  user_input: { icon: MessageSquare, label: '用户输入' },
  context_selection: { icon: Search, label: '上下文选择' },
  model_analysis: { icon: Brain, label: '模型分析' },
  wiki_update_proposal: { icon: FileEdit, label: 'Wiki 更新建议' },
  review_status: { icon: ShieldCheck, label: '审查状态' },
  writeback_status: { icon: Save, label: '写回状态' },
  followup_tasks: { icon: ListChecks, label: '后续任务' },
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 size={16} className="text-emerald-400" />;
    case 'in_progress':
      return <Clock size={16} className="text-blue-400" />;
    case 'error':
      return <XCircle size={16} className="text-red-400" />;
    default:
      return <Circle size={16} className="text-gray-600" />;
  }
};

export default function ArchiveTimeline({ archive }: Props) {
  const [copied, setCopied] = useState(false);

  if (!archive.steps || archive.steps.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-8">
        此对话暂无步骤数据。
      </div>
    );
  }

  const handleCopyPrompt = async () => {
    try {
      const result = await generatePrompt({ conversation_id: archive.conversation_id });
      await navigator.clipboard.writeText(result.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  return (
    <div className="min-w-0 space-y-0">
      {archive.steps.map((step: any) => {
        const config = stepConfig[step.type] || { icon: Circle, label: step.title };
        return (
          <div key={step.id} className="timeline-step relative min-w-0 pl-8 pb-5">
            {/* Dot */}
            <div className="absolute left-0 top-0.5">{statusIcon(step.status)}</div>

            {/* Content */}
            <div className="min-w-0">
              <h4 className="text-sm font-medium text-gray-200">{config.label}</h4>
              <p className="text-xs text-gray-400 mt-0.5 break-words">{step.summary}</p>

              {/* Expandable details */}
              {step.details && Object.keys(step.details).length > 0 && (
                <details className="mt-1.5">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">
                    查看详情
                  </summary>
                  <pre className="mt-1 text-xs text-gray-400 bg-gray-800/50 rounded p-2 overflow-x-auto max-h-32">
                    {JSON.stringify(step.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        );
      })}

      {/* Actions */}
      <div className="pt-3 border-t border-gray-800 flex flex-col gap-2">
        <button
          onClick={handleCopyPrompt}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 text-sm transition-colors"
        >
          <Copy size={14} />
          {copied ? '已复制!' : '复制 Claude Code 提示词'}
        </button>
        <p className="text-[10px] text-gray-600 text-center">
          第一版: 写回 Wiki 需人工确认。
        </p>
      </div>
    </div>
  );
}
