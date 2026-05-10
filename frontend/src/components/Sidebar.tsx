/**
 * src/components/Sidebar.tsx
 * Left sidebar with conversations, navigation, and actions
 */
import { useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../lib/store';
import { createConversation } from '../lib/api';
import ConversationList from './ConversationList';
import {
  MessageSquarePlus,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  Settings,
  PanelLeftClose,
  Database,
} from 'lucide-react';

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toggleSidebar, setMessages } = useStore();

  const handleNewChat = async () => {
    try {
      const conv = await createConversation();
      useStore.getState().addConversation(conv);
      setMessages([]);
      navigate('/');
    } catch (err) {
      console.error('创建对话失败:', err);
    }
  };

  const navItems = [
    { icon: FileText, label: 'Raw 文件', path: '/raw' },
    { icon: Database, label: '检索记录', path: '/retrieval' },
    { icon: ClipboardCheck, label: '审查队列', path: '/review' },
    { icon: ShieldCheck, label: '检查 Wiki', path: '/check' },
  ];

  return (
    <div className="h-full flex flex-col bg-sidebar border-r border-gray-800">
      {/* Header */}
      <div className="p-3 flex items-center justify-between border-b border-gray-800">
        <span className="text-sm font-semibold text-gray-300">Wiki Chat</span>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded hover:bg-sidebar-hover text-gray-400"
          title="关闭侧边栏"
        >
          <PanelLeftClose size={16} />
        </button>
      </div>

      {/* New Chat Button */}
      <div className="p-2">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-700 hover:bg-sidebar-hover text-sm text-gray-300 transition-colors"
        >
          <MessageSquarePlus size={16} />
          新建对话
        </button>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto px-2">
        <ConversationList />
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-800 p-2 flex flex-col gap-0.5">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
              location.pathname === item.path
                ? 'bg-sidebar-active text-white'
                : 'text-gray-400 hover:bg-sidebar-hover hover:text-gray-200'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Settings */}
      <div className="border-t border-gray-800 p-2">
        <button
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            location.pathname === '/settings'
              ? 'bg-sidebar-active text-white'
              : 'text-gray-400 hover:bg-sidebar-hover hover:text-gray-200'
          }`}
        >
          <Settings size={16} />
          设置
        </button>
      </div>
    </div>
  );
}
