// Shared types for the application

export interface Note {
    id: string;
    content: string;
    type: "text" | "url";
    url?: string | null;
    title?: string | null;
    summary?: string | null;
    topics?: string | null;
    embedding?: string | null;
    createdAt: string;
    status: "processing" | "ready" | "error";
}

export interface Edge {
    id: string;
    sourceId: string;
    targetId: string;
    similarity: number;
    explanation: string;
    createdAt: string;
}

// Graph visualization types
export interface GraphNode extends Note {
    val?: number; // For node size based on connections
}

export interface GraphLink {
    id: string;
    source: string | GraphNode;
    target: string | GraphNode;
    similarity: number;
    explanation: string;
}

export interface GraphData {
    nodes: GraphNode[];
    links: GraphLink[];
}

// API Response types
export interface SearchResult {
    id: string;
    title: string;
    summary: string | null;
    status: string;
}

export interface SearchResponse {
    results: SearchResult[];
}

export interface ApiError {
    error: string;
}
