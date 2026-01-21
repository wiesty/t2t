"use client";

import { Button } from "@/components/ui/button";

interface ConfirmExitModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmExitModal({ isOpen, onConfirm, onCancel }: ConfirmExitModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-foreground/20 backdrop-blur-sm flex items-center justify-center p-4 z-60 animate-in fade-in duration-300">
      <div className="bg-card rounded-3xl p-8 max-w-sm w-full shadow-xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 border border-border">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-semibold text-foreground mb-2">
            Leave game?
          </h2>
          <p className="text-muted-foreground">
            Your current game will be lost.
          </p>
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 h-12 rounded-xl text-base"
          >
            Continue playing
          </Button>
          <Button
            onClick={onConfirm}
            className="flex-1 h-12 rounded-xl text-base bg-destructive hover:bg-destructive/90 text-white"
          >
            Leave
          </Button>
        </div>
      </div>
    </div>
  );
}
