'use client';

import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react';
import type { GameState, Player, Asset, Skill, LogEntry, MarketPrices } from './game-types';
import type { Card, MarketsCard } from './cards';
import {
  buildBoard,
  initDecks,
  rollDie,
  movePlayer,
  applyMarketsCard,
  calcCashflow,
  calcNetWorth,
  drawCard,
  DEFAULT_MARKET_PRICES,
  createPlayer,
  tickActiveEffects,
  updateAssetValues,
  makeLog,
  advanceAge,
} from './game-engine';


// ─── ACTION TYPES ──────────────────────────────────────────────────────────────

type PlayerSetup = {
  name: string;
  color: string;
  age: { years: number; months: number };
  targetRetirementAge: number;
  salary: number;
  cash: number;
  expenses: Player['expenses'];
  incomeMode: 'weekly' | 'monthly';
};

export interface CardEffect {
  cashDelta?: number;
  salaryMultiplier?: number;
  expensesDelta?: Partial<Player['expenses']>;
  monthlyExpenseDelta?: number;   // added to expenses.other
  activeEffectToAdd?: import('./game-types').ActiveEffect;
  description: string;
}

type Action =
  | { type: 'START_GAME'; players: PlayerSetup[]; marketPrices: MarketPrices }
  | { type: 'ROLL_DICE' }
  | { type: 'DRAW_CARD' }
  | { type: 'DISMISS_CARD' }
  | { type: 'APPLY_MARKETS_CARD'; card: MarketsCard }
  | { type: 'APPLY_CARD_EFFECT'; playerId: string; effect: CardEffect }
  | {
      type: 'UPDATE_PLAYER_FINANCES';
      playerId: string;
      updates: Partial<
        Pick<Player, 'salary' | 'otherIncome' | 'expenses' | 'cash'>
      >;
    }
  | { type: 'BUY_ASSET'; playerId: string; asset: Asset }
  | { type: 'SELL_ASSET'; playerId: string; assetId: string; salePrice: number }
  | { type: 'PARTIAL_SELL_ASSET'; playerId: string; assetId: string; sellFraction: number; saleProceeds: number }
  | { type: 'ADD_SKILL'; playerId: string; skill: Skill }
  | { type: 'NEXT_PLAYER' }
  | { type: 'ADD_LOG'; entry: LogEntry };

// ─── INITIAL STATE ─────────────────────────────────────────────────────────────

const INITIAL_STATE: GameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  round: 0,
  marketPrices: DEFAULT_MARKET_PRICES,
  initialMarketPrices: DEFAULT_MARKET_PRICES,
  decks: { learn: [], invest: [], fortune: [], event: [], markets: [] },
  currentCard: null,
  diceResult: null,
  hasRolled: false,
  hasDrawnCard: false,
  log: [],
};

// ─── REDUCER ───────────────────────────────────────────────────────────────────

