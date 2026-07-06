/**
 * src/components/ChatWindow.tsx
 * Main chat message display area with smart auto-scroll
 */
import { useRef, useEffect, useCallback } from 'react';
import { useStore } from '../lib/store';
import MessageBubble from './MessageBubble';

export default function ChatWindow() {
  const { messages, loading } = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);

  const handleScroll = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const threshold = 100; // px from bottom to consider "near bottom"
    isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
  }, []);

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  if (messages.length === 0 && !loading) {
    return (
      <div className="flex-1 min-w-0 flex items-center justify-center">
        <div className="text-center text-gray-500 max-w-md px-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-400 mb-2">Wiki Chat Workbench</h2>
          <p className="text-sm leading-relaxed">
            针对你的 Zigbee Wiki 知识库提问。
            <br />
            上传 raw 文件、引用 PDF 页面，构建你的知识体系。
          </p>
          <div className="mt-4 text-xs text-gray-600">
            <p>提示: 可在 Raw 文件页面拖拽上传文件，或在 PDF 预览中选择页码范围后提问。</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className="flex-1 min-w-0 overflow-y-auto px-3 sm:px-4 py-4 space-y-4"
    >
      {messages.map((msg) => (
        <MessageBubble key={msg.id} message={msg} />
      ))}
      {loading && (
        <div className="flex items-center gap-2 text-gray-500 text-sm pl-8 py-2">
          <div className="animate-pulse w-2 h-2 bg-gray-500 rounded-full" />
          <div className="animate-pulse w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '75ms' }} />
          <div className="animate-pulse w-2 h-2 bg-gray-500 rounded-full" style={{ animationDelay: '150ms' }} />
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
