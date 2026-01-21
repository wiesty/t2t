"use client";

import { useState, useCallback, useEffect, useRef } from "react";

type Player = "X" | "O";

interface CellData {
  player: Player | null;
  moveOrder: number | null;
}

type Board = CellData[];

const WINNING_COMBINATIONS = [
  [0, 1, 2], // top row
  [3, 4, 5], // middle row
  [6, 7, 8], // bottom row
  [0, 3, 6], // left column
  [1, 4, 7], // middle column
  [2, 5, 8], // right column
  [0, 4, 8], // diagonal
  [2, 4, 6], // anti-diagonal
];

const MAX_MOVES_PER_PLAYER = 3;

const createEmptyBoard = (): Board =>
  Array(9).fill(null).map(() => ({ player: null, moveOrder: null }));

export function useTicTacToe(riggedMode: boolean = false) {
  const [board, setBoard] = useState<Board>(createEmptyBoard());
  const [currentPlayer, setCurrentPlayer] = useState<Player>("X");
  const [winner, setWinner] = useState<Player | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);
  const [moveCounter, setMoveCounter] = useState(0);
  const [fadingIndices, setFadingIndices] = useState<number[]>([]);
  const [oldestMoveIndices, setOldestMoveIndices] = useState<{ X: number | null; O: number | null }>({ X: null, O: null });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Preload win sound
  useEffect(() => {
    audioRef.current = new Audio(
      "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYNBrT2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UMQAA8AAAaQAAAAgAAA0gAAABExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//tSxAODwAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU="
    );
  }, []);

  const checkWinner = useCallback((currentBoard: Board): { winner: Player | null; line: number[] | null } => {
    for (const combination of WINNING_COMBINATIONS) {
      const [a, b, c] = combination;
      if (
        currentBoard[a].player &&
        currentBoard[a].player === currentBoard[b].player &&
        currentBoard[a].player === currentBoard[c].player
      ) {
        return { winner: currentBoard[a].player as Player, line: combination };
      }
    }
    return { winner: null, line: null };
  }, []);

  const getOldestMoveIndex = useCallback((currentBoard: Board, player: Player): number | null => {
    let oldestIndex: number | null = null;
    let oldestOrder = Infinity;

    for (let i = 0; i < currentBoard.length; i++) {
      if (currentBoard[i].player === player && currentBoard[i].moveOrder !== null) {
        if (currentBoard[i].moveOrder! < oldestOrder) {
          oldestOrder = currentBoard[i].moveOrder!;
          oldestIndex = i;
        }
      }
    }

    return oldestIndex;
  }, []);

  const countPlayerMoves = useCallback((currentBoard: Board, player: Player): number => {
    return currentBoard.filter(cell => cell.player === player).length;
  }, []);

  const playCell = useCallback(
    (index: number) => {
      if (board[index].player !== null || winner) return;

      const newBoard = [...board.map(cell => ({ ...cell }))];
      const playerMoveCount = countPlayerMoves(newBoard, currentPlayer);

      // If player already has 3 moves, remove the oldest one FIRST before placing new one
      if (playerMoveCount >= MAX_MOVES_PER_PLAYER) {
        const oldestIndex = getOldestMoveIndex(newBoard, currentPlayer);
        if (oldestIndex !== null) {
          // Remove the oldest move immediately
          newBoard[oldestIndex] = { player: null, moveOrder: null };
          // Start fading animation (visual only, cell already cleared)
          setFadingIndices([oldestIndex]);
          setTimeout(() => {
            setFadingIndices([]);
          }, 300);
        }
      }

      // Place the new move
      const newMoveOrder = moveCounter + 1;
      newBoard[index] = { player: currentPlayer, moveOrder: newMoveOrder };
      setBoard(newBoard);
      setMoveCounter(newMoveOrder);

      const result = checkWinner(newBoard);
      
      // Rigged Mode: X kann niemals gewinnen
      if (riggedMode && result.winner === "X") {
        // Ignoriere X Gewinne, setze einfach den nächsten Spieler
        const nextPlayer = currentPlayer === "X" ? "O" : "X";
        setCurrentPlayer(nextPlayer);
        
        // Update oldest move indicators for both players
        const xMoves = countPlayerMoves(newBoard, "X");
        const oMoves = countPlayerMoves(newBoard, "O");
        setOldestMoveIndices({
          X: xMoves >= MAX_MOVES_PER_PLAYER ? getOldestMoveIndex(newBoard, "X") : null,
          O: oMoves >= MAX_MOVES_PER_PLAYER ? getOldestMoveIndex(newBoard, "O") : null,
        });
        return;
      }
      if (result.winner) {
        setWinner(result.winner);
        setWinningLine(result.line);
        setOldestMoveIndices({ X: null, O: null });
        // Play win sound
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {
            // Audio play failed, likely due to autoplay restrictions
          });
        }
      } else {
        const nextPlayer = currentPlayer === "X" ? "O" : "X";
        setCurrentPlayer(nextPlayer);
        
        // Update oldest move indicators for both players
        const xMoves = countPlayerMoves(newBoard, "X");
        const oMoves = countPlayerMoves(newBoard, "O");
        setOldestMoveIndices({
          X: xMoves >= MAX_MOVES_PER_PLAYER ? getOldestMoveIndex(newBoard, "X") : null,
          O: oMoves >= MAX_MOVES_PER_PLAYER ? getOldestMoveIndex(newBoard, "O") : null,
        });
      }
    },
    [board, currentPlayer, winner, moveCounter, checkWinner, countPlayerMoves, getOldestMoveIndex, riggedMode]
  );

  const resetGame = useCallback(() => {
    setBoard(createEmptyBoard());
    setCurrentPlayer("X");
    setWinner(null);
    setWinningLine(null);
    setMoveCounter(0);
    setFadingIndices([]);
    setOldestMoveIndices({ X: null, O: null });
  }, []);

  return {
    board,
    currentPlayer,
    winner,
    winningLine,
    fadingIndices,
    oldestMoveIndices,
    playCell,
    resetGame,
  };
}
