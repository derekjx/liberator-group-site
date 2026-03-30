'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/game/game-context';
import { DEFAULT_MARKET_PRICES } from '@/lib/game/game-engine';
import type { MarketPrices, Player } from '@/lib/game/game-types';

const PRESET_COLORS = [
  '#F59E0B', // amber
  '#3B82F6', // blue
  '#EF4444', // red
  '#22C55E', // green
  '#A855F7', // purple
  '#EC4899', // pink
];

interface PlayerSetupData {
  name: string;
  color: string;
  age: { years: number; months: number };
  targetRetirementAge: number;
  salary: number;
  cash: number;
  expenses: Player['expenses'];
  incomeMode: 'weekly' | 'monthly';
}

// Current game date for age calculation
const GAME_YEAR = 2026;
const GAME_MONTH = 3; // March (1-indexed)

function birthDateToAge(birthYear: number, birthMonth: number): { years: number; months: number } {
  let years = GAME_YEAR - birthYear;
  let months = GAME_MONTH - birthMonth;
  if (months < 0) { years -= 1; months += 12; }
  if (years < 0) years = 0;
  return { years, months };
}

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

const DEFAULT_PLAYER: Omit<PlayerSetupData, 'name' | 'color'> = {
  age: { years: 25, months: 0 },
  targetRetirementAge: 60,
  salary: 10000,
  cash: 50000,
  expenses: {
    rent: 3000,
    food: 1000,
    transport: 500,
    education: 0,
    utilities: 300,
    insurance: 200,
    other: 200,
  },
  incomeMode: 'weekly',
};

