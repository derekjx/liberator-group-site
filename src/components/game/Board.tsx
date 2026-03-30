'use client';

import React, { useMemo } from 'react';
import { buildBoard } from '@/lib/game/game-engine';
import type { Player } from '@/lib/game/game-types';
import { formatCurrency, calcCashflow, calcNetWorth } from '@/lib/game/game-engine';

interface BoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

// 6 month bands — warm rainbow, matches the physical board intent
const MONTH_COLORS = [
  '#E74C3C', // Month 1 — red
  '#E67E22', // Month 2 — orange
  '#F1C40F', // Month 3 — yellow
  '#2ECC71', // Month 4 — green
  '#3498DB', // Month 5 — blue
  '#9B59B6', // Month 6 — purple
];

// 26 tiles: months 1–6 get 4 tiles each (24), last 2 wrap into month 6
function getMonthForTile(tileIndex: number): number {
  if (tileIndex < 24) return Math.floor(tileIndex / 4); // 0-5
  return 5; // tiles 24-25 stay in month 6
}

const TILE_COLORS: Record<string, string> = {
  learn: '#3B82F6',
  invest: '#22C55E',
  fortune: '#EAB308',
  event: '#EF4444',
  markets: '#A855F7',
};

const TILE_SHORT: Record<string, string> = {
  learn: 'L',
  invest: 'I',
  fortune: 'F',
  event: 'E',
  markets: 'M',
};

const TILE_LABEL: Record<string, string> = {
  learn: 'Learn',
  invest: 'Invest',
  fortune: 'Fortune',
  event: 'Event',
  markets: 'Markets',
};

const MONTH_LABELS = ['Jan–Feb', 'Mar–Apr', 'May–Jun', 'Jul–Aug', 'Sep–Oct', 'Nov–Dec'];

