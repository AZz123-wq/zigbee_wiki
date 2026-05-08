/**
 * src/components/MessageBubble.tsx
 * Chat message bubble with role-based styling and citations
 */
import ReactMarkdown from 'react-markdown';
import type { Message } from '../lib/types';
import { User, Bot, Wrench, Info, Activity } from 'lucide-react';

interface Props {
  message: Message;
}

const roleIcons: Record<string, typeof User> = {
  user: User,
  assistant: Bot,
  system: Info,
  tool: Wrench,
  status: Activity,
};

const roleStyles: Record<string, string> = {
  user: 'bg-blue-600/20 border-blue-600/30',
  assistant: 'bg-gray-800 border-gray-700',
  system: 'bg-yellow-600/10 border-yellow-600/20 text-yellow-200',
  tool: 'bg-purple-600/10 border-purple-600/20',
  status: 'bg-green-600/10 border-green-600/20 text-green-200',
};

export default function MessageBubble({ message }: Props) {
  const Icon = roleIcons[message.role] || Bot;
  const style = roleStyles[message.role] || roleStyles.assistant;

  return (
    <div className={`message-enter flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${
        message.role === 'user' ? 'bg-blue-600' : 'bg-gray-700'
      }`}>
        <Icon size={14} className="text-white" />
      </div>

      {/* Content */}
      <div className={`flex-1 max-w-[85%] ${message.role === 'user' ? 'text-right' : ''}`}>
        <div
          className={`inline-block rounded-lg px-4 py-2.5 border ${style} ${
            message.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
          }`}
        >
          {message.role === 'assistant' || message.role === 'system' ? (
            <div className="prose prose-invert prose-sm max-w-none">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          )}

          {/* Citations */}
          {message.citations && message.citations.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700 flex flex-wrap gap-1.5">
              {message.citations.map((cite, i) => (
                <span
                  key={i}
                  className={`text-xs px-2 py-0.5 rounded-full cursor-default ${
                    cite.type === 'wiki'
                      ? 'bg-emerald-600/20 text-emerald-300'
                      : cite.type === 'pdf'
                      ? 'bg-yellow-600/20 text-yellow-300'
                      : 'bg-blue-600/20 text-blue-300'
                  }`}
                  title={`${cite.type}: ${cite.path}${cite.pages ? ` (p.${cite.pages.join(',')})` : ''}`}
                >
                  {cite.type === 'wiki' && 'W '}
                  {cite.type === 'pdf' && 'P '}
                  {cite.type === 'raw' && 'R '}
                  {cite.title.slice(0, 30)}
                  {cite.pages && ` p.${cite.pages.join(',')}`}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {message.created_at && (
          <div className="text-[10px] text-gray-600 mt-0.5 px-1">
            {new Date(message.created_at).toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  );
}
