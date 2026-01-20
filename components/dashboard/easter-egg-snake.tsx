// A developer's tweak. 

"use client";

import React, { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const GRID_SIZE = 8;
const INITIAL_SPEED = 200;

export function EasterEggSnake({ onClose }: { onClose: () => void }) {
  const [snake, setSnake] = useState([{ x: 2, y: 2 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const moveSnake = useCallback(() => {
    if (gameOver) return;

    setSnake((prev) => {
      const newHead = {
        x: (prev[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (prev[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check self-collision
      if (prev.some((seg) => seg.x === newHead.x && seg.y === newHead.y)) {
        setGameOver(true);
        return prev;
      }

      const newSnake = [newHead, ...prev];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 1);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        });
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp": if (direction.y !== 1) setDirection({ x: 0, y: -1 }); break;
        case "ArrowDown": if (direction.y !== -1) setDirection({ x: 0, y: 1 }); break;
        case "ArrowLeft": if (direction.x !== 1) setDirection({ x: -1, y: 0 }); break;
        case "ArrowRight": if (direction.x !== -1) setDirection({ x: 1, y: 0 }); break;
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    const interval = setInterval(moveSnake, INITIAL_SPEED);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      clearInterval(interval);
    };
  }, [moveSnake, direction]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md">
      <div className="bg-zinc-950 border border-emerald-500/30 p-6 rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.2)] max-w-sm w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
          <X size={20} />
        </button>
        
        <div className="mb-4">
          <h3 className="text-emerald-500 font-black text-xs uppercase tracking-widest">Legacy_System_Protocol</h3>
          <p className="text-zinc-500 text-[10px] uppercase font-bold">Score: {score}</p>
        </div>

        <div className="grid grid-cols-8 gap-1 bg-zinc-900/50 p-2 rounded-lg border border-white/5">
          {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
            const x = i % GRID_SIZE;
            const y = Math.floor(i / GRID_SIZE);
            const isSnake = snake.some((s) => s.x === x && s.y === y);
            const isFood = food.x === x && food.y === y;

            return (
              <div
                key={i}
                className={`aspect-square rounded-sm transition-all duration-150 ${
                  isSnake ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" : 
                  isFood ? "bg-red-500 animate-pulse" : "bg-white/5"
                }`}
              />
            );
          })}
        </div>

        {gameOver && (
          <div className="mt-4 text-center">
            <p className="text-red-500 font-black text-xs uppercase mb-2">Internal_Link_Severed</p>
            <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="text-[10px]">Restart_Kernel</Button>
          </div>
        )}
      </div>
    </div>
  );
}