"use client";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(15,27,45,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, backdropFilter: "blur(2px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{ background: "var(--white)", borderRadius: "var(--radius-lg)", width: "100%", maxWidth: 540, maxHeight: "90vh", overflow: "hidden", boxShadow: "var(--shadow-lg)", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px", borderBottom: "1px solid var(--border)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ border: "none", background: "none", padding: 4, borderRadius: 6, color: "var(--slate)", cursor: "pointer" }}><X size={18} /></button>
        </div>
        <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
      </div>
    </div>
  );
}
