import { Database, Github, Twitter, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-7 h-7 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-mint" />
              </div>
              <span className="font-mono text-sm font-bold">
                <span className="text-data">Shelby</span>
                <span className="glow-text">Data</span>
              </span>
            </div>
            <p className="text-xs font-mono text-muted leading-relaxed max-w-xs">
              Browser dapp for uploading and browsing AI dataset blobs on Shelby / Shelbynet
              with Petra. Discovery is by wallet address — this is not a paid marketplace.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://x.com/shelbyserves" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-lg bg-space-700 border border-border flex items-center justify-center
                            hover:border-mint/40 hover:text-mint text-muted transition-all duration-200">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="https://discord.com/invite/shelbyserves" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-lg bg-space-700 border border-border flex items-center justify-center
                            hover:border-mint/40 hover:text-mint text-muted transition-all duration-200">
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <a href="https://github.com/abubkar80/shelbydata-marketplace" target="_blank" rel="noopener noreferrer"
                 className="w-8 h-8 rounded-lg bg-space-700 border border-border flex items-center justify-center
                            hover:border-mint/40 hover:text-mint text-muted transition-all duration-200">
                <Github className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="label mb-3">Platform</p>
            <div className="flex flex-col gap-2">
              {[
                { to: "/marketplace", label: "Browse Datasets" },
                { to: "/upload", label: "Upload Dataset" },
                { to: "/dashboard", label: "My Datasets" },
              ].map((l) => (
                <Link key={l.to} to={l.to}
                  className="text-xs font-mono text-muted hover:text-mint transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <p className="label mb-3">Resources</p>
            <div className="flex flex-col gap-2">
              {[
                { href: "https://docs.shelby.xyz", label: "Shelby Docs" },
                { href: "https://explorer.shelby.xyz/shelbynet", label: "Explorer" },
                { href: "https://geomi.dev", label: "Get API Keys" },
                { href: "https://discord.com/invite/shelbyserves", label: "Discord" },
              ].map((l) => (
                <a key={l.href} href={l.href} target="_blank" rel="noopener noreferrer"
                   className="text-xs font-mono text-muted hover:text-mint transition-colors flex items-center gap-1">
                  {l.label}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-mono text-muted">
            © 2026 ShelbyData — Built on Aptos &amp; Shelby Network (Testnet)
          </p>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-slow" />
            <span className="text-xs font-mono text-mint">Shelbynet Live</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
