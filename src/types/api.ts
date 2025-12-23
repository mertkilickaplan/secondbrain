// API Response types
export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  details?: string;
}

export interface ApiError {
  error: string;
  details?: string;
  category?: "auth" | "validation" | "database" | "network" | "ai" | "unknown";
  retryable?: boolean;
}

// Note types
export interface Note {
  id: string;
  userId: string;
  content: string;
  type: "text" | "url";
  url?: string | null;
  title?: string | null;
  summary?: string | null;
  topics?: string | null;
  tags?: string | null;
  embedding?: string | null;
  createdAt: Date | string;
  status: "processing" | "ready" | "error";
  search_vector?: unknown; // tsvector type
}

// Edge types
export interface Edge {
  id: string;
  sourceId: string;
  targetId: string;
  similarity: number;
  explanation: string;
  createdAt: Date | string;
}

// Graph types
export interface GraphNode {
  id: string;
  title: string;
  content: string;
  summary?: string | null;
  status: string;
  tags: string[];
  type: "text" | "url";
}

export interface GraphLink {
  source: string;
  target: string;
  similarity: number;
  explanation: string;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Search types
export interface SearchResult {
  id: string;
  title: string;
  summary: string | null;
  status: string;
  type?: string;
  snippet?: string;
  rank?: number;
  tags?: string;
}

export interface SearchResponse {
  results: SearchResult[];
  query: string;
  isTagSearch?: boolean;
  filters?: {
    tag?: string | null;
    status?: string | null;
    type?: string | null;
  };
  count: number;
}

// Tag types
export interface TagsResponse {
  tags: string[];
}

// Export/Import types
export interface ExportData {
  notes: Note[];
  edges: Edge[];
  exportedAt: string;
  version: string;
}

// AI Processing types
export interface AIAnalysis {
  summary: string;
  topics: string[];
  title: string;
}

export interface AIEmbedding {
  embedding: number[];
}

export interface ConnectionExplanation {
  explanation: string;
}
