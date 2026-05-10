/**
 * src/pages/SettingsPage.tsx
 * Settings page
 */
import { Settings, Server, Key, Database, Shield } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-800 px-4 py-3">
        <h2 className="text-sm font-semibold text-gray-200 flex items-center gap-2">
          <Settings size={16} className="text-gray-400" />
          设置
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 max-w-2xl">
        <div className="space-y-6">
          {/* Server config */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Server size={14} />
              后端服务
            </h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">后端地址</span>
                <code className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">localhost:3001</code>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">前端地址</span>
                <code className="text-xs text-gray-400 bg-gray-700 px-2 py-0.5 rounded">localhost:5173</code>
              </div>
            </div>
          </section>

          {/* API config */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Key size={14} />
              API 配置
            </h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">DEEPSEEK_API_KEY</span>
                <span className="text-xs bg-emerald-600/20 text-emerald-300 px-2 py-0.5 rounded">已配置</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                API Key 通过环境变量 DEEPSEEK_API_KEY 配置，前端不接触 Key。确保已设置：
              </p>
              <code className="text-xs block bg-gray-900 rounded p-2 text-gray-400">
                export DEEPSEEK_API_KEY="sk-..."
              </code>
            </div>
          </section>

          {/* Data storage */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Database size={14} />
              数据存储
            </h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <p className="text-sm text-gray-300">JSON 文件存储</p>
              <p className="text-xs text-gray-500 mt-1">
                对话历史、归档流程、审查队列等数据存储在 runtime/data/ 目录下的 JSON 文件中。
              </p>
              <div className="mt-2 space-y-1">
                <code className="text-xs text-gray-400 block">runtime/data/conversations.json — 对话历史</code>
                <code className="text-xs text-gray-400 block">runtime/data/messages.json — 消息记录</code>
                <code className="text-xs text-gray-400 block">runtime/data/archives.json — 归档流程</code>
                <code className="text-xs text-gray-400 block">runtime/data/review-items.json — 审查队列</code>
              </div>
            </div>
          </section>

          {/* Security */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase mb-3 flex items-center gap-2">
              <Shield size={14} />
              安全约束
            </h3>
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
              <ul className="space-y-2 text-xs text-gray-400">
                <li>• API Key 仅在后端环境变量中，前端不可见</li>
                <li>• PDF 单次最多读取 5 页</li>
                <li>• 上下文上限 60,000 字符</li>
                <li>• 第一版不自动写回 Wiki（需人工确认）</li>
                <li>• 上传文件后仅读取元数据，不自动分析全文</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
