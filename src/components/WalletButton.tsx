import { useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Wallet, ChevronDown, LogOut, Copy, Check } from "lucide-react";
import { truncateAddress } from "../lib/shelbyClient";
import { toAddressString } from "../lib/address";

export function WalletButton() {
  const { account, connected, connect, disconnect, wallets } = useWallet();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!account?.address) return;
    navigator.clipboard.writeText(toAddressString(account.address));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!connected) {
    return (
      <div className="relative">
        <button
          className="btn-primary text-xs gap-2"
          onClick={() => setOpen(!open)}
        >
          <Wallet className="w-3.5 h-3.5" />
          Connect Wallet
        </button>

        {open && (
          <div className="absolute right-0 top-full mt-2 w-56 card p-2 z-50 animate-fade-in">
            <p className="text-xs font-mono text-muted px-3 py-2 uppercase tracking-widest">
              Select Wallet
            </p>
            {wallets && wallets.length > 0 ? (
              wallets.map((wallet) => (
                <button
                  key={wallet.name}
                  onClick={() => {
                    connect(wallet.name);
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                             hover:bg-space-700 transition-colors text-left"
                >
                  {wallet.icon && (
                    <img src={wallet.icon} alt={wallet.name} className="w-5 h-5 rounded" />
                  )}
                  <span className="text-sm font-mono text-data">{wallet.name}</span>
                </button>
              ))
            ) : (
              <div className="px-3 py-3">
                <p className="text-xs font-mono text-muted mb-2">
                  No wallets detected.
                </p>
                <a
                  href="https://petra.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-mint font-mono hover:underline"
                >
                  → Install Petra Wallet
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-space-700/60
                   border border-border hover:border-mint/40 transition-all duration-200"
      >
        <span className="w-2 h-2 rounded-full bg-mint animate-pulse-slow" />
        <span className="font-mono text-xs text-data">
          {truncateAddress(account?.address ?? "")}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-muted transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-60 card p-2 z-50 animate-fade-in">
          <div className="px-3 py-2 border-b border-border mb-1">
            <p className="text-xs font-mono text-muted">Connected Address</p>
            <p className="text-xs font-mono text-data mt-0.5 break-all">
              {toAddressString(account?.address)}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                       hover:bg-space-700 transition-colors text-left"
          >
            {copied ? (
              <Check className="w-4 h-4 text-mint" />
            ) : (
              <Copy className="w-4 h-4 text-muted" />
            )}
            <span className="text-sm font-mono text-data">
              {copied ? "Copied!" : "Copy Address"}
            </span>
          </button>
          <button
            onClick={() => { disconnect(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg
                       hover:bg-red-500/10 transition-colors text-left group"
          >
            <LogOut className="w-4 h-4 text-muted group-hover:text-red-400 transition-colors" />
            <span className="text-sm font-mono text-muted group-hover:text-red-400 transition-colors">
              Disconnect
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
