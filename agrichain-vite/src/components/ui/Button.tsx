import React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "px-6 py-3 rounded-md font-bold transition transform active:scale-[0.99] w-full text-center min-h-[48px]",
        variant === "primary" && "bg-primary text-on-primary hover:bg-opacity-90",
        variant === "secondary" && "bg-secondary text-on-secondary shadow-md hover:bg-opacity-90",
        variant === "tertiary" && "bg-transparent border-[1.5px] border-tertiary text-tertiary hover:bg-surface-variant",
        className
      )}
      {...props}
    />
  );
}
