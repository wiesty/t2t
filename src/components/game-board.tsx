"use client";

import { cn } from "@/lib/utils";
import { XIcon, OIcon } from "@/components/game-icons";

interface CellData {
  player: "X" | "O" | null;
  moveOrder: number | null;
}

interface GameBoardProps {
  board: CellData[];
  onCellClick: (index: number) => void;
  winningLine: number[] | null;
  fadingIndices: number[];
  oldestMoveIndices: { X: number | null; O: number | null };
  currentPlayer: "X" | "O";
}

export function GameBoard({ board, onCellClick, winningLine, fadingIndices, oldestMoveIndices, currentPlayer }: GameBoardProps) {
  // Determine the winner based on the winning line
  const winner = winningLine && board[winningLine[0]].player;
  
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] aspect-square">
      {board.map((cell, index) => {
        const isFading = fadingIndices.includes(index);
        const isWinning = winningLine?.includes(index);
        const isOldest = (cell.player === "X" && oldestMoveIndices.X === index) || (cell.player === "O" && oldestMoveIndices.O === index);
        // Only show oldest indicator when it's that player's turn
        const isOldestAndActive = (cell.player === "X" && oldestMoveIndices.X === index && currentPlayer === "X") || 
                (cell.player === "O" && oldestMoveIndices.O === index && currentPlayer === "O");
        
        return (
          <button
            key={index}
            onClick={() => onCellClick(index)}
            className={cn(
              "aspect-square rounded-2xl bg-card border-2 border-border",
              "flex items-center justify-center",
              "transition-all duration-300 ease-out",
              "active:scale-95 hover:border-primary/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/50",
              cell.player === null && "hover:bg-muted cursor-pointer",
              cell.player !== null && "cursor-default",
              isOldestAndActive && "pointer-events-none",
              isWinning && winner === "X" && "ring-4 ring-primary/50 scale-105 bg-primary/5",
              isWinning && winner === "O" && "ring-4 ring-o/50 scale-105 bg-o/5"
            )}
            disabled={cell.player !== null}
            aria-label={cell.player ? `Cell ${index + 1}: ${cell.player}` : `Empty cell ${index + 1}`}
          >
            {cell.player === "X" && (
              <div className="animate-in zoom-in-50 duration-200">
                <XIcon isWinning={isWinning} isFading={isFading} isOldest={isOldestAndActive} />
              </div>
            )}
            {cell.player === "O" && (
              <div className="animate-in zoom-in-50 duration-200">
                <OIcon isWinning={isWinning} isFading={isFading} isOldest={isOldestAndActive} />
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}
