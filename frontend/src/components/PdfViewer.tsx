/**
 * src/components/PdfViewer.tsx
 * PDF preview with info panel and page range selection
 */
import { useState, useEffect } from 'react';
import { getPdfInfo, getPdfFileUrl, readPdfPages } from '../lib/api';
import { useStore } from '../lib/store';
import { X, FileQuestion, ChevronLeft, ChevronRight, BookOpen, Copy } from 'lucide-react';

interface Props {
  pdf: any;
  onClose: () => void;
}

export default function PdfViewer({ pdf, onClose }: Props) {
  const [info, setInfo] = useState<any>(null);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [readResult, setReadResult] = useState<any>(null);
  const [reading, setReading] = useState(false);

  const { setSelectedPdfPages, selectedPdfPages } = useStore();

  useEffect(() => {
    if (pdf) {
      getPdfInfo(pdf.id)
        .then((data) => {
          setInfo(data);
          setEndPage(Math.min(3, data.pages || 1));
        })
        .catch(() => {
          setInfo(pdf);
        });
    }
  }, [pdf?.id]);

  const handleRead = async () => {
    setReading(true);
    try {
      const result = await readPdfPages(pdf.id, startPage, endPage);
      setReadResult(result);
    } catch (err: any) {
      setReadResult({ error: err.message });
    }
    setReading(false);
  };

  const handleSelectForChat = () => {
    const rangePages = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    );
    const existing = selectedPdfPages.find((pp) => pp.path === pdf.path);
    if (existing) {
      const newPages = [...new Set([...(existing.pages || []), ...rangePages])].sort();
      setSelectedPdfPages(
        selectedPdfPages.map((pp) =>
          pp.path === pdf.path ? { ...pp, pages: newPages } : pp
        )
      );
    } else {
      setSelectedPdfPages([
        ...selectedPdfPages,
        { path: pdf.path, pages: rangePages },
      ]);
    }
  };

  const handleCopyPagePrompt = () => {
    const prompt = `Read PDF: ${pdf.path}, pages ${startPage}-${endPage}\nUse /wiki-pdf-read to process this incrementally.`;
    navigator.clipboard.writeText(prompt);
  };

  return (
    <div className="flex h-full">
      {/* Main viewer */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <FileQuestion size={14} className="text-red-400 flex-shrink-0" />
            <span className="text-xs truncate">{pdf.filename}</span>
          </div>
          <button onClick={onClose} className="p-0.5 hover:bg-gray-800 rounded text-gray-400">
            <X size={14} />
          </button>
        </div>

        {/* PDF render area */}
        <div className="flex-1 bg-gray-900">
          {pdf.id ? (
            <iframe
              src={getPdfFileUrl(pdf.id)}
              className="w-full h-full"
              title={`PDF: ${pdf.filename}`}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600 text-sm">
              PDF preview not available
            </div>
          )}
        </div>

        {/* Page controls */}
        <div className="flex items-center gap-2 px-3 py-2 border-t border-gray-800 bg-gray-950 flex-shrink-0">
          <label className="text-[10px] text-gray-500">Pages:</label>
          <input
            type="number"
            min={1}
            max={info?.pages || 999}
            value={startPage}
            onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-14 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-center"
          />
          <span className="text-gray-500 text-xs">to</span>
          <input
            type="number"
            min={1}
            max={info?.pages || 999}
            value={endPage}
            onChange={(e) => {
              const val = parseInt(e.target.value) || 1;
              setEndPage(Math.max(startPage, Math.min(val, startPage + 4)));
            }}
            className="w-14 bg-gray-800 border border-gray-700 rounded px-1.5 py-0.5 text-xs text-center"
          />
          <span className="text-gray-500 text-[10px]">/ {info?.pages || '?'}</span>

          <button
            onClick={handleRead}
            disabled={
              reading ||
              endPage < startPage ||
              endPage - startPage > 4 ||
              startPage < 1
            }
            className="px-2 py-0.5 rounded bg-blue-600/20 text-blue-300 text-xs hover:bg-blue-600/30 disabled:opacity-30 transition-colors"
          >
            {reading ? '...' : 'Read'}
          </button>

          <button
            onClick={handleSelectForChat}
            className="px-2 py-0.5 rounded bg-emerald-600/20 text-emerald-300 text-xs hover:bg-emerald-600/30 transition-colors"
            title="Select this page for chat context"
          >
            +Chat
          </button>

          <button
            onClick={handleCopyPagePrompt}
            className="ml-auto p-0.5 hover:bg-gray-800 rounded text-gray-400"
            title="Copy safe read prompt"
          >
            <Copy size={12} />
          </button>
        </div>
      </div>

      {/* Info panel */}
      <div className="w-64 flex-shrink-0 border-l border-gray-800 overflow-y-auto p-3">
        <h4 className="text-xs font-semibold text-gray-400 uppercase mb-3">PDF Info</h4>
        {info ? (
          <dl className="space-y-2 text-xs">
            <InfoRow label="Filename" value={info.filename || pdf.filename} />
            <InfoRow label="Pages" value={String(info.pages || '?')} />
            <InfoRow label="Size" value={info.size_human || pdf.size_human} />
            <InfoRow label="Title" value={info.title || '-'} />
            <InfoRow label="Author" value={info.author || '-'} />
            <InfoRow label="Encrypted" value={info.encrypted ? 'Yes' : 'No'} />
            <InfoRow label="Page Size" value={info.page_size || '-'} />
            <InfoRow label="Extractable" value={info.extractable ? 'Yes' : 'No'} />
            {info.confidence !== undefined && (
              <InfoRow label="Confidence" value={`${Math.round(info.confidence * 100)}%`} />
            )}
            <InfoRow label="Diagnosis" value={info.diagnosis || '-'} />

            {info.created_at && (
              <InfoRow
                label="Created"
                value={new Date(info.created_at).toLocaleDateString()}
              />
            )}
            {info.modified_at && (
              <InfoRow
                label="Modified"
                value={new Date(info.modified_at).toLocaleDateString()}
              />
            )}
            <InfoRow label="Indexed" value={new Date(info.indexed_at || Date.now()).toLocaleDateString()} />

            {info.linked_wiki_pages?.length > 0 && (
              <div className="pt-1">
                <dt className="text-gray-500">Linked Wiki Pages</dt>
                <dd className="mt-0.5">
                  {info.linked_wiki_pages.slice(0, 5).map((p: string, i: number) => (
                    <span key={i} className="block text-emerald-300 text-[10px] truncate">{p}</span>
                  ))}
                </dd>
              </div>
            )}

            {info.referenced_by_conversations?.length > 0 && (
              <div className="pt-1">
                <dt className="text-gray-500">Referenced by</dt>
                <dd className="mt-0.5 text-purple-300 text-[10px]">
                  {info.referenced_by_conversations.length} conversations
                </dd>
              </div>
            )}
          </dl>
        ) : (
          <p className="text-xs text-gray-500">Loading info...</p>
        )}

        {/* Read result preview */}
        {readResult && (
          <div className="mt-3 pt-3 border-t border-gray-800">
            <h4 className="text-xs font-semibold text-gray-400 uppercase mb-2">
              Pages {readResult.startPage}-{readResult.endPage}
            </h4>
            {readResult.error ? (
              <p className="text-xs text-red-400">{readResult.error}</p>
            ) : (
              <pre className="text-[10px] text-gray-300 max-h-40 overflow-y-auto whitespace-pre-wrap bg-gray-800/50 rounded p-2">
                {readResult.text?.slice(0, 2000)}
                {readResult.truncated && '\n\n[Truncated...]'}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-gray-300 truncate">{value}</dd>
    </div>
  );
}
