"use client";

import { cn } from "@/lib/utils";

interface IconProps {
  className?: string;
  isWinning?: boolean;
  isFading?: boolean;
  isOldest?: boolean;
}

export function XIcon({ className, isWinning, isFading, isOldest }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300",
        isWinning && "scale-110",
        isFading && "opacity-40 scale-90",
        isOldest && "animate-pulse-oldest",
        className
      )}
      fill="none"
      strokeLinecap="round"
      strokeWidth="12"
    >
      <line
        x1="20"
        y1="20"
        x2="80"
        y2="80"
        className="stroke-x"
        style={{
          strokeDasharray: 85,
          strokeDashoffset: 85,
          animation: "drawLine 0.3s ease-out forwards",
        }}
      />
      <line
        x1="80"
        y1="20"
        x2="20"
        y2="80"
        className="stroke-x"
        style={{
          strokeDasharray: 85,
          strokeDashoffset: 85,
          animation: "drawLine 0.3s ease-out 0.1s forwards",
        }}
      />
    </svg>
  );
}

export function OIcon({ className, isWinning, isFading, isOldest }: IconProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={cn(
        "w-16 h-16 sm:w-20 sm:h-20 transition-all duration-300",
        isWinning && "scale-110",
        isFading && "opacity-40 scale-90",
        isOldest && "animate-pulse-oldest",
        className
      )}
      fill="none"
      strokeLinecap="round"
      strokeWidth="12"
    >
      <circle
        cx="50"
        cy="50"
        r="32"
        className="stroke-o"
        style={{
          strokeDasharray: 201,
          strokeDashoffset: 201,
          animation: "drawCircle 0.4s ease-out forwards",
        }}
      />
    </svg>
  );
}