export default function Board({ players, currentPlayerIndex }: BoardProps) {
  const board = useMemo(() => buildBoard(), []);
  const TILE_COUNT = board.length;

  const SIZE = 340;
  const CENTER = SIZE / 2;
  const OUTER_R = 152;  // outer edge of month ring
  const MID_R = 124;    // boundary between month ring and tile-type ring
  const INNER_R = 96;   // inner edge of tile-type ring (= center boundary)
  const LABEL_R = 110;  // where tile-type letter goes
  const MONTH_LABEL_R = 138; // where month number goes (in outer ring)
  const TOKEN_R = 148;  // player tokens just inside the outer ring

  const angleStep = (2 * Math.PI) / TILE_COUNT;
  const startAngle = -Math.PI / 2;

  function polarToXY(r: number, angle: number) {
    return { x: CENTER + r * Math.cos(angle), y: CENTER + r * Math.sin(angle) };
  }

  function describeArc(outerR: number, innerR: number, startA: number, endA: number): string {
    const gap = 0.025;
    const s = startA + gap / 2;
    const e = endA - gap / 2;
    const o1 = polarToXY(outerR, s);
    const o2 = polarToXY(outerR, e);
    const i1 = polarToXY(innerR, e);
    const i2 = polarToXY(innerR, s);
    const large = e - s > Math.PI ? 1 : 0;
    return [
      `M ${o1.x} ${o1.y}`,
      `A ${outerR} ${outerR} 0 ${large} 1 ${o2.x} ${o2.y}`,
      `L ${i1.x} ${i1.y}`,
      `A ${innerR} ${innerR} 0 ${large} 0 ${i2.x} ${i2.y}`,
      'Z',
    ].join(' ');
  }

  const playersByPosition = useMemo(() => {
    const map = new Map<number, Player[]>();
    players.forEach(p => {
      const list = map.get(p.position) ?? [];
      list.push(p);
      map.set(p.position, list);
    });
    return map;
  }, [players]);

  const currentPlayer = players[currentPlayerIndex];
  const cashflow = currentPlayer ? calcCashflow(currentPlayer) : 0;
  const netWorth = currentPlayer ? calcNetWorth(currentPlayer) : 0;

  // Calculate years to retirement for center display
  const yearsToRetirement = currentPlayer
    ? Math.max(0, currentPlayer.targetRetirementAge - currentPlayer.age.years)
    : null;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width={SIZE}
        height={SIZE}
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full max-w-xs sm:max-w-sm"
        style={{ maxHeight: '340px' }}
      >
        {board.map((tile, idx) => {
          const tileStart = startAngle + idx * angleStep;
          const tileEnd = startAngle + (idx + 1) * angleStep;
          const midAngle = (tileStart + tileEnd) / 2;

          const monthIdx = getMonthForTile(idx);
          const monthColor = MONTH_COLORS[monthIdx];
          const tileColor = TILE_COLORS[tile.type];
          const isStart = tile.isStart;
          const isMonthBoundary = idx % 4 === 0 && idx > 0; // first tile of a new month

          const labelPos = polarToXY(LABEL_R, midAngle);
          const monthLabelPos = polarToXY(MONTH_LABEL_R, midAngle);

          return (
            <g key={tile.id}>
              {/* Outer ring — month colour */}
              <path
                d={describeArc(OUTER_R, MID_R, tileStart, tileEnd)}
                fill={isStart ? '#d4a853' : monthColor}
                fillOpacity={0.85}
                stroke="#0f0f1a"
                strokeWidth="1"
              />

              {/* Inner ring — tile type colour */}
              <path
                d={describeArc(MID_R, INNER_R, tileStart, tileEnd)}
                fill={isStart ? '#b8873a' : tileColor}
                fillOpacity={0.9}
                stroke="#0f0f1a"
                strokeWidth="1"
              />

              {/* Month number in outer ring — only on first tile of each month */}
              {(idx % 4 === 0) && !isStart && (
                <text
                  x={monthLabelPos.x}
                  y={monthLabelPos.y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="7"
                  fontWeight="700"
                  fill="white"
                  fillOpacity={0.9}
                  style={{ fontFamily: 'system-ui' }}
                >
                  M{monthIdx + 1}
                </text>
              )}

              {/* Tile type label in inner ring */}
              <text
                x={labelPos.x}
                y={labelPos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="8"
                fontWeight="700"
                fill={isStart ? '#0f0f1a' : 'white'}
                style={{ fontFamily: 'system-ui' }}
              >
                {isStart ? 'S' : TILE_SHORT[tile.type]}
              </text>
            </g>
          );
        })}

        {/* Center circle */}
        <circle cx={CENTER} cy={CENTER} r={INNER_R - 3} fill="#16213e" />
        <circle cx={CENTER} cy={CENTER} r={INNER_R - 5} fill="#1a1a2e" stroke="#d4a853" strokeWidth="1" />

        {/* Center content */}
        {currentPlayer ? (
          <>
            <text x={CENTER} y={CENTER - 32} textAnchor="middle" fontSize="9" fill="#8888aa" style={{ fontFamily: 'system-ui' }}>
              {currentPlayer.name.length > 12 ? currentPlayer.name.slice(0, 11) + '…' : currentPlayer.name}
            </text>
            <text x={CENTER} y={CENTER - 18} textAnchor="middle" fontSize="8" fill={currentPlayer.color} style={{ fontFamily: 'system-ui' }}>
              Age {currentPlayer.age.years}y {currentPlayer.age.months}m
            </text>
            {yearsToRetirement !== null && (
              <text x={CENTER} y={CENTER - 6} textAnchor="middle" fontSize="7" fill="#d4a853" style={{ fontFamily: 'system-ui' }}>
                {yearsToRetirement > 0 ? `${yearsToRetirement}y to retire` : 'Retirement age!'}
              </text>
            )}
            <text x={CENTER} y={CENTER + 7} textAnchor="middle" fontSize="8" fill="#8888aa" style={{ fontFamily: 'system-ui' }}>Cashflow</text>
            <text
              x={CENTER} y={CENTER + 19} textAnchor="middle" fontSize="11" fontWeight="700"
              fill={cashflow >= 0 ? '#22C55E' : '#EF4444'}
              style={{ fontFamily: 'system-ui' }}
            >
              {cashflow >= 0 ? '+' : ''}{formatCurrency(cashflow)}/mo
            </text>
            <text x={CENTER} y={CENTER + 32} textAnchor="middle" fontSize="8" fill="#8888aa" style={{ fontFamily: 'system-ui' }}>Net Worth</text>
            <text x={CENTER} y={CENTER + 44} textAnchor="middle" fontSize="11" fontWeight="700" fill="#d4a853" style={{ fontFamily: 'system-ui' }}>
              {formatCurrency(netWorth)}
            </text>
          </>
        ) : (
          <text x={CENTER} y={CENTER} textAnchor="middle" dominantBaseline="middle" fontSize="13" fontWeight="700" fill="#d4a853" style={{ fontFamily: 'system-ui' }}>
            Circle of Life
          </text>
        )}

        {/* Player tokens — sit on the outer ring */}
        {board.map((_, idx) => {
          const tilePlayers = playersByPosition.get(idx);
          if (!tilePlayers || tilePlayers.length === 0) return null;
          const tileStart = startAngle + idx * angleStep;
          const tileEnd = startAngle + (idx + 1) * angleStep;
          const midAngle = (tileStart + tileEnd) / 2;

          return tilePlayers.map((p, pIdx) => {
            const angleOffset = (pIdx - (tilePlayers.length - 1) / 2) * 0.18;
            const tokenPos = polarToXY(TOKEN_R - 10, midAngle + angleOffset);
            const isCurrentPlayer = players.indexOf(p) === currentPlayerIndex;
            return (
              <g key={p.id}>
                <circle
                  cx={tokenPos.x} cy={tokenPos.y} r={7}
                  fill={p.color}
                  stroke={isCurrentPlayer ? 'white' : '#0f0f1a'}
                  strokeWidth={isCurrentPlayer ? 2 : 1}
                  className={isCurrentPlayer ? 'token-active' : ''}
                />
                <text
                  x={tokenPos.x} y={tokenPos.y + 0.5}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize="6" fontWeight="700" fill="white"
                  style={{ fontFamily: 'system-ui' }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </text>
              </g>
            );
          });
        })}
      </svg>

      {/* Legend — two rows: months + tile types */}
      <div className="w-full max-w-xs space-y-1.5 px-1">
        {/* Month legend */}
        <div className="flex justify-between">
          {MONTH_COLORS.map((c, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-3 h-3 rounded-sm" style={{ background: c }} />
              <span className="text-xs" style={{ color: '#8888aa', fontSize: '9px' }}>M{i + 1}</span>
            </div>
          ))}
        </div>
        {/* Tile type legend */}
        <div className="flex flex-wrap justify-center gap-x-3 gap-y-1">
          {Object.entries(TILE_LABEL).map(([type, label]) => (
            <div key={type} className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: TILE_COLORS[type] }} />
              <span className="text-xs" style={{ color: '#8888aa' }}>{TILE_SHORT[type]}={label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
