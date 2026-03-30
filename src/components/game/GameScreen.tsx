'use client';

import React, { useState } from 'react';
import { useGame } from '@/lib/game/game-context';
import Board from '@/components/game/Board';
import CardModal from '@/components/game/CardModal';
import FinancesPanel from '@/components/game/FinancesPanel';
import MarketPanel from '@/components/game/MarketPanel';
import GameLog from '@/components/game/GameLog';
import DiceRoller from '@/components/game/DiceRoller';
import QuickTrade from '@/components/game/QuickTrade';
import { buildBoard } from '@/lib/game/game-engine';
import { formatCurrency, calcCashflow, calcNetWorth } from '@/lib/game/game-engine';


type Tab = 'board' | 'finances' | 'market' | 'log';

const TILE_TYPE_LABELS: Record<string, string> = {
  learn: 'Learn',
  invest: 'Invest',
  fortune: 'Fortune',
  event: 'Event',
  markets: 'Markets',
};

const TILE_TYPE_COLORS: Record<string, string> = {
  learn: '#3B82F6',
  invest: '#22C55E',
  fortune: '#EAB308',
  event: '#EF4444',
  markets: '#A855F7',
};

export default function GameScreen() {
  const {
    state,
    currentPlayer,
    rollDiceAction,
    drawCardAction,
    dismissCard,
    nextPlayer,
  } = useGame();

  const [activeTab, setActiveTab] = useState<Tab>('board');

  const board = buildBoard();
  const currentTile = currentPlayer ? board[currentPlayer.position] : null;
  const tileColor = currentTile ? TILE_TYPE_COLORS[currentTile.type] : '#8888aa';

  const showDrawCard =
    state.hasRolled &&
    !state.hasDrawnCard &&
    !state.currentCard &&
    state.phase === 'playing' &&
    currentTile;

  const showQuickTrade =
    state.hasRolled &&
    state.hasDrawnCard &&
    !state.currentCard &&
    state.phase === 'playing';

  const showNextPlayer =
    state.hasRolled &&
    !state.currentCard &&
    state.phase === 'playing';

  const viewingPlayer =
    activeTab === 'finances'
      ? (currentPlayer ?? state.players[0])
      : currentPlayer;

  return (
    <div
      className="flex flex-col h-screen"
      style={{ background: '#0f0f1a', color: '#f0f0f0' }}
    >
      {/* Top bar */}
      <div
        className="flex items-center justify-between px-4 py-2 flex-shrink-0"
        style={{ background: '#1a1a2e', borderBottom: '1px solid #2a2a4a' }}
      >
        <div>
          <h1 className="text-sm font-bold" style={{ color: '#d4a853' }}>
            Circle of Life
          </h1>
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Week {currentPlayer?.weeksPassed ?? 0}
          </p>
        </div>

        {/* Player turn indicator + age */}
        {currentPlayer && (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: currentPlayer.color }} />
              <span className="text-sm font-semibold" style={{ color: currentPlayer.color }}>
                {currentPlayer.name}
              </span>
              <span className="text-xs" style={{ color: '#8888aa' }}>'s turn</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-xs" style={{ color: '#d4a853' }}>
                Age {currentPlayer.age.years}y {currentPlayer.age.months}m
              </span>
              {currentPlayer.targetRetirementAge > currentPlayer.age.years && (
                <span className="text-xs" style={{ color: '#8888aa' }}>
                  · {currentPlayer.targetRetirementAge - currentPlayer.age.years}y to retire
                </span>
              )}
              {currentPlayer.age.years >= currentPlayer.targetRetirementAge && (
                <span className="text-xs font-semibold" style={{ color: '#22C55E' }}>
                  · Retirement age!
                </span>
              )}
            </div>
          </div>
        )}

        {/* Round counter */}
        <div className="text-right">
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Round {state.round + 1}
          </p>
          <p className="text-xs" style={{ color: '#8888aa' }}>
            {state.players.length}P
          </p>
        </div>
      </div>

      {/* Market ticker */}
      <div
        className="flex items-center gap-4 px-4 py-1.5 overflow-x-auto flex-shrink-0 text-xs"
        style={{ background: '#16213e', borderBottom: '1px solid #2a2a4a' }}
      >
        <span style={{ color: '#A855F7', flexShrink: 0 }}>
          Rate: {state.marketPrices.interestRate.toFixed(1)}%
        </span>
        <span style={{ color: '#c0c0d0', flexShrink: 0 }}>
          Stocks: {state.marketPrices.stocks.toLocaleString()}
        </span>
        <span style={{ color: '#c0c0d0', flexShrink: 0 }}>
          Crypto: {formatCurrency(state.marketPrices.crypto)}
        </span>
        <span style={{ color: '#c0c0d0', flexShrink: 0 }}>
          Gold: {state.marketPrices.gold.toLocaleString()}
        </span>
        <span style={{ color: '#c0c0d0', flexShrink: 0 }}>
          Silver: {state.marketPrices.silver.toFixed(1)}
        </span>
        <span style={{ color: '#c0c0d0', flexShrink: 0 }}>
          Property: {state.marketPrices.propertyIndex.toFixed(1)}
        </span>
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'board' && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Board */}
            <div className="flex-shrink-0 p-3 flex justify-center">
              <Board
                players={state.players}
                currentPlayerIndex={state.currentPlayerIndex}
              />
            </div>

            {/* Action area */}
            <div
              className="flex-shrink-0 mx-3 mb-3 rounded-2xl p-4"
              style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
            >
              {/* Current tile info */}
              {currentTile && (
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ background: tileColor }}
                  />
                  <span className="text-xs" style={{ color: '#8888aa' }}>
                    Tile {(currentPlayer?.position ?? 0) + 1} —
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: tileColor }}
                  >
                    {TILE_TYPE_LABELS[currentTile.type]}
                  </span>
                  {currentPlayer && (
                    <span className="text-xs ml-auto" style={{ color: '#8888aa' }}>
                      Cash: {formatCurrency(currentPlayer.cash)}
                    </span>
                  )}
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center justify-between gap-3">
                <DiceRoller
                  result={state.diceResult}
                  onRoll={rollDiceAction}
                  disabled={state.hasRolled}
                />

                <div className="flex flex-col gap-2 flex-1">
                  {showDrawCard && (
                    <button
                      onClick={drawCardAction}
                      className="w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
                      style={{ background: tileColor, color: '#0f0f1a' }}
                    >
                      Draw {TILE_TYPE_LABELS[currentTile!.type]} Card
                    </button>
                  )}
                  {showNextPlayer && (
                    <button
                      onClick={nextPlayer}
                      className="w-full py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-95"
                      style={{
                        background: 'transparent',
                        color: '#8888aa',
                        border: '1px solid #444',
                      }}
                    >
                      End Turn
                    </button>
                  )}
                </div>
              </div>

              {/* Sick leave warning */}
              {currentPlayer && currentPlayer.activeEffects.some(e => e.type === 'sick-leave') && (
                <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ background: '#EF444422', color: '#EF4444', border: '1px solid #EF444444' }}>
                  On sick leave — cannot take Learn or Invest actions this turn.
                  {' '}({currentPlayer.activeEffects.find(e => e.type === 'sick-leave')?.remainingWeeks} weeks remaining)
                </div>
              )}
              {currentPlayer && currentPlayer.activeEffects.some(e => e.type === 'unpaid-leave') && (
                <div className="mt-2 px-3 py-2 rounded-lg text-xs" style={{ background: '#EF444422', color: '#EF4444', border: '1px solid #EF444444' }}>
                  On unpaid leave — no salary this turn.
                  {' '}({currentPlayer.activeEffects.find(e => e.type === 'unpaid-leave')?.remainingWeeks} weeks remaining)
                </div>
              )}

              {/* Players summary strip */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {state.players.map((p, idx) => {
                  const cf = calcCashflow(p);
                  const isActive = idx === state.currentPlayerIndex;
                  return (
                    <div
                      key={p.id}
                      className="flex-shrink-0 rounded-lg px-2.5 py-1.5 min-w-0"
                      style={{
                        background: isActive ? `${p.color}22` : '#16213e',
                        border: `1px solid ${isActive ? p.color : '#333'}`,
                      }}
                    >
                      <div className="flex items-center gap-1 mb-0.5">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: p.color }}
                        />
                        <span className="text-xs font-semibold" style={{ color: p.color }}>
                          {p.name.length > 8 ? p.name.slice(0, 7) + '…' : p.name}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: '#f0f0f0' }}>
                        {formatCurrency(p.cash)}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: cf >= 0 ? '#22C55E' : '#EF4444' }}
                      >
                        {cf >= 0 ? '+' : ''}{formatCurrency(cf)}/mo
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Trade — only visible after card drawn, before end turn */}
            {showQuickTrade && currentPlayer && (
              <QuickTrade player={currentPlayer} prices={state.marketPrices} />
            )}
          </div>
        )}

        {activeTab === 'finances' && currentPlayer && (
          <FinancesPanel player={currentPlayer} />
        )}

        {activeTab === 'market' && (
          <MarketPanel
            prices={state.marketPrices}
            initialPrices={state.initialMarketPrices}
            interestRate={state.marketPrices.interestRate}
          />
        )}

        {activeTab === 'log' && (
          <GameLog entries={state.log} />
        )}
      </div>

      {/* Bottom tab bar */}
      <nav
        className="flex flex-shrink-0"
        style={{ background: '#1a1a2e', borderTop: '1px solid #2a2a4a' }}
      >
        {(
          [
            { id: 'board', label: 'Board' },
            { id: 'finances', label: 'My Finances' },
            { id: 'market', label: 'Markets' },
            { id: 'log', label: 'Log' },
          ] as { id: Tab; label: string }[]
        ).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 py-3 text-xs font-semibold transition-colors"
            style={{
              color: activeTab === tab.id ? '#d4a853' : '#8888aa',
              borderTop: activeTab === tab.id ? '2px solid #d4a853' : '2px solid transparent',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Card modal */}
      {state.currentCard && (
        <CardModal
          card={state.currentCard}
          onClose={dismissCard}
        />
      )}
    </div>
  );
}
