import React from "react";
import { cn } from "../../lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Input({ label, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-bold text-on-surface mb-1">{label}</label>
      <input
        className={cn(
          "w-full h-12 border-1.5 border-outline-variant rounded-md px-3 text-on-surface focus:outline-none focus:border-2 focus:border-primary focus:ring-1 focus:ring-primary",
          className
        )}
        {...props}
      />
    </div>
  );
}
