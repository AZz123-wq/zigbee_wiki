/**
 * src/components/ConversationList.tsx
 * Conversation list with right-click context menu
 */
import { useState, useRef, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { deleteConversation, updateConversation, getConversation } from '../lib/api';
import ContextMenu from './ContextMenu';
import { MessageSquare, Archive, FileText, FileQuestion, Loader2 } from 'lucide-react';

export default function ConversationList() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    conversations,
    activeConversationId,
    setActiveConversation,
    removeConversation,
    updateConversation: updateStoreConv,
    setMessages,
  } = useStore();

  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    convId: string;
  } | null>(null);

  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const [loadingConvId, setLoadingConvId] = useState<string | null>(null);
  const pendingRequestRef = useRef(0);

  const handleSelect = async (id: string) => {
    if (id === activeConversationId) {
      // If already active, just navigate to chat if not there
      if (location.pathname !== '/') navigate('/');
      return;
    }

    // Navigate to chat page if not there
    if (location.pathname !== '/') navigate('/');

    const requestId = ++pendingRequestRef.current;
    setActiveConversation(id);
    setLoadingConvId(id);

    try {
      const conv = await getConversation(id);
      // Only apply result if this is still the latest request
      if (requestId === pendingRequestRef.current) {
        setMessages(conv.messages || []);
      }
    } catch {
      // On error, don't clear existing messages if this is the already-active conversation
      if (requestId === pendingRequestRef.current) {
        const store = useStore.getState();
        if (store.activeConversationId !== id) {
          setMessages([]);
        }
        // If this IS the active conversation, keep existing messages
      }
    } finally {
      if (requestId === pendingRequestRef.current) {
        setLoadingConvId(null);
      }
    }
  };

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, convId: string) => {
      e.preventDefault();
      setContextMenu({ x: e.clientX, y: e.clientY, convId });
    },
    []
  );

  const handleDelete = async (convId: string) => {
    try {
      await deleteConversation(convId);
      removeConversation(convId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  const handleRename = async (convId: string) => {
    if (!renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    try {
      await updateConversation(convId, { title: renameValue });
      updateStoreConv(convId, { title: renameValue });
    } catch (err) {
      console.error('Rename failed:', err);
    }
    setRenamingId(null);
    setRenameValue('');
  };

  const startRename = (convId: string, title: string) => {
    setRenamingId(convId);
    setRenameValue(title);
    setContextMenu(null);
  };

  return (
    <div className="space-y-0.5">
      {conversations.length === 0 && (
        <div className="text-center text-gray-500 text-sm py-8">
          暂无对话。
          <br />
          点击"新建对话"开始。
        </div>
      )}

      {conversations.map((conv) => (
        <div
          key={conv.id}
          onClick={() => handleSelect(conv.id)}
          onContextMenu={(e) => handleContextMenu(e, conv.id)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSelect(conv.id);
          }}
          aria-current={conv.id === activeConversationId ? 'true' : undefined}
          className={`group flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
            conv.id === activeConversationId
              ? 'bg-sidebar-active text-white'
              : 'text-gray-300 hover:bg-sidebar-hover'
          }`}
        >
          {loadingConvId === conv.id ? (
            <Loader2 size={14} className="flex-shrink-0 text-gray-400 animate-spin" />
          ) : (
            <MessageSquare size={14} className="flex-shrink-0 text-gray-500" />
          )}
          {renamingId === conv.id ? (
            <input
              autoFocus
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onBlur={() => handleRename(conv.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(conv.id);
                if (e.key === 'Escape') setRenamingId(null);
              }}
              className="flex-1 bg-gray-700 text-sm px-1 py-0.5 rounded outline-none"
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <span className="truncate block">{conv.title}</span>
              <span className="text-[10px] text-gray-500">
                {new Date(conv.updated_at).toLocaleDateString('zh-CN', {
                  month: '2-digit',
                  day: '2-digit',
                })}{' '}
                {new Date(conv.updated_at).toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Status indicators */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            {conv.has_raw && <span title="有关联 raw 文件"><FileText size={12} className="text-blue-400" /></span>}
            {conv.has_pdf && <span title="有关联 PDF"><FileQuestion size={12} className="text-yellow-400" /></span>}
            {conv.has_wiki_update && (
              <span title="有 Wiki 更新建议"><FileText size={12} className="text-green-400" /></span>
            )}
            {conv.archived && <span title="已归档"><Archive size={12} className="text-purple-400" /></span>}
          </div>
        </div>
      ))}

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          convId={contextMenu.convId}
          onClose={() => setContextMenu(null)}
          onDelete={handleDelete}
          onRename={startRename}
        />
      )}
    </div>
  );
}
