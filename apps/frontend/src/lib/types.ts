// ============================================================
// Shared Types for Wiki Chat Workbench
// ============================================================

export type AuthRole = 'admin' | 'user';

export interface AuthStatus {
  authenticated: boolean;
  registration_available?: boolean;
  user_id?: string;
  role?: AuthRole;
}

// --- Conversation ---
export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  status: 'active' | 'archived';
  message_count: number;
  has_raw: boolean;
  has_pdf: boolean;
  has_wiki_update: boolean;
  archived: boolean;
  related_raw_files: string[];
  related_wiki_pages: string[];
  related_pdf_pages: { path: string; pages: number[] }[];
  last_summary: string;
  transient?: boolean;
}

// --- Message ---
export type MessageRole = 'user' | 'assistant' | 'system' | 'tool' | 'status';

export interface Citation {
  type: 'wiki' | 'raw' | 'pdf' | 'evidence';
  title: string;
  path: string;
  pages?: number[];
  source_id?: string;
  evidence_pack_id?: string;
  score?: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
  citations?: Citation[];
  related_files?: string[];
  related_pages?: string[];
  related_pdf_pages?: { path: string; pages: number[] }[];
  model?: string;
  token_estimate?: number;
  search_trace?: {
    auto_context_used?: boolean;
    selected_wiki_pages?: string[];
    selected_source_chunks?: unknown[];
    selected_pdf_pages?: { path: string; pages: number[] }[];
    selected_evidence_packs?: string[];
  };
}

// --- Archive ---
export type ArchiveStepType =
  | 'user_input'
  | 'context_selection'
  | 'model_analysis'
  | 'wiki_update_proposal'
  | 'review_status'
  | 'writeback_status'
  | 'followup_tasks';

export type ArchiveStepStatus = 'completed' | 'in_progress' | 'pending' | 'skipped' | 'error';

export interface ArchiveStep {
  id: string;
  type: ArchiveStepType;
  title: string;
  status: ArchiveStepStatus;
  started_at: string;
  finished_at?: string;
  summary: string;
  details: Record<string, unknown>;
  related_files: string[];
  related_pages: string[];
}

export interface ConversationArchive {
  id: string;
  conversation_id: string;
  created_at: string;
  steps: ArchiveStep[];
  context_summary: string;
  raw_files: string[];
  wiki_pages: string[];
  pdf_refs: { path: string; pages: number[] }[];
  model_runs: {
    model: string;
    input_estimate: number;
    output_estimate: number;
    error?: string;
  }[];
  update_proposals: UpdateProposal[];
  review_items: string[];
  writeback_status: 'not_applied' | 'proposal_only' | 'patch_generated' | 'confirmed' | 'applied' | 'failed' | 'rolled_back';
  generated_prompt: string;
}

// --- Raw File ---
export type RawFileStatus =
  | 'new'
  | 'indexed'
  | 'processing'
  | 'summarized'
  | 'linked'
  | 'archived'
  | 'ignored'
  | 'error';

export interface RawFile {
  id: string;
  filename: string;
  original_name: string;
  path: string;
  type: 'pdf' | 'markdown' | 'text' | 'html' | 'docx' | 'pptx' | 'image' | 'other';
  mime: string;
  size: number;
  size_human: string;
  uploaded_at: string;
  indexed_at?: string;
  status: RawFileStatus;
  metadata?: Record<string, unknown>;
  linked_wiki_pages: string[];
  related_conversations: string[];
  summary: string;
  risk_level: 'low' | 'medium' | 'high';
}

// --- PDF Info ---
export interface PdfInfo {
  id: string;
  raw_file_id: string;
  path: string;
  filename: string;
  size_human: string;
  pages: number;
  title?: string;
  author?: string;
  created_at?: string;
  modified_at?: string;
  encrypted: boolean;
  page_size?: string;
  linked_wiki_pages: string[];
  referenced_by_conversations: string[];
  indexed_at: string;
  extractable: boolean;
  confidence: number;
  diagnosis: string;
}

// --- Review Item ---
export type ReviewType =
  | 'create_page'
  | 'update_page'
  | 'add_source_reference'
  | 'add_wikilink'
  | 'fix_broken_link'
  | 'merge_duplicate'
  | 'mark_reviewed'
  | 'improve_summary'
  | 'split_page';

export type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'applied' | 'failed' | 'archived';

export interface UpdateProposal {
  type: ReviewType;
  target_page: string;
  summary: string;
  details: string;
  suggested_patch?: string;
}

export interface ReviewItem {
  id: string;
  type: ReviewType;
  title: string;
  source_conversation_id: string;
  target_page: string;
  related_raw_files: string[];
  related_pdf_pages: { path: string; pages: number[] }[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: ReviewStatus;
  summary: string;
  suggested_patch?: string;
  claude_prompt: string;
  created_at: string;
  updated_at: string;
}

// --- Check Result ---
export interface CheckIssue {
  id: string;
  type: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  file: string;
  related_files: string[];
  suggestion: string;
  claude_prompt: string;
}

export interface CheckResult {
  id: string;
  created_at: string;
  health_score: number;
  total_issues: number;
  critical: number;
  errors: number;
  warnings: number;
  suggestions: number;
  issues: CheckIssue[];
  summary: string;
}

// --- Wiki Page (index) ---
export interface WikiPageInfo {
  id: string;
  title: string;
  path: string;
  folder: string;
  type: string;
  frontmatter: Record<string, unknown>;
  tags: string[];
  status: string;
  confidence?: number;
  maturity?: string;
  explored?: boolean;
  ai_generated?: boolean;
  source_refs: string[];
  pdf_refs: string[];
  outgoing_links: string[];
  backlinks: string[];
  broken_links: string[];
  created_at: string;
  updated_at: string;
  word_count: number;
  summary: string;
}

// --- Source Index ---
export interface SourceIndex {
  raw_files: RawFile[];
  pdf_files: PdfInfo[];
  markdown_files: { path: string; size: number }[];
  linked_sources: string[];
  unlinked_sources: string[];
  last_indexed_at: string;
}

// --- Index Summary ---
export interface IndexSummary {
  wiki_page_count: number;
  raw_file_count: number;
  pdf_count: number;
  inbox_count: number;
  review_item_count: number;
  last_check?: CheckResult;
  recent_conversations: Conversation[];
}

// --- Chat Request / Response ---
export interface ChatRequest {
  conversation_id?: string;
  message: string;
  wiki_pages?: string[];
  raw_files?: string[];
  pdf_pages?: { path: string; pages: number[] }[];
  transient_messages?: Pick<Message, 'role' | 'content'>[];
  model?: string;
}

export interface ChatResponse {
  message: Message;
  archive_id: string;
  update_proposals: UpdateProposal[];
}

// --- API Error ---
export interface ApiError {
  error: string;
  code: string;
  details?: string;
}
