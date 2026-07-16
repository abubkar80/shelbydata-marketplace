import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useToast } from "../../providers/ToastProvider";
import type { ToastType } from "../../types";

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors: Record<ToastType, string> = {
  success: "border-mint/40 text-mint",
  error: "border-red-500/40 text-red-400",
  info: "border-indigo-500/40 text-indigo-400",
  warning: "border-amber-500/40 text-amber-400",
};

export function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((t) => {
        const Icon = icons[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto animate-slide-up flex items-start gap-3 px-4 py-3 
              bg-space-800/95 backdrop-blur-md border rounded-xl shadow-xl max-w-sm
              ${colors[t.type]}`}
          >
            <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-mono text-data flex-1">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="text-muted hover:text-data transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