function PlayerCard({
  player,
  index,
  onUpdate,
  onRemove,
  usedColors,
}: {
  player: PlayerSetupData;
  index: number;
  onUpdate: (updates: Partial<PlayerSetupData>) => void;
  onRemove: () => void;
  usedColors: string[];
}) {
  const [expanded, setExpanded] = useState(index === 0);
  const [ageMode, setAgeMode] = useState<'age' | 'birthdate'>('age');
  const [ageYearsText, setAgeYearsText] = useState(player.age.years.toString());
  const [ageMonthsText, setAgeMonthsText] = useState(player.age.months.toString());
  const [birthYear, setBirthYear] = useState(GAME_YEAR - player.age.years);
  const [birthMonth, setBirthMonth] = useState(GAME_MONTH - player.age.months || 1);

  const expenseFields: { key: keyof Player['expenses']; label: string }[] = [
    { key: 'rent', label: 'Rent / Mortgage' },
    { key: 'food', label: 'Food & Groceries' },
    { key: 'transport', label: 'Transport' },
    { key: 'education', label: 'Education' },
    { key: 'utilities', label: 'Utilities' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1a1a2e', border: `1px solid ${player.color}44` }}
    >
      {/* Player header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer"
        style={{ background: `${player.color}11` }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
          style={{ background: player.color, color: '#0f0f1a' }}
        >
          {player.name ? player.name.charAt(0).toUpperCase() : (index + 1).toString()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
            {player.name || `Player ${index + 1}`}
          </p>
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Salary: {player.salary.toLocaleString()} · Cash: {player.cash.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {index > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-xs px-2 py-1 rounded"
              style={{ background: '#EF444422', color: '#EF4444' }}
            >
              Remove
            </button>
          )}
          <span style={{ color: '#8888aa', fontSize: '12px' }}>
            {expanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Name */}
          <div className="pt-3">
            <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
              PLAYER NAME
            </label>
            <input
              type="text"
              value={player.name}
              onChange={e => onUpdate({ name: e.target.value })}
              placeholder={`Player ${index + 1}`}
              className="w-full mt-1.5 px-3 py-2.5 rounded-xl text-sm"
              style={{
                background: '#0f0f1a',
                color: '#f0f0f0',
                border: '1px solid #333',
                outline: 'none',
              }}
            />
          </div>

          {/* Color picker */}
          <div>
            <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
              COLOR
            </label>
            <div className="flex gap-2 mt-1.5">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => onUpdate({ color: c })}
                  className="w-8 h-8 rounded-full transition-transform active:scale-90"
                  style={{
                    background: c,
                    border: player.color === c
                      ? '3px solid white'
                      : '3px solid transparent',
                    opacity: usedColors.includes(c) && player.color !== c ? 0.3 : 1,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Age */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
                STARTING AGE
              </label>
              <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid #333' }}>
                {(['age', 'birthdate'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setAgeMode(mode)}
                    className="px-2 py-1 text-xs font-semibold transition-all"
                    style={{
                      background: ageMode === mode ? '#d4a853' : '#0f0f1a',
                      color: ageMode === mode ? '#0f0f1a' : '#8888aa',
                    }}
                  >
                    {mode === 'age' ? 'Age' : 'Birth Date'}
                  </button>
                ))}
              </div>
            </div>

            {ageMode === 'age' ? (
              <div className="flex gap-2 mt-1.5">
                <div className="flex-1">
                  <label className="text-xs" style={{ color: '#8888aa' }}>Years</label>
                  <input
                    type="number"
                    min="18"
                    max="80"
                    value={ageYearsText}
                    onChange={e => {
                      setAgeYearsText(e.target.value);
                      const n = parseInt(e.target.value, 10);
                      if (!isNaN(n) && n >= 0) onUpdate({ age: { ...player.age, years: n } });
                    }}
                    onBlur={() => setAgeYearsText(player.age.years.toString())}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs" style={{ color: '#8888aa' }}>Months</label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    value={ageMonthsText}
                    onChange={e => {
                      setAgeMonthsText(e.target.value);
                      const n = parseInt(e.target.value, 10);
                      if (!isNaN(n) && n >= 0 && n <= 11) onUpdate({ age: { ...player.age, months: n } });
                    }}
                    onBlur={() => setAgeMonthsText(player.age.months.toString())}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex gap-2 mt-1.5">
                <div className="flex-1">
                  <label className="text-xs" style={{ color: '#8888aa' }}>Birth Month</label>
                  <select
                    value={birthMonth}
                    onChange={e => {
                      const m = parseInt(e.target.value, 10);
                      setBirthMonth(m);
                      onUpdate({ age: birthDateToAge(birthYear, m) });
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={m} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-xs" style={{ color: '#8888aa' }}>Birth Year</label>
                  <input
                    type="number"
                    min="1940"
                    max={GAME_YEAR - 18}
                    value={birthYear}
                    onChange={e => {
                      const y = parseInt(e.target.value, 10);
                      setBirthYear(y);
                      if (!isNaN(y) && y >= 1940 && y <= GAME_YEAR - 18) {
                        onUpdate({ age: birthDateToAge(y, birthMonth) });
                      }
                    }}
                    className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                    style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
                  />
                </div>
              </div>
            )}

            {/* Calculated age display */}
            <p className="text-xs mt-1.5" style={{ color: '#d4a853' }}>
              Age: {player.age.years} years, {player.age.months} months
              {player.targetRetirementAge > player.age.years && (
                <span style={{ color: '#8888aa' }}>
                  {' '}&mdash; {player.targetRetirementAge - player.age.years} years to retirement
                </span>
              )}
            </p>
          </div>

          {/* Target retirement age */}
          <div>
            <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
              TARGET RETIREMENT AGE
            </label>
            <input
              type="number"
              min={player.age.years + 1}
              max={100}
              value={player.targetRetirementAge}
              onChange={e => {
                const n = parseInt(e.target.value, 10);
                if (!isNaN(n)) onUpdate({ targetRetirementAge: n });
              }}
              className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm"
              style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
            />
          </div>

          {/* Salary & Cash */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
                MONTHLY SALARY
              </label>
              <input
                type="number"
                value={player.salary}
                onChange={e => onUpdate({ salary: parseFloat(e.target.value) || 0 })}
                className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
              />
            </div>
            <div>
              <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
                STARTING CASH
              </label>
              <input
                type="number"
                value={player.cash}
                onChange={e => onUpdate({ cash: parseFloat(e.target.value) || 0 })}
                className="w-full mt-1.5 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
              />
            </div>
          </div>

          {/* Income mode */}
          <div>
            <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
              INCOME COLLECTION
            </label>
            <div className="flex gap-2 mt-1.5">
              {(['weekly', 'monthly'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => onUpdate({ incomeMode: mode })}
                  className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    background: player.incomeMode === mode ? '#d4a853' : '#16213e',
                    color: player.incomeMode === mode ? '#0f0f1a' : '#8888aa',
                    border: player.incomeMode === mode ? 'none' : '1px solid #333',
                  }}
                >
                  {mode === 'weekly' ? 'Weekly (per tile)' : 'Monthly (per group)'}
                </button>
              ))}
            </div>
          </div>

          {/* Monthly Expenses */}
          <div>
            <label className="text-xs font-semibold" style={{ color: '#8888aa' }}>
              MONTHLY EXPENSES
            </label>
            <div className="grid grid-cols-2 gap-2 mt-1.5">
              {expenseFields.map(({ key, label }) => (
                <div key={key}>
                  <label className="text-xs" style={{ color: '#8888aa' }}>{label}</label>
                  <input
                    type="number"
                    value={player.expenses[key]}
                    onChange={e =>
                      onUpdate({
                        expenses: {
                          ...player.expenses,
                          [key]: parseFloat(e.target.value) || 0,
                        },
                      })
                    }
                    className="w-full mt-1 px-3 py-1.5 rounded-lg text-sm"
                    style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
                  />
                </div>
              ))}
            </div>

            {/* Expense summary */}
            <div
              className="flex justify-between items-center mt-2 px-3 py-2 rounded-lg"
              style={{ background: '#0f0f1a' }}
            >
              <span className="text-xs" style={{ color: '#8888aa' }}>Total Monthly Expenses</span>
              <span className="text-xs font-bold" style={{ color: '#EF4444' }}>
                {Object.values(player.expenses).reduce((s, v) => s + v, 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MarketSetup({
  prices,
  onUpdate,
}: {
  prices: MarketPrices;
  onUpdate: (prices: MarketPrices) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const fields: { key: keyof MarketPrices; label: string; hint: string }[] = [
    { key: 'interestRate', label: 'Base Interest Rate (%)', hint: 'e.g. 4.0' },
    { key: 'stocks', label: 'Stock Index', hint: 'e.g. 6000' },
    { key: 'bonds', label: 'Bond Price (per unit)', hint: 'e.g. 90' },
    { key: 'crypto', label: 'Cryptocurrency', hint: 'e.g. 100000' },
    { key: 'gold', label: 'Gold (per oz)', hint: 'e.g. 2800' },
    { key: 'silver', label: 'Silver (per oz)', hint: 'e.g. 30' },
    { key: 'propertyIndex', label: 'Property Index (base 100)', hint: 'e.g. 100' },
    { key: 'mutualFunds', label: 'Mutual Funds', hint: 'e.g. 6000' },
  ];

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: '#1a1a2e', border: '1px solid #A855F744' }}
    >
      <div
        className="flex items-center justify-between px-4 py-3 cursor-pointer"
        style={{ background: '#A855F711' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <p className="text-sm font-semibold" style={{ color: '#A855F7' }}>
            Starting Market Prices
          </p>
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Pre-filled with defaults — edit to match your game session
          </p>
        </div>
        <span style={{ color: '#8888aa', fontSize: '12px' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-3 grid grid-cols-2 gap-3">
          {fields.map(({ key, label, hint }) => (
            <div key={key}>
              <label className="text-xs" style={{ color: '#8888aa' }}>{label}</label>
              <input
                type="number"
                value={prices[key] as number}
                step="0.1"
                onChange={e =>
                  onUpdate({ ...prices, [key]: parseFloat(e.target.value) || 0 })
                }
                placeholder={hint}
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function SetupScreen() {
  const { startGame } = useGame();

  const [players, setPlayers] = useState<PlayerSetupData[]>([
    { name: '', color: PRESET_COLORS[0], ...DEFAULT_PLAYER, targetRetirementAge: 60 },
  ]);
  const [marketPrices, setMarketPrices] = useState<MarketPrices>(DEFAULT_MARKET_PRICES);
  const [error, setError] = useState('');

  const usedColors = players.map(p => p.color);

  const addPlayer = () => {
    if (players.length >= 6) return;
    const availableColor = PRESET_COLORS.find(c => !usedColors.includes(c)) ?? PRESET_COLORS[players.length % 6];
    setPlayers(prev => [
      ...prev,
      { name: '', color: availableColor, ...DEFAULT_PLAYER },
    ]);
  };

  const removePlayer = (index: number) => {
    if (players.length <= 1) return;
    setPlayers(prev => prev.filter((_, i) => i !== index));
  };

  const updatePlayer = (index: number, updates: Partial<PlayerSetupData>) => {
    setPlayers(prev =>
      prev.map((p, i) => (i === index ? { ...p, ...updates } : p))
    );
  };

  const handleStart = () => {
    const filled = players.map((p, i) => ({
      ...p,
      name: p.name.trim() || `Player ${i + 1}`,
    }));

    // Validate unique names
    const names = filled.map(p => p.name);
    if (new Set(names).size !== names.length) {
      setError('All players must have unique names.');
      return;
    }

    setError('');
    startGame(filled, marketPrices);
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: '#0f0f1a', color: '#f0f0f0' }}
    >
      {/* Hero header */}
      <div
        className="px-6 pt-12 pb-8 text-center"
        style={{ borderBottom: '1px solid #2a2a4a' }}
      >
        <div
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: '#d4a85322', color: '#d4a853', border: '1px solid #d4a85344' }}
        >
          Financial Life Simulation
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-2" style={{ color: '#d4a853' }}>
          Circle of Life
        </h1>
        <p className="text-sm" style={{ color: '#8888aa' }}>
          Simulate Your Financial Future
        </p>
        <div className="flex justify-center gap-6 mt-5 text-xs" style={{ color: '#8888aa' }}>
          <span>1–6 Players</span>
          <span>·</span>
          <span>26 Tiles per Lap</span>
          <span>·</span>
          <span>Pass-and-Play</span>
        </div>
      </div>

      {/* Setup form */}
      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Players section */}
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: '#8888aa' }}>
            Players ({players.length}/6)
          </h2>
          {players.length < 6 && (
            <button
              onClick={addPlayer}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold"
              style={{ background: '#d4a85322', color: '#d4a853', border: '1px solid #d4a85344' }}
            >
              + Add Player
            </button>
          )}
        </div>

        {players.map((player, idx) => (
          <PlayerCard
            key={idx}
            player={player}
            index={idx}
            onUpdate={updates => updatePlayer(idx, updates)}
            onRemove={() => removePlayer(idx)}
            usedColors={usedColors.filter((_, i) => i !== idx)}
          />
        ))}

        {/* Market prices */}
        <MarketSetup prices={marketPrices} onUpdate={setMarketPrices} />

        {/* Rules summary */}
        <div
          className="rounded-2xl p-4 space-y-2"
          style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
        >
          <h3 className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8888aa' }}>
            How to Play
          </h3>
          <div className="space-y-1.5 text-xs" style={{ color: '#c0c0d0' }}>
            <p>Roll dice to move around the board. Each tile = 1 week.</p>
            <p>Draw a card when you land on a tile. Follow the instructions.</p>
            <p>Collect income as you move (weekly or monthly mode).</p>
            <p>Build your balance sheet: invest in assets, manage expenses.</p>
            <p>Markets cards update all asset prices for all players.</p>
            <p>A full lap (26 tiles) = 6 months of game time.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-center" style={{ color: '#EF4444' }}>
            {error}
          </p>
        )}

        {/* Start button */}
        <button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl text-base font-bold transition-all active:scale-98"
          style={{
            background: 'linear-gradient(135deg, #d4a853, #b8873a)',
            color: '#0f0f1a',
          }}
        >
          Start Game
        </button>

        <div className="pb-8" />
      </div>
    </div>
  );
}
