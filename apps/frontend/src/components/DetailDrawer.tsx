/**
 * src/components/DetailDrawer.tsx
 * Right-side detail panel for archive timeline and context info
 */
import { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { getArchive } from '../lib/api';
import ArchiveTimeline from './ArchiveTimeline';
import { X, Loader2 } from 'lucide-react';

export default function DetailDrawer() {
  const { detailOpen, detailContent, detailConversationId, closeDetail, conversations } = useStore();
  const [archiveData, setArchiveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const conv = conversations.find((c) => c.id === detailConversationId);

  useEffect(() => {
    if (detailOpen && detailConversationId) {
      if (detailContent === 'archive') {
        setLoading(true);
        getArchive(detailConversationId)
          .then(setArchiveData)
          .catch(() => setArchiveData(null))
          .finally(() => setLoading(false));
      }
    }
  }, [detailOpen, detailConversationId, detailContent]);

  if (!detailOpen) return null;

  return (
    <div className="drawer-enter fixed inset-0 z-50 h-dvh w-full flex-shrink-0 border-l-0 border-gray-800 bg-gray-950 flex flex-col overflow-hidden md:relative md:inset-auto md:z-auto md:h-full md:w-[380px] md:border-l">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 p-3 border-b border-gray-800">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-200">
            {detailContent === 'archive' ? '归档流程' : '上下文'}
          </h3>
          {conv && (
            <p className="text-xs text-gray-500 truncate md:max-w-[250px]">{conv.title}</p>
          )}
        </div>
        <button onClick={closeDetail} className="flex-shrink-0 p-1 rounded hover:bg-gray-800 text-gray-400">
          <X size={16} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
          </div>
        ) : detailContent === 'archive' ? (
          archiveData ? (
            <ArchiveTimeline archive={archiveData} />
          ) : (
            <div className="text-sm text-gray-500 text-center py-8">
              此对话暂无归档数据。
            </div>
          )
        ) : conv ? (
          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">关联 Wiki 页面</h4>
              {(conv as any).related_wiki_pages?.length > 0 ? (
                <ul className="space-y-1">
                  {(conv as any).related_wiki_pages.map((page: string, i: number) => (
                    <li key={i} className="text-sm text-emerald-300 bg-emerald-600/10 rounded px-2 py-1 break-words">
                      {page}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">无</p>
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">关联 Raw 文件</h4>
              {(conv as any).related_raw_files?.length > 0 ? (
                <ul className="space-y-1">
                  {(conv as any).related_raw_files.map((file: string, i: number) => (
                    <li key={i} className="text-sm text-blue-300 bg-blue-600/10 rounded px-2 py-1 break-words">
                      {file}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">无</p>
              )}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">PDF 引用</h4>
              {(conv as any).related_pdf_pages?.length > 0 ? (
                <ul className="space-y-1">
                  {(conv as any).related_pdf_pages.map((pp: any, i: number) => (
                    <li key={i} className="text-sm text-yellow-300 bg-yellow-600/10 rounded px-2 py-1 break-words">
                      {pp.path} (页码 {pp.pages?.join(', ')})
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">无</p>
              )}
            </div>
            <div className="pt-4 border-t border-gray-800">
              <p className="text-xs text-gray-500">
                更新时间: {conv.updated_at ? new Date(conv.updated_at).toLocaleString('zh-CN') : '-'}
              </p>
              <p className="text-xs text-gray-500">
                状态: {conv.status === 'active' ? '活跃' : '已归档'} {conv.archived ? '(已归档)' : ''}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">未选择对话。</div>
        )}
      </div>
    </div>
  );
}
