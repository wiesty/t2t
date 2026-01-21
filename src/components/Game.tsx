"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GameBoard } from "@/components/game-board";
import { TurnIndicator } from "@/components/turn-indicator";
import { SettingsModal } from "@/components/settings-modal";
import { WinnerModal } from "@/components/winner-modal";
import { ConfirmExitModal } from "@/components/confirm-exit-modal";
import { ThemeToggle } from "@/components/theme-toggle";
import { InstallPrompt } from "@/components/install-prompt";
import { Footer } from "@/components/footer";
import { useTicTacToe } from "@/hooks/use-tic-tac-toe";
import { XIcon, OIcon } from "@/components/game-icons";
import { Settings } from "lucide-react";

type GameState = "landing" | "playing";

// LocalStorage Helpers
const STORAGE_KEY = "t2t-settings";

interface StoredSettings {
  showPhoneInput: boolean;
  requirePhoneInput: boolean;
  askForName: boolean;
  riggedMode: boolean;
}

const loadSettings = (): Partial<StoredSettings> => {
  if (typeof window === "undefined") return {};
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const saveSettings = (settings: StoredSettings) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage errors
  }
};

export default function Game() {
  const [gameState, setGameState] = useState<GameState>("landing");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);
  
  // Load settings from localStorage on mount (with correct defaults)
  const [showPhoneInput, setShowPhoneInput] = useState(true);
  const [requirePhoneInput, setRequirePhoneInput] = useState(true); // No skip button by default
  const [askForName, setAskForName] = useState(false);
  const [riggedMode, setRiggedMode] = useState(false);

  // Session-only storage for phone numbers (cleared on page refresh)
  const [savedPhones, setSavedPhones] = useState<Array<{ phone: string; name?: string; timestamp: Date }>>([]);

  useEffect(() => {
    const stored = loadSettings();
    if (stored.showPhoneInput !== undefined) setShowPhoneInput(stored.showPhoneInput);
    if (stored.requirePhoneInput !== undefined) setRequirePhoneInput(stored.requirePhoneInput);
    if (stored.askForName !== undefined) setAskForName(stored.askForName);
    if (stored.riggedMode !== undefined) setRiggedMode(stored.riggedMode);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    saveSettings({ showPhoneInput, requirePhoneInput, askForName, riggedMode });
  }, [showPhoneInput, requirePhoneInput, askForName, riggedMode]);

  const {
    board,
    currentPlayer,
    winner,
    winningLine,
    fadingIndices,
    oldestMoveIndices,
    playCell,
    resetGame,
  } = useTicTacToe(riggedMode);

  const handleStartGame = () => {
    resetGame();
    setGameState("playing");
  };

  const handleCellClick = (index: number) => {
    playCell(index);
  };

  // Show win modal when there's a winner
  if (winner && !showWinModal) {
    setTimeout(() => setShowWinModal(true), 800);
  }

  const handleCloseWinModal = () => {
    setShowWinModal(false);
    resetGame();
  };

  const handleSavePhone = (phone: string, name?: string) => {
    setSavedPhones(prev => [...prev, { 
      phone, 
      name, 
      timestamp: new Date() 
    }]);
    console.log("Phone saved (session only):", { phone, name });
  };

  return (
    <>
      {/* Settings Button - Top Left - Only on Landing Page */}
      {gameState === "landing" && (
        <div className="fixed top-4 left-4 z-100">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="rounded-full w-10 h-10 text-foreground hover:text-foreground bg-card/80 backdrop-blur-sm border border-border shadow-sm hover:bg-card"
            aria-label="Open settings"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Theme Toggle - Top Right - Only on Landing Page */}
      {gameState === "landing" && (
        <div className="fixed top-4 right-4 z-100">
          <ThemeToggle />
        </div>
      )}

      <main className="min-h-screen flex flex-col items-center justify-center p-6 pb-20 bg-background relative -mt-12 md:mt-0">

      
      {gameState === "landing" && <InstallPrompt />}

      {gameState === "landing" && (
        <div className="flex flex-col items-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-3 flex items-center justify-center gap-1">
              <span className="text-x">Tic</span>
              <span className="text-muted-foreground">2</span>
              <span className="text-o">Talk</span>
            </h1>
            <div className="flex items-center justify-center gap-3 mb-4">
              <XIcon className="w-8 h-8" />
              <OIcon className="w-8 h-8" />
            </div>
            <p className="text-lg text-muted-foreground text-balance">
              Tic Tac Toe?
            </p>
          </div>

          
          <Button
            onClick={handleStartGame}
            size="lg"
            className="h-16 px-12 text-xl rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
          >
            Start Game
          </Button>
        </div>
      )}

      {gameState === "playing" && (
        <div className="flex flex-col items-center gap-8 w-full max-w-sm animate-in fade-in duration-300">
      
          <TurnIndicator 
            currentPlayer={currentPlayer} 
            willRemoveOldest={oldestMoveIndices[currentPlayer] !== null}
          />

          
          <GameBoard
            board={board}
            onCellClick={handleCellClick}
            winningLine={winningLine}
            fadingIndices={fadingIndices}
            oldestMoveIndices={oldestMoveIndices}
            currentPlayer={currentPlayer}
          />
        </div>
      )}

      
      {gameState === "playing" && !showWinModal && (
        <div className="absolute bottom-24 left-0 right-0 flex justify-center z-50">
          <Button
            variant="ghost"
            onClick={() => setShowExitModal(true)}
            className="text-primary hover:text-primary/80"
          >
            Back to menu
          </Button>
        </div>
      )}

      
      {winner && showWinModal && (
        <WinnerModal
          winner={winner}
          showPhoneInput={showPhoneInput}
          requirePhoneInput={requirePhoneInput}
          askForName={askForName}
          onClose={handleCloseWinModal}
          onSavePhone={handleSavePhone}
        />
      )}
      
      
      {gameState === "landing" && <Footer />}

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        showPhoneInput={showPhoneInput}
        onShowPhoneInputChange={setShowPhoneInput}
        requirePhoneInput={requirePhoneInput}
        onRequirePhoneInputChange={setRequirePhoneInput}
        askForName={askForName}
        onAskForNameChange={setAskForName}
        riggedMode={riggedMode}
        onRiggedModeChange={setRiggedMode}
      />

      {/* Confirm Exit Modal */}
      <ConfirmExitModal
        isOpen={showExitModal}
        onConfirm={() => {
          setShowExitModal(false);
          resetGame();
          setGameState("landing");
        }}
        onCancel={() => setShowExitModal(false)}
      />
    </main>
    </>
  );
}
