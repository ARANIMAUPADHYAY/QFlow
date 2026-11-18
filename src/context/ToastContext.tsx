import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, Info, AlertTriangle, X } from "lucide-react";
import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

type ToastType = "success" | "info" | "warning" | "error";

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

interface ToastContextValue {
  show: (toast: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const icons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  info: Info,
  warning: AlertTriangle,
  error: AlertTriangle,
};

const styles: Record<ToastType, string> = {
  success: "bg-sage-deep text-paper",
  info: "bg-dust text-ink",
  warning: "bg-mustard text-ink",
  error: "bg-red-700 text-paper",
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const show = useCallback((toast: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const success = useCallback((title: string, message?: string) => show({ type: "success", title, message }), [show]);
  const info = useCallback((title: string, message?: string) => show({ type: "info", title, message }), [show]);
  const warning = useCallback((title: string, message?: string) => show({ type: "warning", title, message }), [show]);

  const dismiss = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastContext.Provider value={{ show, success, info, warning }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex flex-col gap-2" aria-live="polite">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = icons[t.type];
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 48 }}
                transition={{ duration: 0.25 }}
                className={`pointer-events-auto flex max-w-sm items-start gap-3 rounded-2xl px-4 py-3 shadow-soft ${styles[t.type]}`}
              >
                <Icon size={18} className="mt-0.5 shrink-0" aria-hidden />
                <div className="flex-1 text-sm">
                  <p className="font-medium">{t.title}</p>
                  {t.message && <p className="mt-0.5 opacity-80">{t.message}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => dismiss(t.id)}
                  className="shrink-0 opacity-70 hover:opacity-100"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
