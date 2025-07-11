import React from "react";

import { cn } from "@/lib/utils";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RainbowButton({
  children,
  className,
  ...props
}: RainbowButtonProps) {
  return (
    <div className="relative p-[2px] rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-rainbow">
      <button
        className={cn(
          "relative inline-flex h-11 w-full cursor-pointer items-center justify-center rounded-xl px-8 py-2 font-medium text-white transition-all duration-200 hover:scale-105 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
          
          // Dark background inside the rainbow border
          "bg-slate-900/95 hover:bg-slate-800/95",

          className,
        )}
        {...props}
      >
        {children}
      </button>
    </div>
  );
} 