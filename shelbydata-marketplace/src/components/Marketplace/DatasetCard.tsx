import { Download, FileText, Clock, HardDrive, ExternalLink, Eye } from "lucide-react";
import type { Dataset } from "../../types";
import { CATEGORY_LABELS, CATEGORY_COLORS, type DatasetCategory } from "../../types";
import { formatBytes, truncateAddress, isImageFile } from "../../lib/shelbyClient";
import { Link } from "react-router-dom";

interface DatasetCardProps {
  dataset: Dataset;
  onDownload?: () => void;
}

function getCategory(name: string): DatasetCategory {
  const lower = name.toLowerCase();
  if (lower.includes("nlp") || lower.includes("text") || lower.includes("language")) return "nlp";
  if (lower.includes("image") || lower.includes("vision") || lower.includes("photo")) return "computer-vision";
  if (lower.includes("audio") || lower.includes("speech") || lower.includes("sound")) return "audio";
  if (lower.includes("time") || lower.includes("series") || lower.includes("ts")) return "time-series";
  if (lower.includes("csv") || lower.includes("tabular") || lower.includes("table")) return "tabular";
  return "other";
}

export function DatasetCard({ dataset, onDownload }: DatasetCardProps) {
  const category = dataset.metadata?.category ?? getCategory(dataset.blobName);
  const badgeClass = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];
  const isImg = isImageFile(dataset.blobName);
  const expiresAt = new Date(dataset.expirationMicros / 1000);
  const daysLeft = Math.max(0, Math.ceil((expiresAt.getTime() - Date.now()) / 86400000));

  return (
    <div className="card p-5 flex flex-col gap-4 animate-slide-up group">

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
            ${isImg ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-mint/10 border border-mint/20"}`}>
            <FileText className={`w-4 h-4 ${isImg ? "text-indigo-400" : "text-mint"}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-mono text-sm font-bold text-data truncate" title={dataset.blobName}>
              {dataset.blobName}
            </h3>
            <p className="font-mono text-xs text-muted mt-0.5">
              by {truncateAddress(dataset.uploader)}
            </p>
          </div>
        </div>
        <span className={badgeClass}>{label}</span>
      </div>

      {/* Description */}
      {dataset.metadata?.description && (
        <p className="text-xs text-muted font-sans leading-relaxed line-clamp-2">
          {dataset.metadata.description}
        </p>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-space-700/40 rounded-lg px-2.5 py-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-muted">
            <HardDrive className="w-3 h-3" />
            <span className="text-xs font-mono uppercase tracking-wider">Size</span>
          </div>
          <span className="font-mono text-xs text-data font-bold">{formatBytes(dataset.size)}</span>
        </div>
        <div className="bg-space-700/40 rounded-lg px-2.5 py-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-muted">
            <Clock className="w-3 h-3" />
            <span className="text-xs font-mono uppercase tracking-wider">Expires</span>
          </div>
          <span className={`font-mono text-xs font-bold ${daysLeft < 5 ? "text-amber-400" : "text-data"}`}>
            {daysLeft}d left
          </span>
        </div>
        <div className="bg-space-700/40 rounded-lg px-2.5 py-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-muted">
            <FileText className="w-3 h-3" />
            <span className="text-xs font-mono uppercase tracking-wider">Format</span>
          </div>
          <span className="font-mono text-xs text-data font-bold uppercase">
            {dataset.blobName.split(".").pop() ?? "—"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <button
          onClick={onDownload}
          className="btn-primary flex-1 justify-center text-xs py-2"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>
        <a
          href={dataset.downloadUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary px-3 py-2"
          title="View raw blob"
        >
          <Eye className="w-3.5 h-3.5" />
        </a>
        <a
          href={`https://explorer.shelby.xyz/shelbynet`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-ghost px-3 py-2 border border-border rounded-lg"
          title="View on Explorer"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
