"use client";
import { memo, useEffect, useRef } from "react";
import { FaTimes } from "react-icons/fa";

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({
  open,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  const confirmBtnRef = useRef<HTMLButtonElement>(null);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  // Focus confirm button when modal opens
  useEffect(() => {
    if (open) confirmBtnRef.current?.focus();
  }, [open]);

  if (!open) return null;

  const variantColors = {
    danger:  { accent: "#e05252", bg: "#2e0d0d", border: "#5c1a1a", text: "#e05252" },
    warning: { accent: "#e0a952", bg: "#2e1d0d", border: "#5c3a1a", text: "#e0a952" },
    info:    { accent: "#5299e0", bg: "#0d1a2e", border: "#1a3a5c", text: "#5299e0" },
  };
  const c = variantColors[variant];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onCancel}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 1000,
          animation: "fadeIn 0.15s ease",
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1001,
          background: "#111",
          border: `1px solid #2a2a2a`,
          borderRadius: "16px",
          padding: "2rem",
          width: "min(420px, 90vw)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8)",
          animation: "slideUp 0.18s ease",
          fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
        }}
      >
        {/* Close X */}
        <button
          onClick={onCancel}
          title="Close"
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "#555",
            cursor: "pointer",
            fontSize: "0.9rem",
            padding: "4px",
            lineHeight: 1,
            transition: "color 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#999")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
        >
          <FaTimes />
        </button>

        {/* Icon circle */}
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: c.bg,
            border: `1px solid ${c.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "1.25rem",
            fontSize: "1.3rem",
          }}
        >
          {variant === "danger" ? "🗑️" : variant === "warning" ? "⚠️" : "ℹ️"}
        </div>

        <h2
          id="modal-title"
          style={{
            margin: "0 0 0.5rem",
            fontSize: "1.15rem",
            fontWeight: 700,
            color: "#e8e3dc",
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: "0 0 1.75rem",
            fontSize: "0.88rem",
            color: "#888",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              background: "#1a1a1a",
              border: "1px solid #2e2e2e",
              color: "#aaa",
              borderRadius: "8px",
              padding: "9px 20px",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#222")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1a1a1a")}
          >
            {cancelLabel}
          </button>

          <button
            ref={confirmBtnRef}
            onClick={onConfirm}
            style={{
              background: c.bg,
              border: `1px solid ${c.border}`,
              color: c.text,
              borderRadius: "8px",
              padding: "9px 20px",
              fontSize: "0.88rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.filter = "brightness(1.15)")}
            onMouseLeave={(e) => (e.currentTarget.style.filter = "brightness(1)")}
          >
            {confirmLabel}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translate(-50%, calc(-50% + 16px)) } to { opacity: 1; transform: translate(-50%, -50%) } }
      `}</style>
    </>
  );
};

export default memo(ConfirmModal);