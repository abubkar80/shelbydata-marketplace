export type DatasetCategory =
  | "nlp"
  | "computer-vision"
  | "tabular"
  | "audio"
  | "time-series"
  | "multimodal"
  | "reinforcement-learning"
  | "other";

export interface DatasetMetadata {
  name: string;
  description: string;
  category: DatasetCategory;
  tags: string[];
  license: string;
  size?: number;
  format?: string;
  uploadedAt?: string;
  uploader?: string;
}

export interface Dataset {
  blobName: string;
  /** Original file name decoded from the packed blob name, when present. */
  fileName?: string;
  blobMerkleRoot?: string;
  size: number;
  expirationMicros?: number;
  uploadedAt: number;
  metadata?: DatasetMetadata;
  downloadUrl: string;
  uploader: string;
}

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

export type UploadStep =
  | "idle"
  | "selecting"
  | "encoding"
  | "registering"
  | "uploading"
  | "committing"
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

export interface UploadFormData {
  file: File | null;
  name: string;
  description: string;
  category: DatasetCategory;
  tags: string;
  license: string;
}

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
}
