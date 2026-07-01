'use client';

import React, { useState, useEffect } from 'react';

interface DiceRollerProps {
  result: number | null;
  onRoll: () => void;
  disabled: boolean;
}

const DICE_FACES: Record<number, string> = {
  1: '⚀',
  2: '⚁',
  3: '⚂',
  4: '⚃',
  5: '⚄',
  6: '⚅',
};

// SVG dice dots layout
function DiceFace({ value }: { value: number }) {
  const dotPositions: Record<number, [number, number][]> = {
    1: [[50, 50]],
    2: [[25, 25], [75, 75]],
    3: [[25, 25], [50, 50], [75, 75]],
    4: [[25, 25], [75, 25], [25, 75], [75, 75]],
    5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
    6: [[25, 20], [75, 20], [25, 50], [75, 50], [25, 80], [75, 80]],
  };

  const dots = dotPositions[value] ?? [];

  return (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect
        x="4" y="4" width="92" height="92" rx="16"
        fill="#1a1a2e"
        stroke="#d4a853"
        strokeWidth="3"
      />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#d4a853" />
      ))}
    </svg>
  );
}

export default function DiceRoller({ result, onRoll, disabled }: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [displayValue, setDisplayValue] = useState<number>(1);

  const handleRoll = () => {
    if (disabled || rolling) return;
    setRolling(true);

    // Animate random values
    let count = 0;
    const interval = setInterval(() => {
      setDisplayValue(Math.floor(Math.random() * 6) + 1);
      count++;
      if (count >= 8) {
        clearInterval(interval);
        setRolling(false);
      }
    }, 80);

    onRoll();
  };

  useEffect(() => {
    if (result !== null && !rolling) {
      setDisplayValue(result);
    }
  }, [result, rolling]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`w-20 h-20 cursor-pointer select-none transition-transform ${
          rolling ? 'dice-rolling' : ''
        } ${disabled ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
        onClick={handleRoll}
      >
        <DiceFace value={result !== null ? result : displayValue} />
      </div>

      {result !== null ? (
        <p className="text-sm font-semibold" style={{ color: '#d4a853' }}>
          Rolled a {result}
        </p>
      ) : (
        <button
          onClick={handleRoll}
          disabled={disabled || rolling}
          className="px-6 py-2 rounded-lg text-sm font-semibold transition-all"
          style={{
            background: disabled ? '#333' : '#d4a853',
            color: disabled ? '#666' : '#0f0f1a',
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        >
          {rolling ? 'Rolling...' : 'Roll Dice'}
        </button>
      )}
    </div>
  );
}
