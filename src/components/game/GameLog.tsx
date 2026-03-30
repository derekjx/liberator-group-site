'use client';

import React, { useEffect, useRef } from 'react';
import type { LogEntry } from '@/lib/game/game-types';

interface GameLogProps {
  entries: LogEntry[];
}

const TYPE_COLORS: Record<LogEntry['type'], string> = {
  move: '#3B82F6',
  card: '#A855F7',
  transaction: '#22C55E',
  market: '#EAB308',
  system: '#8888aa',
};

const TYPE_LABELS: Record<LogEntry['type'], string> = {
  move: 'MOVE',
  card: 'CARD',
  transaction: 'TXN',
  market: 'MKT',
  system: 'SYS',
};

export default function GameLog({ entries }: GameLogProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [entries]);

  return (
    <div className="h-full flex flex-col p-4">
      <h2 className="text-base font-bold mb-3 flex-shrink-0" style={{ color: '#d4a853' }}>
        Game Log
      </h2>

      <div className="flex-1 overflow-y-auto space-y-1.5">
        {entries.length === 0 ? (
          <p className="text-sm text-center mt-8" style={{ color: '#8888aa' }}>
            No events yet. Roll the dice to start!
          </p>
        ) : (
          [...entries].reverse().map((entry, idx) => (
            <div
              key={idx}
              className="rounded-lg px-3 py-2 fade-in"
              style={{ background: '#16213e' }}
            >
              <div className="flex items-start gap-2">
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5"
                  style={{
                    background: `${TYPE_COLORS[entry.type]}22`,
                    color: TYPE_COLORS[entry.type],
                  }}
                >
                  {TYPE_LABELS[entry.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-semibold" style={{ color: '#d4a853' }}>
                      {entry.playerName}
                    </span>
                    <span className="text-xs" style={{ color: '#8888aa' }}>
                      Wk {entry.week}
                    </span>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: '#c0c0d0' }}>
                    {entry.message}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
