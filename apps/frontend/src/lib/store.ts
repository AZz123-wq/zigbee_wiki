/**
 * src/lib/store.ts
 * Zustand store for app state management
 */
import { create } from 'zustand';
import type { AuthRole, Conversation, Message, CheckResult } from './types';

interface AppState {
  // Auth
  currentUserRole: AuthRole | null;
  setCurrentUserRole: (role: AuthRole | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Detail drawer
  detailOpen: boolean;
  detailContent: 'archive' | 'context' | null;
  detailConversationId: string | null;
  openDetail: (content: 'archive' | 'context', convId: string) => void;
  closeDetail: () => void;

  // Conversations
  conversations: Conversation[];
  activeConversationId: string | null;
  setConversations: (convs: Conversation[]) => void;
  setActiveConversation: (id: string | null) => void;
  addConversation: (conv: Conversation) => void;
  startTransientConversation: (title?: string) => Conversation;
  removeConversation: (id: string) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;

  // Messages
  messages: Message[];
  setMessages: (msgs: Message[]) => void;
  addMessage: (msg: Message) => void;

  // Loading
  loading: boolean;
  setLoading: (v: boolean) => void;

  // Check
  checkResult: CheckResult | null;
  setCheckResult: (r: CheckResult | null) => void;

  // Context
  selectedWikiPages: string[];
  selectedRawFiles: string[];
  selectedPdfPages: { path: string; pages: number[] }[];
  setSelectedWikiPages: (pages: string[]) => void;
  setSelectedRawFiles: (files: string[]) => void;
  setSelectedPdfPages: (pdfs: { path: string; pages: number[] }[]) => void;
  clearContext: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentUserRole: null,
  setCurrentUserRole: (role) => set({ currentUserRole: role }),

  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),

  detailOpen: false,
  detailContent: null,
  detailConversationId: null,
  openDetail: (content, convId) =>
    set({ detailOpen: true, detailContent: content, detailConversationId: convId }),
  closeDetail: () => set({ detailOpen: false }),

  conversations: [],
  activeConversationId: null,
  setConversations: (convs) => set({ conversations: convs }),
  setActiveConversation: (id) => set({ activeConversationId: id }),
  addConversation: (conv) =>
    set((s) => ({ conversations: [conv, ...s.conversations], activeConversationId: conv.id })),
  startTransientConversation: (title = 'New Chat') => {
    const now = new Date().toISOString();
    const id = `transient-${crypto.randomUUID?.() || Date.now()}`;
    const conv: Conversation = {
      id,
      title,
      created_at: now,
      updated_at: now,
      status: 'active',
      message_count: 0,
      has_raw: false,
      has_pdf: false,
      has_wiki_update: false,
      archived: false,
      related_raw_files: [],
      related_wiki_pages: [],
      related_pdf_pages: [],
      last_summary: '',
      transient: true,
    };
    set({ conversations: [conv], activeConversationId: conv.id, messages: [] });
    return conv;
  },
  removeConversation: (id) =>
    set((s) => ({
      conversations: s.conversations.filter((c) => c.id !== id),
      activeConversationId: s.activeConversationId === id ? null : s.activeConversationId,
    })),
  updateConversation: (id, updates) =>
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === id ? { ...c, ...updates } : c)),
    })),

  messages: [],
  setMessages: (msgs) => set({ messages: msgs }),
  addMessage: (msg) => set((s) => ({ messages: [...s.messages, msg] })),

  loading: false,
  setLoading: (v) => set({ loading: v }),

  checkResult: null,
  setCheckResult: (r) => set({ checkResult: r }),

  selectedWikiPages: [],
  selectedRawFiles: [],
  selectedPdfPages: [],
  setSelectedWikiPages: (pages) => set({ selectedWikiPages: pages }),
  setSelectedRawFiles: (files) => set({ selectedRawFiles: files }),
  setSelectedPdfPages: (pdfs) => set({ selectedPdfPages: pdfs }),
  clearContext: () =>
    set({ selectedWikiPages: [], selectedRawFiles: [], selectedPdfPages: [] }),
}));
