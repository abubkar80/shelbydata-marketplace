// ─── Dataset & Blob types ──────────────────────────────────────────────────────

export interface DatasetMetadata {
  name: string;
  description: string;
  category: DatasetCategory;
  tags: string[];
  license: string;
  price: number; // in ShelbyUSD
  size: number;  // bytes
  format: string;
  uploadedAt: string; // ISO string
  uploader: string;   // Aptos address
}

export interface Dataset {
  blobName: string;
  blobMerkleRoot?: string;
  size: number;
  expirationMicros: number;
  uploadedAt: number; // unix ms
  metadata?: DatasetMetadata;
  downloadUrl: string;
  uploader: string;
}

export type DatasetCategory =
  | "nlp"
  | "computer-vision"
  | "tabular"
  | "audio"
  | "time-series"
  | "multimodal"
  | "reinforcement-learning"
  | "other";

export const CATEGORY_LABELS: Record<DatasetCategory, string> = {
  nlp: "NLP / Text",
  "computer-vision": "Computer Vision",
  tabular: "Tabular / CSV",
  audio: "Audio",
  "time-series": "Time Series",
  multimodal: "Multimodal",
  "reinforcement-learning": "Reinforcement Learning",
  other: "Other",
};

export const CATEGORY_COLORS: Record<DatasetCategory, string> = {
  nlp: "badge-mint",
  "computer-vision": "badge-indigo",
  tabular: "badge-amber",
  audio: "badge-gray",
  "time-series": "badge-mint",
  multimodal: "badge-indigo",
  "reinforcement-learning": "badge-amber",
  other: "badge-gray",
};

// ─── Upload state machine ───────────────────────────────────────────────────────

export type UploadStep =
  | "idle"
  | "selecting"
  | "encoding"
  | "registering"
  | "uploading"
  | "done"
  | "error";

export interface UploadState {
  step: UploadStep;
  progress: number;
  error?: string;
  txHash?: string;
  blobUrl?: string;
  logs: string[];
}

// ─── Form types ────────────────────────────────────────────────────────────────

export interface UploadFormData {
  file: File | null;
  name: string;
  description: string;
  category: DatasetCategory;
  tags: string;
  license: string;
  price: string;
}

// ─── Marketplace ───────────────────────────────────────────────────────────────

export interface MarketplaceListing extends Dataset {
  downloadsCount: number;
  rating: number;
}

// ─── Toast notification ────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
