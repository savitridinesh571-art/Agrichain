import React from "react";
import { cn } from "../../lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("bg-surface border border-outline shadow-[0_1px_3px_rgba(27,67,50,0.05)] rounded-xl overflow-hidden", className)}>
      {children}
    </div>
  );
}
