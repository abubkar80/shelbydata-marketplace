import { useState } from "react";
import { Search, Filter, Database, Loader2 } from "lucide-react";
import { useShelby } from "../../hooks/useShelby";
import { useToast } from "../../providers/ToastProvider";
import { DatasetCard } from "./DatasetCard";
import { CATEGORY_LABELS, type DatasetCategory, type Dataset } from "../../types";

const ALL_CATS = Object.entries(CATEGORY_LABELS) as [DatasetCategory, string][];

export function Marketplace() {
  const { fetchDatasets, downloadBlob } = useShelby();
  const { toast } = useToast();
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [searchAddr, setSearchAddr] = useState("");
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState<DatasetCategory | "all">("all");

  const handleSearch = async () => {
    const addr = searchAddr.trim();
    if (!addr) {
      toast("warning", "Enter an Aptos address to browse.");
      return;
    }
    setLoading(true);
    try {
      const results = await fetchDatasets(addr);
      setDatasets(results);
      setSearched(true);
      if (results.length === 0) {
        toast("info", "No datasets found for that address.");
      }
    } catch {
      toast("error", "Failed to fetch datasets. Check the address.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = datasets.filter((d) => {
    const matchesQ =
      !query || d.blobName.toLowerCase().includes(query.toLowerCase());
    const matchesCat = catFilter === "all";
    return matchesQ && matchesCat;
  });

  return (
    <div className="animate-slide-up">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="font-mono text-xl font-bold text-data">Dataset Marketplace</h1>
        <p className="font-mono text-sm text-muted mt-1">
          Browse datasets stored on the Shelby Network by any uploader address
        </p>
      </div>

      {/* Address search bar */}
      <div className="card p-5 mb-6">
        <label className="label mb-3">Search by Uploader Address</label>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
            <input
              className="input pl-9"
              value={searchAddr}
              onChange={(e) => setSearchAddr(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="0x1234...abcd — Aptos wallet address"
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary gap-2 flex-shrink-0"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Browse
          </button>
        </div>
        <p className="font-mono text-xs text-muted mt-3">
          💡 Try your own address after uploading, or ask a researcher to share theirs.
        </p>
      </div>

      {/* Filter bar */}
      {searched && datasets.length > 0 && (
        <div className="flex items-center gap-3 flex-wrap mb-6">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
            <input
              className="input pl-9 py-2 text-xs"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by filename..."
            />
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <button
              onClick={() => setCatFilter("all")}
              className={`badge cursor-pointer transition-all ${catFilter === "all" ? "badge-mint" : "badge-gray"}`}
            >
              All
            </button>
            {ALL_CATS.slice(0, 5).map(([k, v]) => (
              <button
                key={k}
                onClick={() => setCatFilter(k === catFilter ? "all" : k)}
                className={`badge cursor-pointer transition-all ${catFilter === k ? "badge-indigo" : "badge-gray"}`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Filter className="w-3.5 h-3.5 text-muted" />
            <span className="font-mono text-xs text-muted">
              {filtered.length} dataset{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-mint animate-spin" />
            <p className="font-mono text-sm text-muted">Querying Shelby Network...</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!loading && !searched && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-space-700/60 border border-dashed border-border
                          flex items-center justify-center mb-6">
            <Search className="w-9 h-9 text-muted" />
          </div>
          <h3 className="font-mono text-base font-bold text-data mb-2">Browse the Marketplace</h3>
          <p className="font-mono text-xs text-muted max-w-xs leading-relaxed">
            Enter an Aptos wallet address above to browse all datasets uploaded
            by that researcher or developer.
          </p>
        </div>
      )}

      {/* Results grid */}
      {!loading && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((ds, i) => (
            <div key={ds.blobName + i} style={{ animationDelay: `${i * 60}ms` }}>
              <DatasetCard
                dataset={ds}
                onDownload={() => {
                  downloadBlob(ds.downloadUrl, ds.blobName)
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