function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const players: Player[] = action.players.map(p => ({
        ...createPlayer(p.name, p.color),
        age: p.age,
        targetRetirementAge: p.targetRetirementAge,
        salary: p.salary,
        cash: p.cash,
        expenses: p.expenses,
        incomeMode: p.incomeMode,
      }));
      return {
        ...INITIAL_STATE,
        phase: 'playing',
        players,
        marketPrices: action.marketPrices,
        initialMarketPrices: action.marketPrices,
        hasDrawnCard: false,
        decks: initDecks(),
        log: [
          {
            week: 0,
            playerName: 'Game',
            message: `Game started with ${players.length} player(s): ${players.map(p => p.name).join(', ')}`,
            type: 'system',
          },
        ],
      };
    }

    case 'ROLL_DICE': {
      if (state.hasRolled || state.phase !== 'playing') return state;
      const roll = rollDie();
      const currentPlayer = state.players[state.currentPlayerIndex];

      const { newPosition, incomeCollected, completedLaps } = movePlayer(
        currentPlayer,
        roll,
        state.marketPrices
      );

      const landedTile = buildBoard()[newPosition];
      const newWeeksPassed = currentPlayer.weeksPassed + roll;
      const newAge = advanceAge(currentPlayer.age, roll);

      // Tick active effects
      let updatedPlayer = tickActiveEffects({
        ...currentPlayer,
        position: newPosition,
        weeksPassed: newWeeksPassed,
        age: newAge,
        cash: currentPlayer.cash + incomeCollected,
      });

      // Update round if all players have moved (simplified: track by lap)
      const newRound = state.round + completedLaps;

      const players = state.players.map((p, i) =>
        i === state.currentPlayerIndex ? updatedPlayer : p
      );

      const logEntry = makeLog(
        updatedPlayer,
        `Rolled ${roll}. Moved to tile ${newPosition + 1} (${landedTile.type.toUpperCase()}). Income collected: ${incomeCollected.toFixed(0)}.`,
        'move'
      );

      return {
        ...state,
        players,
        diceResult: roll,
        hasRolled: true,
        round: newRound,
        log: [...state.log, logEntry],
      };
    }

    case 'DRAW_CARD': {
      if (!state.hasRolled || state.currentCard !== null || state.hasDrawnCard) return state;
      const currentPlayer = state.players[state.currentPlayerIndex];
      const tileType = buildBoard()[currentPlayer.position].type;

      const deckKey = tileType as keyof GameState['decks'];
      const currentDeck = state.decks[deckKey];

      const { card, newDeck } = drawCard(currentDeck, tileType);

      const newPhase: GameState['phase'] =
        tileType === 'markets' ? 'market-update' : 'card-drawn';

      const logEntry = makeLog(
        currentPlayer,
        `Drew ${card.type.toUpperCase()} card: "${card.title}"`,
        'card'
      );

      return {
        ...state,
        phase: newPhase,
        currentCard: card,
        hasDrawnCard: true,
        decks: { ...state.decks, [deckKey]: newDeck },
        log: [...state.log, logEntry],
      };
    }

    case 'APPLY_MARKETS_CARD': {
      const card = action.card;
      const oldPrices = state.marketPrices;
      const newPrices = applyMarketsCard(oldPrices, card);

      // Update all player asset values
      const players = state.players.map(p =>
        updateAssetValues(p, oldPrices, newPrices)
      );

      const logEntry: LogEntry = {
        week: state.players[state.currentPlayerIndex]?.weeksPassed ?? 0,
        playerName: 'Market',
        message: `Markets updated: ${card.title}`,
        type: 'market',
      };

      return {
        ...state,
        marketPrices: newPrices,
        players,
        log: [...state.log, logEntry],
      };
    }

    case 'DISMISS_CARD': {
      return {
        ...state,
        phase: 'playing',
        currentCard: null,
      };
    }

    case 'NEXT_PLAYER': {
      const nextIndex = (state.currentPlayerIndex + 1) % state.players.length;
      const nextPlayer = state.players[nextIndex];

      const logEntry: LogEntry = {
        week: nextPlayer.weeksPassed,
        playerName: nextPlayer.name,
        message: `${nextPlayer.name}'s turn begins.`,
        type: 'system',
      };

      return {
        ...state,
        currentPlayerIndex: nextIndex,
        currentCard: null,
        diceResult: null,
        hasRolled: false,
        hasDrawnCard: false,
        phase: 'playing',
        log: [...state.log, logEntry],
      };
    }

    case 'UPDATE_PLAYER_FINANCES': {
      const players = state.players.map(p =>
        p.id === action.playerId ? { ...p, ...action.updates } : p
      );
      return { ...state, players };
    }

    case 'BUY_ASSET': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        const cost = action.asset.purchasePrice - (action.asset.loanBalance ?? 0);
        return {
          ...p,
          cash: p.cash - cost,
          assets: [...p.assets, action.asset],
        };
      });
      const buyer = players.find(p => p.id === action.playerId);
      const logEntry: LogEntry = {
        week: buyer?.weeksPassed ?? 0,
        playerName: buyer?.name ?? '',
        message: `Purchased asset: ${action.asset.name} for ${action.asset.purchasePrice.toLocaleString()}`,
        type: 'transaction',
      };
      return { ...state, players, log: [...state.log, logEntry] };
    }

    case 'SELL_ASSET': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        const asset = p.assets.find(a => a.id === action.assetId);
        if (!asset) return p;
        const loanBalance = asset.loanBalance ?? 0;
        const proceeds = action.salePrice - loanBalance;
        return {
          ...p,
          cash: p.cash + proceeds,
          assets: p.assets.filter(a => a.id !== action.assetId),
        };
      });
      const seller = players.find(p => p.id === action.playerId);
      const logEntry: LogEntry = {
        week: seller?.weeksPassed ?? 0,
        playerName: seller?.name ?? '',
        message: `Sold asset for ${action.salePrice.toLocaleString()}`,
        type: 'transaction',
      };
      return { ...state, players, log: [...state.log, logEntry] };
    }

    case 'PARTIAL_SELL_ASSET': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        const asset = p.assets.find(a => a.id === action.assetId);
        if (!asset) return p;
        const remaining = 1 - action.sellFraction;
        if (remaining <= 0.001) {
          // Full sell
          const loanBalance = asset.loanBalance ?? 0;
          return {
            ...p,
            cash: p.cash + action.saleProceeds - loanBalance,
            assets: p.assets.filter(a => a.id !== action.assetId),
          };
        }
        // Partial sell — scale down the asset
        const updatedAsset = {
          ...asset,
          purchasePrice: asset.purchasePrice * remaining,
          currentValue: asset.currentValue * remaining,
          quantity: (asset.quantity ?? 1) * remaining,
          monthlyIncome: asset.monthlyIncome * remaining,
          monthlyExpense: asset.monthlyExpense * remaining,
          loanBalance: asset.loanBalance ? asset.loanBalance * remaining : undefined,
        };
        return {
          ...p,
          cash: p.cash + action.saleProceeds,
          assets: p.assets.map(a => a.id === action.assetId ? updatedAsset : a),
        };
      });
      const seller = players.find(p => p.id === action.playerId);
      const logEntry: LogEntry = {
        week: seller?.weeksPassed ?? 0,
        playerName: seller?.name ?? '',
        message: `Sold ${(action.sellFraction * 100).toFixed(0)}% of ${state.players.find(p => p.id === action.playerId)?.assets.find(a => a.id === action.assetId)?.name ?? 'asset'} for ${action.saleProceeds.toLocaleString()}`,
        type: 'transaction',
      };
      return { ...state, players, log: [...state.log, logEntry] };
    }

    case 'ADD_SKILL': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        // Update success factors if applicable
        const newFactors = { ...p.successFactors };
        if (action.skill.successFactorField) {
          newFactors[action.skill.successFactorField] =
            (newFactors[action.skill.successFactorField] ?? 0) +
            (action.skill.successFactorBonus ?? 1);
        }
        return {
          ...p,
          skills: [...p.skills, action.skill],
          successFactors: newFactors,
        };
      });
      return { ...state, players };
    }

    case 'APPLY_CARD_EFFECT': {
      const players = state.players.map(p => {
        if (p.id !== action.playerId) return p;
        const e = action.effect;
        let newCash = p.cash + (e.cashDelta ?? 0);
        let newSalary = e.salaryMultiplier ? p.salary * e.salaryMultiplier : p.salary;
        const newExpenses = { ...p.expenses };
        if (e.expensesDelta) {
          (Object.keys(e.expensesDelta) as (keyof Player['expenses'])[]).forEach(k => {
            newExpenses[k] = (newExpenses[k] ?? 0) + (e.expensesDelta![k] ?? 0);
            if (newExpenses[k] < 0) newExpenses[k] = 0;
          });
        }
        if (e.monthlyExpenseDelta) {
          newExpenses.other = Math.max(0, (newExpenses.other ?? 0) + e.monthlyExpenseDelta);
        }
        const newActiveEffects = e.activeEffectToAdd
          ? [...p.activeEffects, e.activeEffectToAdd]
          : p.activeEffects;
        return { ...p, cash: newCash, salary: newSalary, expenses: newExpenses, activeEffects: newActiveEffects };
      });
      const affected = players.find(p => p.id === action.playerId);
      const logEntry: LogEntry = {
        week: affected?.weeksPassed ?? 0,
        playerName: affected?.name ?? '',
        message: action.effect.description,
        type: 'transaction',
      };
      return { ...state, players, log: [...state.log, logEntry] };
    }

    case 'ADD_LOG': {
      return { ...state, log: [...state.log, action.entry] };
    }

    default:
      return state;
  }
}

