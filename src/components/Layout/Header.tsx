import { Link, useLocation } from "react-router-dom";
import { Database, Menu, X } from "lucide-react";
import { useState } from "react";
import { WalletButton } from "../WalletButton";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/marketplace", label: "Marketplace" },
  { to: "/dashboard", label: "My Datasets" },
  { to: "/upload", label: "Upload" },
];

export function Header() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-space-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-mint/10 border border-mint/30 flex items-center justify-center
                          group-hover:bg-mint/20 group-hover:border-mint/60 transition-all duration-200">
            <Database className="w-4 h-4 text-mint" />
          </div>
          <div>
            <span className="font-mono text-sm font-bold text-data">Shelby</span>
            <span className="font-mono text-sm font-bold glow-text">Data</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`px-3.5 py-2 rounded-lg text-sm font-mono transition-all duration-200
                ${location.pathname === item.to
                  ? "text-mint bg-mint/10 border border-mint/20"
                  : "text-muted hover:text-data hover:bg-space-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Wallet + mobile toggle */}
        <div className="flex items-center gap-3">
          <WalletButton />
          <button
            className="md:hidden btn-ghost p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-space-900/95 px-4 py-3 flex flex-col gap-1 animate-fade-in">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`px-4 py-2.5 rounded-lg text-sm font-mono transition-colors
                ${location.pathname === item.to
                  ? "text-mint bg-mint/10"
                  : "text-muted hover:text-data hover:bg-space-700"
                }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
