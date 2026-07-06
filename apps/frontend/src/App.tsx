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
import type { AuthRole } from './lib/types';

export default function App() {
  const {
    setConversations,
    setActiveConversation,
    setMessages,
    setCurrentUserRole,
    sidebarOpen,
    setSidebarOpen,
  } = useStore();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  const resetSidebarForViewport = useCallback(() => {
    setSidebarOpen(
      typeof window === 'undefined' || window.matchMedia('(min-width: 768px)').matches
    );
  }, [setSidebarOpen]);

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

  const loadInitialData = useCallback(async (role: AuthRole | undefined) => {
    if (role !== 'admin') {
      setConversations([]);
      setActiveConversation(null);
      setMessages([]);
      getIndexSummary().catch(() => {});
      return;
    }

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
      setCurrentUserRole(null);
      clearWorkspaceState();
    });

    return () => setUnauthorizedHandler(null);
  }, [clearWorkspaceState, setCurrentUserRole]);

  useEffect(() => {
    let cancelled = false;

    getAuthStatus()
      .then(async (status) => {
        if (cancelled) return;
        setAuthenticated(status.authenticated);
        setCurrentUserRole(status.authenticated ? status.role || null : null);
        if (status.authenticated) {
          resetSidebarForViewport();
          await loadInitialData(status.role);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setAuthenticated(false);
          setCurrentUserRole(null);
        }
      })
      .finally(() => {
        if (!cancelled) setCheckingAuth(false);
      });
    return () => {
      cancelled = true;
    };
  }, [loadInitialData, resetSidebarForViewport, setCurrentUserRole]);

  const handleLogin = async (password: string) => {
    const result = await login(password);
    if (!result.authenticated) {
      throw new Error('访问口令不正确');
    }
    setAuthenticated(true);
    setCurrentUserRole(result.role || null);
    resetSidebarForViewport();
    await loadInitialData(result.role);
  };

  const handleLogout = async () => {
    await logout().catch(() => {});
    setAuthenticated(false);
    setCurrentUserRole(null);
    clearWorkspaceState();
  };

  if (checkingAuth) {
    return (
      <div className="h-dvh bg-gray-950 text-gray-400 flex items-center justify-center">
        <Loader2 size={22} className="animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="relative flex h-dvh overflow-hidden bg-gray-950 text-gray-100">
      {/* Sidebar */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="关闭侧边栏"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-40 h-dvh w-[85vw] max-w-[320px] transform transition-transform duration-200 md:relative md:inset-auto md:z-auto md:h-full md:max-w-none md:flex-shrink-0 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0 md:w-[280px]' : '-translate-x-full md:w-0 md:overflow-hidden'
        }`}
      >
        <Sidebar onLogout={handleLogout} />
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Routes>
          <Route path="/" element={<ChatPage />} />
          <Route path="/raw" element={<RawFilesPage />} />
          <Route path="/retrieval" element={<RetrievalPage />} />
          <Route path="/review" element={<ReviewPage />} />
          <Route path="/check" element={<CheckPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </div>
  );
}
