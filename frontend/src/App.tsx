/**
 * src/App.tsx
 * Main application with routing
 */
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './lib/store';
import { getConversations, getConversation, getIndexSummary } from './lib/api';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import RawFilesPage from './pages/RawFilesPage';
import ReviewPage from './pages/ReviewPage';
import CheckPage from './pages/CheckPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  const { setConversations, setActiveConversation, setMessages, sidebarOpen } = useStore();

  useEffect(() => {
    // Load initial data
    getConversations()
      .then(async (convs) => {
        setConversations(convs);
        if (convs.length > 0) {
          setActiveConversation(convs[0].id);
          // Also fetch messages for the first conversation
          try {
            const conv = await getConversation(convs[0].id);
            setMessages(conv.messages || []);
          } catch {
            setMessages([]);
          }
        }
      })
      .catch(() => {});

    getIndexSummary().catch(() => {});
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-all duration-200 flex-shrink-0 ${
          sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'
        }`}
      >
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/raw" element={<RawFilesPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
