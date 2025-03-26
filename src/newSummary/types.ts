export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
}

export interface TranscriptResponse {
  transcripts: Array<{
    text: string;
    start: number;
    duration: number;
  }>;
}

export interface SummarySection {
  timestamp: string;
  title: string;
  description: string;
  topics: Array<{
    title: string;
    points: string[];
  }>;
}

export interface VideoSummary {
  sections: SummarySection[];
}

export interface SuggestedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  channelTitle: string;
  viewCount: string;
  publishedAt?: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
  depth?: number;
  x?: number;
  y?: number;
  parent?: MindMapNode;
}

export interface MindMapLink {
  source: MindMapNode;
  target: MindMapNode;
}