// ─── CONTEXT ───────────────────────────────────────────────────────────────────

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  currentPlayer: Player | null;
  startGame: (players: PlayerSetup[], marketPrices: MarketPrices) => void;
  rollDiceAction: () => void;
  drawCardAction: () => void;
  dismissCard: () => void;
  applyMarketsCardAction: (card: MarketsCard) => void;
  applyCardEffect: (playerId: string, effect: CardEffect) => void;
  nextPlayer: () => void;
  updateFinances: (
    playerId: string,
    updates: Partial<Pick<Player, 'salary' | 'otherIncome' | 'expenses' | 'cash'>>
  ) => void;
  buyAsset: (playerId: string, asset: Asset) => void;
  sellAsset: (playerId: string, assetId: string, salePrice: number) => void;
  partialSellAsset: (playerId: string, assetId: string, sellFraction: number, saleProceeds: number) => void;
  addSkill: (playerId: string, skill: Skill) => void;
  getCashflow: (player: Player) => number;
  getNetWorth: (player: Player) => number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);

  const currentPlayer = state.players[state.currentPlayerIndex] ?? null;

  const startGame = useCallback(
    (players: PlayerSetup[], marketPrices: MarketPrices) => {
      dispatch({ type: 'START_GAME', players, marketPrices });
    },
    []
  );

  const rollDiceAction = useCallback(() => {
    dispatch({ type: 'ROLL_DICE' });
  }, []);

  const drawCardAction = useCallback(() => {
    dispatch({ type: 'DRAW_CARD' });
  }, []);

  const dismissCard = useCallback(() => {
    dispatch({ type: 'DISMISS_CARD' });
  }, []);

  const applyMarketsCardAction = useCallback((card: MarketsCard) => {
    dispatch({ type: 'APPLY_MARKETS_CARD', card });
  }, []);

  const applyCardEffect = useCallback((playerId: string, effect: CardEffect) => {
    dispatch({ type: 'APPLY_CARD_EFFECT', playerId, effect });
  }, []);

  const nextPlayer = useCallback(() => {
    dispatch({ type: 'NEXT_PLAYER' });
  }, []);

  const updateFinances = useCallback(
    (
      playerId: string,
      updates: Partial<Pick<Player, 'salary' | 'otherIncome' | 'expenses' | 'cash'>>
    ) => {
      dispatch({ type: 'UPDATE_PLAYER_FINANCES', playerId, updates });
    },
    []
  );

  const buyAsset = useCallback((playerId: string, asset: Asset) => {
    dispatch({ type: 'BUY_ASSET', playerId, asset });
  }, []);

  const sellAsset = useCallback(
    (playerId: string, assetId: string, salePrice: number) => {
      dispatch({ type: 'SELL_ASSET', playerId, assetId, salePrice });
    },
    []
  );

  const partialSellAsset = useCallback(
    (playerId: string, assetId: string, sellFraction: number, saleProceeds: number) => {
      dispatch({ type: 'PARTIAL_SELL_ASSET', playerId, assetId, sellFraction, saleProceeds });
    },
    []
  );

  const addSkill = useCallback((playerId: string, skill: Skill) => {
    dispatch({ type: 'ADD_SKILL', playerId, skill });
  }, []);

  const getCashflow = useCallback((player: Player) => calcCashflow(player), []);
  const getNetWorth = useCallback((player: Player) => calcNetWorth(player), []);

  const value: GameContextValue = {
    state,
    dispatch,
    currentPlayer,
    startGame,
    rollDiceAction,
    drawCardAction,
    dismissCard,
    applyMarketsCardAction,
    applyCardEffect,
    nextPlayer,
    updateFinances,
    buyAsset,
    sellAsset,
    partialSellAsset,
    addSkill,
    getCashflow,
    getNetWorth,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}
