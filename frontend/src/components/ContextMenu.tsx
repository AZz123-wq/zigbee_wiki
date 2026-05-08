/**
 * src/components/ContextMenu.tsx
 * Right-click context menu for conversation history items
 */
import { useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { generatePrompt, updateConversation as updateConvApi } from '../lib/api';
import {
  MessageSquare,
  Pencil,
  Archive,
  FileText,
  BookOpen,
  Copy,
  BookmarkCheck,
  Trash2,
} from 'lucide-react';

interface Props {
  x: number;
  y: number;
  convId: string;
  onClose: () => void;
  onDelete: (id: string) => void;
  onRename: (id: string, title: string) => void;
}

export default function ContextMenu({ x, y, convId, onClose, onDelete, onRename }: Props) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { conversations, setActiveConversation, openDetail } = useStore();

  const conv = conversations.find((c) => c.id === convId);

  useEffect(() => {
    const handleOutside = (e: Event) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleCopyPrompt = async () => {
    try {
      const result = await generatePrompt({ conversation_id: convId });
      await navigator.clipboard.writeText(result.prompt);
    } catch (err) {
      console.error('Copy prompt failed:', err);
    }
    onClose();
  };

  const items = [
    {
      icon: MessageSquare,
      label: '打开对话',
      action: () => {
        setActiveConversation(convId);
        onClose();
      },
    },
    {
      icon: Pencil,
      label: '重命名',
      action: () => {
        const title = conv?.title || '未命名';
        onRename(convId, title);
      },
    },
    { type: 'divider' as const },
    {
      icon: Archive,
      label: '查看归档流程',
      action: () => {
        openDetail('archive', convId);
        onClose();
      },
    },
    {
      icon: FileText,
      label: '查看关联 Raw 文件',
      action: () => {
        openDetail('context', convId);
        onClose();
      },
    },
    {
      icon: BookOpen,
      label: '查看关联 Wiki 页面',
      action: () => {
        openDetail('context', convId);
        onClose();
      },
    },
    { type: 'divider' as const },
    {
      icon: Copy,
      label: '复制 Claude Code 提示词',
      action: handleCopyPrompt,
    },
    {
      icon: BookmarkCheck,
      label: '标记为已归档',
      action: async () => {
        try {
          await updateConvApi(convId, { archived: true });
          useStore.getState().updateConversation(convId, { archived: true });
        } catch {}
        onClose();
      },
    },
    { type: 'divider' as const },
    {
      icon: Trash2,
      label: '删除',
      action: () => onDelete(convId),
      danger: true,
    },
  ];

  // Calculate safe position
  const menuWidth = 200;
  const menuHeight = 380;
  const safeX = Math.min(x, window.innerWidth - menuWidth - 10);
  const safeY = Math.min(y, window.innerHeight - menuHeight - 10);

  return (
    <div
      ref={menuRef}
      role="menu"
      className="context-menu fixed z-50 min-w-[200px] max-h-[380px] overflow-y-auto bg-gray-800 border border-gray-700 rounded-lg shadow-xl py-1"
      style={{ left: Math.max(0, safeX), top: Math.max(0, safeY) }}
    >
      {items.map((item, i) => {
        if (item.type === 'divider') {
          return <div key={i} className="border-t border-gray-700 my-1" />;
        }
        return (
          <button
            key={i}
            role="menuitem"
            onClick={item.action}
            className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm transition-colors ${
              item.danger
                ? 'text-red-400 hover:bg-red-900/30'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <item.icon size={14} />
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
