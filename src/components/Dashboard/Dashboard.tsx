import { useEffect, useState } from "react";
import { RefreshCw, Upload, Database, HardDrive, Clock } from "lucide-react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useShelby } from "../../hooks/useShelby";
import { useToast } from "../../providers/ToastProvider";
import { DatasetCard } from "../Marketplace/DatasetCard";
import { formatBytes } from "../../lib/shelbyClient";
import type { Dataset } from "../../types";
import { Link } from "react-router-dom";

export function Dashboard() {
  const { account, connected } = useWallet();
  const { fetchDatasets, downloadBlob } = useShelby();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const load = async () => {
    if (!account?.address) return;
    setLoading(true);
    try {
      const result = await fetchDatasets(account.address);
      setDatasets(result);
    } catch {
      toast("error", "Failed to fetch your datasets.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  useEffect(() => {
    if (connected && account?.address) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, account?.address]);

  const totalSize = datasets.reduce((acc, d) => acc + d.size, 0);

  if (!connected) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-2xl bg-space-700/60 border border-border flex items-center justify-center mb-6">
          <Database className="w-9 h-9 text-muted" />
        </div>
        <h2 className="font-mono text-lg font-bold text-data mb-2">Connect Your Wallet</h2>
        <p className="font-mono text-sm text-muted max-w-xs">
          Connect your Petra wallet to view and manage your uploaded datasets.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-mono text-xl font-bold text-data">My Datasets</h1>
          <p className="font-mono text-sm text-muted mt-1">
            Manage your uploads on the Shelby Network
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={load}
            disabled={loading}
            className="btn-ghost border border-border rounded-lg px-3 py-2 gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="text-xs">Refresh</span>
          </button>
          <Link to="/upload" className="btn-primary text-xs">
            <Upload className="w-3.5 h-3.5" />
            Upload New
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="stat-card">
          <span className="stat-label">Total Datasets</span>
          <span className="stat-value text-gradient">{datasets.length}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted mb-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span className="stat-label">Total Size</span>
          </div>
          <span className="stat-value">{formatBytes(totalSize)}</span>
        </div>
        <div className="stat-card">
          <div className="flex items-center gap-2 text-muted mb-1">
            <Clock className="w-3.5 h-3.5" />
            <span className="stat-label">Committed</span>
          </div>
          <span className="stat-value">{datasets.length}</span>
        </div>
      </div>

      {/* Dataset grid */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-4">
            <RefreshCw className="w-8 h-8 text-mint animate-spin" />
            <p className="font-mono text-sm text-muted">Fetching from Shelby Network...</p>
          </div>
        </div>
      )}

      {!loading && searched && datasets.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-space-700/60 border border-dashed border-border
                          flex items-center justify-center mb-5">
            <Upload className="w-7 h-7 text-muted" />
          </div>
          <h3 className="font-mono text-sm font-bold text-data mb-2">No datasets yet</h3>
          <p className="font-mono text-xs text-muted mb-5 max-w-xs">
            Upload your first dataset to the Shelby Network. Listings are public blobs under
            your wallet address.
          </p>
          <Link to="/upload" className="btn-primary text-xs">
            <Upload className="w-3.5 h-3.5" />
            Upload Dataset
          </Link>
        </div>
      )}

      {!loading && datasets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {datasets.map((ds, i) => (
            <div key={ds.blobName + i} style={{ animationDelay: `${i * 60}ms` }}>
              <DatasetCard
                dataset={ds}
                onDownload={() => {
                  downloadBlob(ds.downloadUrl, ds.fileName || ds.metadata?.name || ds.blobName)
                    .then(() => toast("success", `Downloaded "${ds.blobName}"`))
                    .catch(() => toast("error", "Download failed."));
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
