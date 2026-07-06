/**
 * src/pages/RawFilesPage.tsx
 * Raw Files management page with list, upload, and PDF preview
 */
import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../lib/store';
import { getRawFiles, uploadRawFile, getPdfFileUrl } from '../lib/api';
import PdfViewer from '../components/PdfViewer';
import {
  FileText, FileQuestion, Upload, Eye, Link, AlertTriangle, File, Search, Loader2, Info
} from 'lucide-react';

export default function RawFilesPage() {
  const [rawFiles, setRawFiles] = useState<any[]>([]);
  const [pdfFiles, setPdfFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadErrors, setUploadErrors] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  const [search, setSearch] = useState('');
  const { currentUserRole, setSelectedRawFiles, setSelectedPdfPages, selectedRawFiles } = useStore();
  const canUpload = currentUserRole === 'admin';

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const data = await getRawFiles();
      setRawFiles(data.raw_files || []);
      setPdfFiles(data.pdf_files || []);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
    setLoading(false);
  };

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!canUpload) return;
    const files = Array.from(e.dataTransfer.files);
    await uploadFiles(files);
  }, [canUpload]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canUpload) return;
    const files = Array.from(e.target.files || []);
    await uploadFiles(files);
  };

  const uploadFiles = async (files: File[]) => {
    if (!canUpload || files.length === 0) return;
    setUploading(true);
    setUploadErrors([]);
    setUploadProgress({ current: 0, total: files.length });
    const errors: string[] = [];

    const results = await Promise.allSettled(
      files.map(async (file) => {
        await uploadRawFile(file);
      })
    );

    results.forEach((result, i) => {
      if (result.status === 'rejected') {
        errors.push(`${files[i].name}: ${result.reason}`);
      }
      setUploadProgress((prev) => ({ ...prev, current: prev.current + 1 }));
    });

    if (errors.length > 0) {
      setUploadErrors(errors.slice(0, 3));
    }
    setUploading(false);
    await loadFiles();
  };

  const toggleRawFileSelection = (path: string) => {
    const current = [...selectedRawFiles];
    if (current.includes(path)) {
      setSelectedRawFiles(current.filter((f) => f !== path));
    } else {
      setSelectedRawFiles([...current, path]);
    }
  };

  const filtered = search
    ? rawFiles.filter(
        (f) =>
          f.filename?.toLowerCase().includes(search.toLowerCase()) ||
          f.path?.toLowerCase().includes(search.toLowerCase())
      )
    : rawFiles;

  const statusLabels: Record<string, string> = {
    new: '新建',
    indexed: '已索引',
    linked: '已关联',
    archived: '已归档',
    ignored: '已忽略',
    error: '错误',
  };

  const statusColors: Record<string, string> = {
    new: 'bg-blue-600/20 text-blue-300',
    indexed: 'bg-gray-600/20 text-gray-300',
    linked: 'bg-emerald-600/20 text-emerald-300',
    archived: 'bg-purple-600/20 text-purple-300',
    ignored: 'bg-red-600/10 text-red-300',
    error: 'bg-red-600/20 text-red-300',
  };

  const typeIcons: Record<string, typeof File> = {
    pdf: FileQuestion,
    markdown: FileText,
    text: File,
    html: File,
    docx: File,
  };

  return (
    <div className="flex h-full min-w-0 overflow-hidden">
      {/* File list */}
      <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-gray-800 px-3 sm:px-4 py-3 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold">Raw 文件</h2>
            <p className="text-xs text-gray-500">{rawFiles.length} 个文件, {pdfFiles.length} 个 PDF</p>
          </div>
          {canUpload && (
            <label className={`flex-shrink-0 cursor-pointer px-3 py-1.5 rounded-lg text-white text-xs transition-colors flex items-center gap-1.5 ${
              uploading ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
            }`}>
              {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {uploading ? `上传中 (${uploadProgress.current}/${uploadProgress.total})` : '上传'}
              <input type="file" multiple onChange={handleFileSelect} className="hidden" disabled={uploading} />
            </label>
          )}
        </div>

        {/* Upload errors */}
        {uploadErrors.length > 0 && (
          <div className="mx-3 sm:mx-4 mt-2 bg-red-900/20 border border-red-800 rounded-lg px-3 py-2">
            {uploadErrors.map((err, i) => (
              <p key={i} className="text-xs text-red-400 break-words">{err}</p>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="px-3 sm:px-4 py-2 flex-shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-2.5 text-gray-500" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="筛选文件..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Drop zone */}
        {canUpload && (
          <div
            className={`flex-shrink-0 mx-3 sm:mx-4 my-2 border-2 border-dashed rounded-lg p-3 text-center transition-colors ${
              isDragOver
                ? 'border-blue-500 bg-blue-900/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
          >
            <p className="text-xs text-gray-500">
              {isDragOver ? '释放文件以上传' : '拖放文件到此处上传'}
            </p>
          </div>
        )}

        {/* File list */}
        <div className="flex-1 min-w-0 overflow-y-auto px-2">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 size={20} className="animate-spin text-gray-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              暂无文件，上传文件以开始使用。
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((file) => {
                const Icon = typeIcons[file.type] || File;
                const isUnprocessed = file.status === 'indexed' && file.linked_wiki_pages?.length === 0;
                return (
                  <div
                    key={file.id}
                    className={`group flex min-w-0 items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      selectedRawFiles.includes(file.path)
                        ? 'bg-blue-600/10 border border-blue-600/20'
                        : 'hover:bg-gray-800/50 border border-transparent'
                    }`}
                    onClick={() => toggleRawFileSelection(file.path)}
                  >
                    <Icon
                      size={16}
                      className={`flex-shrink-0 ${
                        file.type === 'pdf'
                          ? 'text-red-400'
                          : file.type === 'markdown'
                          ? 'text-blue-400'
                          : 'text-gray-400'
                      }`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate">{file.filename}</p>
                      <p className="text-[10px] text-gray-500">{file.size_human}</p>
                    </div>
                    <div className="flex flex-shrink-0 items-center gap-1.5">
                      <span className={`max-w-[5rem] truncate text-[10px] px-1.5 py-0.5 rounded ${statusColors[file.status] || 'bg-gray-700 text-gray-400'}`}>
                        {statusLabels[file.status] || file.status}
                      </span>
                      {isUnprocessed && (
                        <span title="未处理 — 尚未关联 Wiki 页面">
                          <Info size={12} className="text-yellow-400" />
                        </span>
                      )}
                      {file.risk_level === 'high' && (
                        <span title="高风险 — 大文件">
                          <AlertTriangle size={12} className="text-red-400" />
                        </span>
                      )}
                      {file.type === 'pdf' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const pdf = pdfFiles.find((p) => p.raw_file_id === file.id);
                            setSelectedPdf(pdf || { ...file, raw_file_id: file.id, id: file.id });
                          }}
                          className="p-0.5 hover:bg-gray-700 rounded transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                          title="预览 PDF"
                        >
                          <Eye size={12} className="text-gray-400" />
                        </button>
                      )}
                      {file.linked_wiki_pages?.length > 0 && (
                        <span title="已关联 Wiki">
                          <Link size={12} className="text-emerald-400" />
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* PDF Preview Panel */}
      {selectedPdf && (
        <div className="fixed inset-0 z-50 h-dvh bg-gray-950 md:relative md:inset-auto md:z-auto md:h-full md:w-1/2 md:flex-shrink-0 md:border-l md:border-gray-800">
          <PdfViewer pdf={selectedPdf} onClose={() => setSelectedPdf(null)} />
        </div>
      )}
    </div>
  );
}
