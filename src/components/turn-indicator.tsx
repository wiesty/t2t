"use client";

import { XIcon, OIcon } from "@/components/game-icons";

interface TurnIndicatorProps {
  currentPlayer: "X" | "O";
  willRemoveOldest: boolean;
}

export function TurnIndicator({ currentPlayer, willRemoveOldest }: TurnIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center justify-center px-6 py-3 bg-card rounded-full border border-border shadow-sm">
        <div aria-label={`Current turn: Player ${currentPlayer}`}>
          {currentPlayer === "X" ? (
            <XIcon className="w-8 h-8" />
          ) : (
            <OIcon className="w-8 h-8" />
          )}
        </div>
      </div>
      {willRemoveOldest ? (
        <p className="text-sm text-muted-foreground animate-pulse-text">
          Oldest gets removed
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">Your turn</p>
      )}
    </div>
  );
}
