/**
 * Retrieval evidence page.
 */
import { useEffect, useState } from 'react';
import { getEvidencePacks, getResearchRuns } from '../lib/api';
import { Database, Search, RefreshCw, FileText } from 'lucide-react';

function SourceBadge({ item }: { item: any }) {
  const pages = item.pages?.length ? ` p.${item.pages.join(',')}` : '';
  return (
    <span className="inline-flex max-w-full min-w-0 text-[10px] px-1.5 py-0.5 rounded bg-yellow-600/10 text-yellow-300">
      <span className="truncate">{item.source_path || item.path}{pages}</span>
    </span>
  );
}

export default function RetrievalPage() {
  const [runs, setRuns] = useState<any[]>([]);
  const [packs, setPacks] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async (q = query) => {
    setLoading(true);
    try {
      const [nextRuns, nextPacks] = await Promise.all([
        getResearchRuns(q),
        getEvidencePacks(q),
      ]);
      setRuns(nextRuns);
      setPacks(nextPacks);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load('');
  }, []);

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="border-b border-gray-800 px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <Database size={18} className="flex-shrink-0 text-cyan-400" />
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-gray-200">检索记录</h2>
            <p className="text-xs text-gray-500 break-words">只展示 spec/source 搜索轨迹和 evidence pack，不保存模型回答正文。</p>
          </div>
        </div>
        <button
          onClick={() => load()}
          disabled={loading}
          className="flex flex-shrink-0 items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 text-xs hover:bg-cyan-600/30 disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          刷新
        </button>
      </div>

      <div className="border-b border-gray-800 px-3 sm:px-4 py-3">
        <div className="relative max-w-xl">
          <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') load(query);
            }}
            placeholder="搜索 query / term / topic key"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-8 pr-3 py-2 text-sm outline-none focus:border-cyan-600"
          />
        </div>
      </div>

      <div className="grid flex-1 grid-cols-1 gap-4 overflow-y-auto p-3 sm:p-4 xl:grid-cols-2">
        <section className="min-w-0">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Evidence Packs ({packs.length})</h3>
          <div className="space-y-3">
            {packs.map((pack) => (
              <div key={pack.id} className="min-w-0 border border-gray-700 bg-gray-800/40 rounded-lg p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-200 break-words">{pack.topic_key}</p>
                    <p className="text-xs text-gray-500 mt-0.5 break-words">{pack.query}</p>
                  </div>
                  <span className="flex-shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-cyan-600/20 text-cyan-300">
                    {pack.record_type || 'source_evidence_pack'}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(pack.source_refs || [{ source_path: pack.source_path, pages: pack.pages }]).map((ref: any, i: number) => (
                    <SourceBadge key={i} item={ref} />
                  ))}
                </div>
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">查看 source snippets</summary>
                  <pre className="mt-1 text-xs text-gray-400 bg-gray-900 rounded p-2 overflow-x-auto max-h-48">
                    {JSON.stringify(pack.chunk_refs || pack.snippets || [], null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </section>

        <section className="min-w-0">
          <h3 className="text-xs font-semibold text-gray-400 uppercase mb-2">Research Runs ({runs.length})</h3>
          <div className="space-y-3">
            {runs.map((run) => (
              <div key={run.id} className="min-w-0 border border-gray-700 bg-gray-800/40 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <FileText size={14} className="text-blue-400 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-200 break-words">{run.query}</p>
                    <p className="text-xs text-gray-500 mt-0.5 break-words">
                      {run.search_mode || 'source_search'} · {new Date(run.created_at).toLocaleString('zh-CN')}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {(run.selected_pdf_pages || []).map((ref: any, i: number) => (
                    <SourceBadge key={i} item={ref} />
                  ))}
                </div>
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-300">查看完整 search trace</summary>
                  <pre className="mt-1 text-xs text-gray-400 bg-gray-900 rounded p-2 overflow-x-auto max-h-48">
                    {JSON.stringify(run, null, 2)}
                  </pre>
                </details>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
