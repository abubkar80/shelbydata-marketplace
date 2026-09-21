import { useState, useRef, useCallback } from "react";
import {
  Upload, FileText, X, CheckCircle, AlertCircle,
  Loader2, ChevronRight, Tag, FileUp, Info,
} from "lucide-react";
import { useShelby } from "../../hooks/useShelby";
import { useToast } from "../../providers/ToastProvider";
import { formatBytes } from "../../lib/shelbyClient";
import { CATEGORY_LABELS, type DatasetCategory, type UploadFormData } from "../../types";

const STEPS = ["Select File", "Add Metadata", "Upload"] as const;

const INITIAL_FORM: UploadFormData = {
  file: null,
  name: "",
  description: "",
  category: "other",
  tags: "",
  license: "MIT",
};

export function UploadForm() {
  const { uploadState, uploadDataset, resetUpload, isConnected } = useShelby();
  const { toast } = useToast();
  const [form, setForm] = useState<UploadFormData>(INITIAL_FORM);
  const [step, setStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Drag & drop ──────────────────────────────────────────
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setForm((f) => ({ ...f, file, name: f.name || file.name }));
      setStep(1);
    }
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, file, name: f.name || file.name }));
      setStep(1);
    }
  };

  // ── Submit ───────────────────────────────────────────────
  const handleUpload = async () => {
    if (!form.file) return;
    if (!isConnected) {
      toast("error", "Please connect your Petra wallet first.");
      return;
    }
    setStep(2);
    const url = await uploadDataset(form.file, {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      license: form.license,
    });
    if (url) {
      toast("success", `"${form.name.trim() || form.file.name}" uploaded to Shelby.`);
    } else {
      toast("error", uploadState.error ?? "Upload failed.");
    }
  };

  const handleReset = () => {
    resetUpload();
    setForm(INITIAL_FORM);
    setStep(0);
  };

  // ── Step indicator ────────────────────────────────────────
  const StepBar = () => (
    <div className="flex items-center gap-2 mb-8">
      {STEPS.map((label, i) => (
        <div key={label} className="flex items-center gap-2 flex-1 last:flex-none">
          <div className={
            i < step ? "step-dot-done" :
            i === step ? "step-dot-active" :
            "step-dot-pending"
          }>
            {i < step ? <CheckCircle className="w-4 h-4" /> : <span>{i + 1}</span>}
          </div>
          <span className={`text-xs font-mono hidden sm:block
            ${i === step ? "text-mint" : i < step ? "text-data" : "text-muted"}`}>
            {label}
          </span>
          {i < STEPS.length - 1 && (
            <ChevronRight className="w-3.5 h-3.5 text-muted flex-shrink-0" />
          )}
        </div>
      ))}
    </div>
  );

  // ── Step 0: File select ───────────────────────────────────
  if (step === 0 || (step === 0 && !form.file)) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        <StepBar />
        <div
          className={`dropzone ${dragging ? "active" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" className="hidden" onChange={onFileChange} />
          <div className="w-16 h-16 rounded-2xl bg-mint/10 border border-mint/30 flex items-center justify-center mb-2">
            <FileUp className="w-7 h-7 text-mint" />
          </div>
          <p className="font-mono text-sm text-data font-bold">Drop your dataset here</p>
          <p className="font-mono text-xs text-muted">or click to browse — CSV, JSON, Parquet, ZIP, Images, etc.</p>
          <span className="badge-gray mt-2">Any file up to 1 GB</span>
        </div>

        {!isConnected && (
          <div className="mt-4 flex items-start gap-3 p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-amber-400">
              Connect your Petra wallet before uploading. Make sure it's switched to{" "}
              <strong>Shelbynet</strong> and you have APT + ShelbyUSD tokens.
            </p>
          </div>
        )}
      </div>
    );
  }

  // ── Step 1: Metadata ──────────────────────────────────────
  if (step === 1) {
    return (
      <div className="max-w-2xl mx-auto animate-slide-up">
        <StepBar />

        {/* Selected file */}
        <div className="card p-4 flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-mint/10 border border-mint/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-mint" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-mono text-sm text-data font-bold truncate">{form.file!.name}</p>
            <p className="font-mono text-xs text-muted">{formatBytes(form.file!.size)}</p>
          </div>
          <button onClick={() => setStep(0)} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="card p-6 flex flex-col gap-5">
          <div>
            <label className="label">Dataset Name *</label>
            <input
              className="input"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. LAION-Africa-NLP-v1"
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              className="input resize-none"
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What's in this dataset? What problem does it solve?"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as DatasetCategory }))}
              >
                {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">License</label>
              <select
                className="input"
                value={form.license}
                onChange={(e) => setForm((f) => ({ ...f, license: e.target.value }))}
              >
                {["MIT", "Apache 2.0", "CC BY 4.0", "CC BY-SA 4.0", "CC0", "Proprietary"].map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Tags (comma separated)</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted pointer-events-none" />
              <input
                className="input pl-9"
                value={form.tags}
                onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                placeholder="nlp, africa, multilingual, bert"
              />
            </div>
          </div>

          <p className="text-xs font-mono text-muted leading-relaxed">
            Name, description, category, tags, and license are packed into the on-chain blob
            name so Marketplace can filter without a separate database. Upload asks for two
            wallet signatures (register, then commit).
          </p>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setStep(0)} className="btn-secondary flex-1 justify-center">
              Back
            </button>
            <button
              onClick={handleUpload}
              disabled={!form.name.trim()}
              className="btn-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload className="w-4 h-4" />
              Upload to Shelby
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step 2: Upload in progress / done / error ─────────────
  const isDone = uploadState.step === "done";
  const isErr = uploadState.step === "error";
  const isRunning = !isDone && !isErr;

  return (
    <div className="max-w-2xl mx-auto animate-slide-up">
      <StepBar />

      <div className="card p-6 flex flex-col gap-6">
        {/* Status header */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center
            ${isDone ? "bg-mint/10 border-mint/30" :
              isErr ? "bg-red-500/10 border-red-500/30" :
              "bg-indigo-500/10 border-indigo-500/30"}`}>
            {isDone ? <CheckCircle className="w-6 h-6 text-mint" /> :
             isErr ? <AlertCircle className="w-6 h-6 text-red-400" /> :
             <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />}
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-data">
              {isDone ? "Upload Complete!" :
               isErr ? "Upload Failed" :
               stepLabel(uploadState.step)}
            </p>
            <p className="font-mono text-xs text-muted mt-0.5">
              {isDone ? `"${form.file?.name}" is live on Shelby Network` :
               isErr ? uploadState.error :
               "Please wait — do not close this tab"}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        {isRunning && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs text-muted">Progress</span>
              <span className="font-mono text-xs text-mint">{uploadState.progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${uploadState.progress}%` }} />
            </div>
          </div>
        )}

        {/* Terminal logs */}
        {uploadState.logs.length > 0 && (
          <div className="terminal max-h-48 overflow-y-auto">
            {uploadState.logs.map((log, i) => (
              <div key={i} className="leading-relaxed">{log}</div>
            ))}
            {isRunning && <span className="cursor-blink" />}
          </div>
        )}

        {/* Tx hash */}
        {uploadState.txHash && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-space-700/40 border border-border">
            <span className="font-mono text-xs text-muted flex-shrink-0">TX</span>
            <span className="font-mono text-xs text-data break-all">{uploadState.txHash}</span>
          </div>
        )}

        {/* Blob URL */}
        {isDone && uploadState.blobUrl && (
          <div>
            <p className="label mb-2">Blob URL</p>
            <a
              href={uploadState.blobUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-mint hover:underline break-all"
            >
              {uploadState.blobUrl}
            </a>
          </div>
        )}

        {/* Actions */}
        {(isDone || isErr) && (
          <div className="flex gap-3">
            <button onClick={handleReset} className="btn-secondary flex-1 justify-center">
              Upload Another
            </button>
            {isDone && (
              <a href="/dashboard" className="btn-primary flex-1 justify-center text-center">
                View My Datasets
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function stepLabel(step: string): string {
  const labels: Record<string, string> = {
    encoding: "Encoding file and generating commitments...",
    registering: "Registering blob on Shelbynet...",
    uploading: "Uploading chunksets to Shelby RPC...",
    committing: "Committing object on-chain...",
  };
  return labels[step] ?? "Processing...";
}
