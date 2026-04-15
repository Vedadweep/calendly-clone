"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

import { MotionButton, interactionTransition } from "@/app/motion-provider";

type ToastTone = "success" | "error" | "info";

type Toast = {
  id: number;
  title: string;
  tone: ToastTone;
};

type ConfirmOptions = {
  title?: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "default";
};

type ToastContextValue = {
  showToast: (title: string, tone?: ToastTone) => void;
};

type ConfirmContextValue = {
  confirm: (options: ConfirmOptions) => Promise<boolean>;
};

const ToastContext = createContext<ToastContextValue | null>(null);
const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [confirmState, setConfirmState] = useState<{
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
  } | null>(null);
  const nextToastId = useRef(1);

  const dismissToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (title: string, tone: ToastTone = "success") => {
      const id = nextToastId.current++;
      setToasts((current) => [...current, { id, title, tone }]);

      window.setTimeout(() => {
        dismissToast(id);
      }, 2800);
    },
    [dismissToast],
  );

  const confirm = useCallback((options: ConfirmOptions) => {
    return new Promise<boolean>((resolve) => {
      setConfirmState({ options, resolve });
    });
  }, []);

  const toastValue = useMemo(() => ({ showToast }), [showToast]);
  const confirmValue = useMemo(() => ({ confirm }), [confirm]);

  return (
    <ToastContext.Provider value={toastValue}>
      <ConfirmContext.Provider value={confirmValue}>
        {children}

        <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[90] flex justify-center sm:justify-end">
          <div className="flex w-full max-w-sm flex-col gap-3">
            <AnimatePresence initial={false}>
              {toasts.map((toast) => (
                <motion.div
                  key={toast.id}
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={interactionTransition}
                  className="pointer-events-auto"
                >
                  <div
                    className={`rounded-[24px] border px-4 py-4 shadow-[var(--shadow-float)] backdrop-blur-xl ${
                      toast.tone === "error"
                        ? "border-red-200/80 bg-white/96 text-red-700 dark:border-red-500/30 dark:bg-slate-900/96 dark:text-red-200"
                        : toast.tone === "info"
                          ? "border-blue-200/80 bg-white/96 text-blue-700 dark:border-blue-500/30 dark:bg-slate-900/96 dark:text-blue-200"
                          : "border-emerald-200/80 bg-white/96 text-emerald-700 dark:border-emerald-500/30 dark:bg-slate-900/96 dark:text-emerald-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-current/10">
                        <ToastIcon />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold">{toast.title}</p>
                      </div>
                      <MotionButton
                        type="button"
                        onClick={() => dismissToast(toast.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-2xl text-current/65 transition hover:bg-black/5 hover:text-current dark:hover:bg-white/8"
                        aria-label="Dismiss toast"
                      >
                        <CloseIcon />
                      </MotionButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {confirmState ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={interactionTransition}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={interactionTransition}
                className="w-full max-w-md rounded-[30px] border border-white/80 bg-white p-6 shadow-[var(--shadow-float)] dark:border-slate-700 dark:bg-slate-900 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-red-50 text-red-600 dark:bg-red-500/12 dark:text-red-200">
                  <WarningIcon />
                </div>
                <h2 className="mt-5 text-2xl font-semibold text-slate-950 dark:text-slate-50">
                  {confirmState.options.title ?? "Are you sure?"}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                  {confirmState.options.description}
                </p>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <MotionButton
                    type="button"
                    onClick={() => {
                      confirmState.resolve(false);
                      setConfirmState(null);
                    }}
                    className="button-secondary px-5 py-3 text-sm font-semibold"
                  >
                    {confirmState.options.cancelLabel ?? "Cancel"}
                  </MotionButton>
                  <MotionButton
                    type="button"
                    onClick={() => {
                      confirmState.resolve(true);
                      setConfirmState(null);
                    }}
                    className={`px-5 py-3 text-sm font-semibold ${
                      confirmState.options.tone === "danger"
                        ? "button-danger"
                        : "button-primary"
                    }`}
                  >
                    {confirmState.options.confirmLabel ?? "Delete"}
                  </MotionButton>
                </div>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </ConfirmContext.Provider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within FeedbackProvider.");
  }

  return context;
}

export function useConfirm() {
  const context = useContext(ConfirmContext);

  if (!context) {
    throw new Error("useConfirm must be used within FeedbackProvider.");
  }

  return context;
}

function ToastIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 13 4 4L19 7" />
    </svg>
  );
}

function WarningIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
      <path d="M10.3 3.4 2.9 16.2A2 2 0 0 0 4.6 19h14.8a2 2 0 0 0 1.7-2.8L13.7 3.4a2 2 0 0 0-3.4 0Z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 6 12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}
