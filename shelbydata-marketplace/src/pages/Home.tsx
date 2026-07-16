import { Link } from "react-router-dom";
import {
  Database, Upload, Zap, Shield, Globe, ChevronRight,
  BarChart2, Lock, Cpu
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Hot Storage, Instant Access",
    desc: "Shelby's pay-per-read model ensures storage providers deliver top-tier read performance — perfect for AI training loops.",
    color: "text-mint",
    bg: "bg-mint/10 border-mint/20",
  },
  {
    icon: Shield,
    title: "Cryptographic Provenance",
    desc: "Every blob read returns a cryptographic proof. Verify data origin, consent, and integrity — critical for regulated AI workflows.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: Globe,
    title: "Decentralized & Censorship-Resistant",
    desc: "No AWS. No GCP. Your datasets live on a distributed network of storage providers with 70% lower egress fees.",
    color: "text-amber-400",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: BarChart2,
    title: "Tokenized Monetization",
    desc: "Contributors earn ShelbyUSD based on dataset reads. Transparent, on-chain, and settled on Aptos.",
    color: "text-teal-400",
    bg: "bg-teal-400/10 border-teal-400/20",
  },
  {
    icon: Lock,
    title: "Aptos Security",
    desc: "Coordination and settlement powered by Aptos: 600ms finality, 30k TPS, $0.000005 gas — without compromising scalability.",
    color: "text-mint",
    bg: "bg-mint/10 border-mint/20",
  },
  {
    icon: Cpu,
    title: "AI-Native Infrastructure",
    desc: "Purpose-built for AI pipelines — stream datasets directly into training jobs without cloud egress bottlenecks.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
];

const HOW_IT_WORKS = [
  {
    num: "01",
    title: "Connect Wallet",
    desc: "Install Petra wallet, switch to Shelbynet, and fund with APT + ShelbyUSD from the faucet.",
  },
  {
    num: "02",
    title: "Upload Dataset",
    desc: "Drop your file. We encode it, register it on-chain, and push it to Shelby storage providers in one flow.",
  },
  {
    num: "03",
    title: "Share & Earn",
    desc: "Share your dataset URL. Every read by researchers and AI teams earns you ShelbyUSD automatically.",
  },
];

export function Home() {
  return (
    <div className="flex flex-col gap-20 animate-fade-in">

      {/* Hero */}
      <section className="relative text-center pt-10 pb-4">
        {/* Glow blobs */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px]
                          bg-gradient-radial from-mint/10 via-transparent to-transparent rounded-full blur-3xl" />
          <div className="absolute top-20 left-1/4 w-[300px] h-[200px]
                          bg-gradient-radial from-indigo-500/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse-slow" />
          <span className="font-mono text-xs text-mint">Live on Shelbynet Testnet</span>
        </div>

        <h1 className="font-mono text-3xl sm:text-5xl font-bold leading-tight mb-5">
          <span className="text-data">The Decentralized</span>
          <br />
          <span className="text-gradient">AI Dataset Marketplace</span>
        </h1>

        <p className="font-sans text-base text-muted max-w-xl mx-auto leading-relaxed mb-8">
          Store, discover, and monetize high-quality AI datasets on the Shelby Network.
          Built on Aptos for speed, security, and transparent incentives.
        </p>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Link to="/upload" className="btn-primary gap-2 px-6 py-3 text-sm">
            <Upload className="w-4 h-4" />
            Upload Dataset
          </Link>
          <Link to="/marketplace" className="btn-secondary gap-2 px-6 py-3 text-sm">
            <Database className="w-4 h-4" />
            Browse Marketplace
          </Link>
        </div>

        {/* Mini stats */}
        <div className="flex items-center justify-center gap-8 mt-10 flex-wrap">
          {[
            { value: "70%", label: "Lower egress fees" },
            { value: "600ms", label: "Aptos finality" },
            { value: "30k", label: "TPS capacity" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-mono text-xl font-bold glow-text">{s.value}</p>
              <p className="font-mono text-xs text-muted mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section>
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-mint uppercase tracking-widest mb-2">Process</p>
          <h2 className="font-mono text-xl font-bold text-data">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.num} className="card p-6 relative overflow-hidden group animate-slide-up"
                 style={{ animationDelay: `${i * 100}ms` }}>
              <span className="absolute top-4 right-4 font-mono text-4xl font-bold text-space-700
                               group-hover:text-space-600 transition-colors select-none">
                {step.num}
              </span>
              <h3 className="font-mono text-sm font-bold text-data mb-2">{step.title}</h3>
              <p className="font-mono text-xs text-muted leading-relaxed">{step.desc}</p>
              {i < HOW_IT_WORKS.length - 1 && (
                <ChevronRight className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-border
                                         hidden md:block z-10" />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section>
        <div className="text-center mb-10">
          <p className="font-mono text-xs text-mint uppercase tracking-widest mb-2">Why ShelbyData</p>
          <h2 className="font-mono text-xl font-bold text-data">Built for Serious AI Workloads</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card p-5 animate-slide-up"
                 style={{ animationDelay: `${i * 80}ms` }}>
              <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg}`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-mono text-sm font-bold text-data mb-2">{f.title}</h3>
              <p className="font-mono text-xs text-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative">
        <div className="card p-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-radial from-mint/5 via-transparent to-transparent" />
          </div>
          <Database className="w-10 h-10 text-mint mx-auto mb-4" />
          <h2 className="font-mono text-xl font-bold text-data mb-3">
            Start Building on Shelby Today
          </h2>
          <p className="font-mono text-sm text-muted max-w-md mx-auto mb-7 leading-relaxed">
            Join the testnet, upload your datasets, and become part of the
            decentralized AI data ecosystem.
          </p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link to="/upload" className="btn-primary gap-2">
              <Upload className="w-4 h-4" />
              Upload Your First Dataset
            </Link>
            <a href="https://docs.shelby.xyz" target="_blank" rel="noopener noreferrer"
               className="btn-secondary gap-2">
              Read the Docs
              <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
