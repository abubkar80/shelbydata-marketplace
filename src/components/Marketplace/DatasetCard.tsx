import { Download, FileText, Clock, HardDrive, ExternalLink, Eye, Tag } from "lucide-react";
import type { Dataset } from "../../types";
import { CATEGORY_LABELS, CATEGORY_COLORS } from "../../types";
import { formatBytes, truncateAddress, isImageFile } from "../../lib/shelbyClient";
import { resolveCategory } from "../../lib/datasetMeta";
import { getShelbyBlobExplorerUrl } from "@shelby-protocol/sdk/browser";
import { Network } from "@aptos-labs/ts-sdk";

interface DatasetCardProps {
  dataset: Dataset;
  onDownload?: () => void;
}

export function DatasetCard({ dataset, onDownload }: DatasetCardProps) {
  const category = resolveCategory(dataset.blobName, dataset.metadata);
  const badgeClass = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];
  const displayName = dataset.metadata?.name || dataset.fileName || dataset.blobName;
  const downloadName = dataset.fileName || dataset.metadata?.name || dataset.blobName;
  const isImg = isImageFile(downloadName);
  const uploadedLabel = dataset.uploadedAt
    ? new Date(dataset.uploadedAt).toLocaleDateString()
    : "—";
  const formatLabel =
    (dataset.metadata?.format || downloadName.split(".").pop() || "—").toUpperCase();
  const explorerUrl = getShelbyBlobExplorerUrl(
    Network.SHELBYNET,
    dataset.uploader,
    dataset.blobName
  );

  return (
    <div className="card p-5 flex flex-col gap-4 animate-slide-up group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0
            ${isImg ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-mint/10 border border-mint/20"}`}
          >
            <FileText className={`w-4 h-4 ${isImg ? "text-indigo-400" : "text-mint"}`} />
          </div>
          <div className="min-w-0">
            <h3 className="font-mono text-sm font-bold text-data truncate" title={displayName}>
              {displayName}
            </h3>
            <p className="font-mono text-xs text-muted mt-0.5">
              by {truncateAddress(dataset.uploader)}
            </p>
          </div>
        </div>
        <span className={badgeClass}>{label}</span>
      </div>

      {dataset.metadata?.description && (
        <p className="text-xs text-muted font-sans leading-relaxed line-clamp-2">
          {dataset.metadata.description}
        </p>
      )}

      {dataset.metadata?.tags && dataset.metadata.tags.length > 0 && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <Tag className="w-3 h-3 text-muted" />
          {dataset.metadata.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="badge-gray">
              {tag}
            </span>
          ))}
        </div>
      )}

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
            <span className="text-xs font-mono uppercase tracking-wider">Committed</span>
          </div>
          <span className="font-mono text-xs font-bold text-data">{uploadedLabel}</span>
        </div>
        <div className="bg-space-700/40 rounded-lg px-2.5 py-2 flex flex-col gap-0.5">
          <div className="flex items-center gap-1.5 text-muted">
            <FileText className="w-3 h-3" />
            <span className="text-xs font-mono uppercase tracking-wider">
              {dataset.metadata?.license ? "License" : "Format"}
            </span>
          </div>
          <span className="font-mono text-xs text-data font-bold uppercase truncate">
            {dataset.metadata?.license || formatLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-auto pt-1">
        <button onClick={onDownload} className="btn-primary flex-1 justify-center text-xs py-2">
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
          href={explorerUrl}
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
