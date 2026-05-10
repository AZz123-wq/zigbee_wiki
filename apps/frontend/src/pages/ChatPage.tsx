/**
 * src/pages/ChatPage.tsx
 * Main chat page: ChatWindow + ChatInput + DetailDrawer
 */
import { useStore } from '../lib/store';
import ChatWindow from '../components/ChatWindow';
import ChatInput from '../components/ChatInput';
import DetailDrawer from '../components/DetailDrawer';
import { PanelLeft } from 'lucide-react';

export default function ChatPage() {
  const { sidebarOpen, toggleSidebar, detailOpen } = useStore();

  return (
    <div className="flex h-full">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile sidebar toggle) */}
        <div className="border-b border-gray-800 px-4 py-2 flex items-center justify-between flex-shrink-0">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded hover:bg-gray-800 text-gray-400"
          >
            <PanelLeft size={16} />
          </button>
          <span className="text-xs text-gray-500">Wiki Chat Workbench</span>
          <div className="w-6" />
        </div>

        {/* Messages */}
        <ChatWindow />

        {/* Input */}
        <ChatInput />
      </div>

      {/* Detail Drawer */}
      {detailOpen && <DetailDrawer />}
    </div>
  );
}
