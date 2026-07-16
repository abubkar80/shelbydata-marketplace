// ── Upload Page ──────────────────────────────────────────────────────────────
import { UploadForm } from "../components/Upload/UploadForm";
import { Dashboard } from "../components/Dashboard/Dashboard";
import { Marketplace } from "../components/Marketplace/Marketplace";

export function UploadPage() {
  return (
    <div className="animate-slide-up">
      <div className="mb-8">
        <h1 className="font-mono text-xl font-bold text-data">Upload Dataset</h1>
        <p className="font-mono text-sm text-muted mt-1">
          Store your AI dataset on the Shelby Network with cryptographic provenance
        </p>
      </div>
      <UploadForm />
    </div>
  );
}

export function DashboardPage() {
  return <Dashboard />;
}

export function MarketplacePage() {
  return <Marketplace />;
}

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
      <span className="font-mono text-6xl font-bold text-gradient mb-4">404</span>
      <p className="font-mono text-sm text-muted">Page not found.</p>
      <a href="/" className="btn-secondary mt-6 text-xs">← Go Home</a>
    </div>
  );
}
