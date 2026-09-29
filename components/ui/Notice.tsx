"use client";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

export function Notice({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8 }}
          className="fixed right-4 bottom-4 z-[1100] flex max-w-sm items-center gap-3 rounded-sm border border-olive/30 bg-cream px-4 py-3 text-sm shadow-xl"
        >
          <CheckCircle2 className="shrink-0 text-olive" size={20} aria-hidden />
          <span>{message}</span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar aviso"
            className="ml-2 rounded-full p-1 hover:bg-ink/10"
          >
            <X size={16} aria-hidden />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
