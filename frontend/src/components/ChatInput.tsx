/**
 * src/components/ChatInput.tsx
 * Chat input area with file upload, drag-drop, and context selection
 */
import { useState, useCallback, useRef, useEffect } from 'react';
import { useStore } from '../lib/store';
import { sendChatStream, uploadRawFile } from '../lib/api';
import { ArrowUp, Paperclip, Upload, X, Loader2, Square } from 'lucide-react';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFileIds, setUploadedFileIds] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const {
    activeConversationId,
    selectedWikiPages,
    selectedRawFiles,
    selectedPdfPages,
    addMessage,
    addConversation,
    setActiveConversation,
    setLoading,
    clearContext,
    loading,
  } = useStore();

  // Clear local uploaded files when context is cleared
  useEffect(() => {
    if (selectedWikiPages.length === 0 && selectedRawFiles.length === 0 && selectedPdfPages.length === 0) {
      setUploadedFiles([]);
      setUploadedFileIds([]);
    }
  }, [selectedWikiPages, selectedRawFiles, selectedPdfPages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text && uploadedFiles.length === 0) return;
    const messageText = text || '上传了文件';

    // Upload files first if any
    let rawFileIds: string[] = [...uploadedFileIds];
    if (uploadedFiles.length > 0 && uploadedFileIds.length < uploadedFiles.length) {
      setUploading(true);
      const newIds: string[] = [];
      for (const file of uploadedFiles) {
        try {
          const result = await uploadRawFile(file);
          newIds.push(result.path);
        } catch (err) {
          console.error('Upload failed for', file.name, err);
        }
      }
      rawFileIds = [...uploadedFileIds, ...newIds];
      setUploadedFileIds(rawFileIds);
      setUploading(false);
    }

    // Abort any previous streaming request
    const abort = new AbortController();
    abortRef.current = abort;

    setLoading(true);
    let currentConversationId = activeConversationId || '';
    const userMsg = {
      id: `temp-${Date.now()}`,
      conversation_id: currentConversationId,
      role: 'user' as const,
      content: messageText,
      created_at: new Date().toISOString(),
    };
    addMessage(userMsg);
    setInput('');

    // Create a placeholder assistant message for streaming tokens
    const assistantMsgId = `streaming-${Date.now()}`;
    let finalAssistantMsgId = assistantMsgId;
    const streamingMsg = {
      id: assistantMsgId,
      conversation_id: currentConversationId,
      role: 'assistant' as const,
      content: '',
      created_at: new Date().toISOString(),
    };
    addMessage(streamingMsg);

    try {
      await sendChatStream(
        {
          conversation_id: activeConversationId,
          message: messageText,
          wiki_pages: selectedWikiPages,
          raw_files: [...selectedRawFiles, ...rawFileIds],
          pdf_pages: selectedPdfPages,
        },
        (token) => {
          // Append token to the streaming message in real-time
          useStore.setState((s) => ({
            messages: s.messages.map((m) =>
              m.id === finalAssistantMsgId ? { ...m, content: m.content + token } : m
            ),
          }));
        },
        (fullContent) => {
          if (!fullContent) return;
          useStore.setState((s) => ({
            messages: s.messages.map((m) =>
              m.id === finalAssistantMsgId ? { ...m, content: fullContent } : m
            ),
          }));
        },
        (errMsg) => {
          console.error('Stream error:', errMsg);
        },
        abort.signal,
        {
          onConversation: (payload) => {
            currentConversationId = payload.conversation_id || currentConversationId;
            if (payload.conversation) {
              const exists = useStore
                .getState()
                .conversations.some((c) => c.id === payload.conversation.id);
              if (!exists) addConversation(payload.conversation);
            } else if (currentConversationId) {
              setActiveConversation(currentConversationId);
            }

            useStore.setState((s) => ({
              messages: s.messages.map((m) =>
                m.id === userMsg.id || m.id === finalAssistantMsgId
                  ? { ...m, conversation_id: currentConversationId }
                  : m
              ),
            }));
          },
          onUserMessage: (serverUserMsg) => {
            currentConversationId = serverUserMsg.conversation_id || currentConversationId;
            useStore.setState((s) => ({
              messages: s.messages.map((m) =>
                m.id === userMsg.id ? serverUserMsg : m
              ),
            }));
          },
          onAssistantMessage: (serverAssistantMsg) => {
            finalAssistantMsgId = serverAssistantMsg.id || finalAssistantMsgId;
            useStore.setState((s) => ({
              messages: s.messages.map((m) =>
                m.id === assistantMsgId || m.id === finalAssistantMsgId
                  ? serverAssistantMsg
                  : m
              ),
            }));
          },
        }
      );

      setUploadedFiles([]);
      setUploadedFileIds([]);
    } catch (err: any) {
      if (err.name === 'AbortError') {
        // Remove incomplete streaming message
        useStore.setState((s) => ({
          messages: s.messages.filter((m) => m.id !== assistantMsgId),
        }));
        return;
      }
      // Show error in the streaming message
      useStore.setState((s) => ({
        messages: s.messages.map((m) =>
          m.id === assistantMsgId || m.id === finalAssistantMsgId
            ? { ...m, role: 'system' as const, content: `错误: ${err.message}。请确认后端服务器已启动且 DEEPSEEK_API_KEY 已配置。` }
            : m
        ),
      }));
    } finally {
      setLoading(false);
      abortRef.current = null;
    }
  };

  const handleStop = () => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    setUploadedFiles((prev) => [...prev, ...files]);
  }, []);

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const hasContext = selectedWikiPages.length > 0 || selectedRawFiles.length > 0 || selectedPdfPages.length > 0;

  return (
    <div className="chat-input-area bg-gray-950">
      {/* Context bar */}
      {hasContext && (
        <div className="px-4 pt-2 flex flex-wrap gap-1.5">
          {selectedWikiPages.map((page) => (
            <span key={page} className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-0.5 rounded-full">
              W: {page}
            </span>
          ))}
          {selectedPdfPages.map((pp) => (
            <span key={pp.path} className="text-xs bg-yellow-600/20 text-yellow-300 px-2 py-0.5 rounded-full">
              P: {pp.path} (p.{pp.pages.join(',')})
            </span>
          ))}
          <button onClick={clearContext} className="text-xs text-gray-500 hover:text-gray-300 ml-1">
            清除全部
          </button>
        </div>
      )}

      {/* Uploaded files preview */}
      {uploadedFiles.length > 0 && (
        <div className="px-4 pt-2 flex flex-wrap gap-2">
          {uploadedFiles.map((file, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-800 rounded-lg px-2 py-1 text-xs">
              {uploading ? (
                <Loader2 size={12} className="text-blue-400 animate-spin" />
              ) : (
                <Paperclip size={12} className="text-gray-400" />
              )}
              <span className="text-gray-300 max-w-[150px] truncate">{file.name}</span>
              {!uploading && (
                <button onClick={() => removeFile(i)} className="text-gray-500 hover:text-gray-300">
                  <X size={12} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Input area */}
      <div
        className={`p-4 ${isDragOver ? 'bg-blue-900/10' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="max-w-3xl mx-auto">
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                isDragOver
                  ? '拖放文件以上传...'
                  : '向 Wiki 提问... (Shift+Enter 换行)'
              }
              rows={2}
              className={`w-full bg-gray-800 border rounded-xl px-4 py-3 pr-24 text-sm resize-none
                focus:outline-none focus:border-blue-500 transition-colors
                placeholder-gray-500 ${
                  isDragOver ? 'border-blue-500 bg-blue-900/10' : 'border-gray-700'
                }`}
            />

            {/* Action buttons */}
            <div className="absolute bottom-2 right-2 flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileInput}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-700 disabled:opacity-30 transition-colors"
                title="上传文件"
              >
                <Upload size={16} />
              </button>
              {loading ? (
                <button
                  onClick={handleStop}
                  className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-500 transition-colors"
                  title="停止生成"
                >
                  <Square size={16} />
                </button>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={(!input.trim() && uploadedFiles.length === 0) || uploading}
                  className="p-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  title="发送消息"
                >
                  <ArrowUp size={16} />
                </button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-gray-600 text-center mt-1">
            Wiki Chat Workbench — 回答基于本地 Wiki 知识库。可拖放上传文件。
          </p>
        </div>
      </div>
    </div>
  );
}
