/**
 * src/App.tsx
 * Main application with routing
 */
import { useCallback, useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './lib/store';
import {
  getAuthStatus,
  getConversations,
  getConversation,
  getIndexSummary,
  login,
  logout,
  setUnauthorizedHandler,
} from './lib/api';
import Sidebar from './components/Sidebar';
import ChatPage from './pages/ChatPage';
import RawFilesPage from './pages/RawFilesPage';
import ReviewPage from './pages/ReviewPage';
import CheckPage from './pages/CheckPage';
import SettingsPage from './pages/SettingsPage';
import RetrievalPage from './pages/RetrievalPage';
import LoginPage from './pages/LoginPage';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { setConversations, setActiveConversation, setMessages, sidebarOpen } = useStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const clearWorkspaceState = useCallback(() => {
    useStore.setState({
      conversations: [],
      activeConversationId: null,
      messages: [],
      detailOpen: false,
      detailContent: null,
      detailConversationId: null,
    });
  }, []);

  const loadInitialData = useCallback(async () => {
    const convs = await getConversations();
    setConversations(convs);
    if (convs.length > 0) {
      setActiveConversation(convs[0].id);
      try {
        const conv = await getConversation(convs[0].id);
        setMessages(conv.messages || []);
      } catch {
        setMessages([]);
      }
    } else {
      setActiveConversation(null);
      setMessages([]);
    }

    getIndexSummary().catch(() => {});
  }, [setActiveConversation, setConversations, setMessages]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthenticated(false);
      clearWorkspaceState();
    });

    return () => setUnauthorizedHandler(null);
  }, [clearWorkspaceState]);

  useEffect(() => {
    let cancelled = false;

    getAuthStatus()
      .then(async (status) => {
        if (cancelled) return;
        setAuthenticated(status.authenticated);
        if (status.authenticated) {
          await loadInitialData();
        }
      })
      .catch(() => {
        if (!cancelled) setAuthenticated(false);
      })
      .finally(() => {
        if (!cancelled) setCheckingAuth(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadInitialData]);

  const handleLogin = async (password: string) => {
    const result = await login(password);
    if (!result.authenticated) {
      throw new Error('访问口令不正确');
    }
    setAuthenticated(true);
    await loadInitialData();
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    setAuthenticated(false);
    clearWorkspaceState();
  };

  if (checkingAuth) {
    return (
      <div className="h-screen bg-gray-950 text-gray-400 flex items-center justify-center">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Sidebar */}
      <div
        className={`transition-all duration-200 flex-shrink-0 ${
          sidebarOpen ? 'w-[280px]' : 'w-0 overflow-hidden'
        }`}
      >
        <Sidebar onLogout={handleLogout} />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/raw" element={<RawFilesPage />} />
          <Route path="/retrieval" element={<RetrievalPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}
