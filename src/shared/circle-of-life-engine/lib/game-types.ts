import type { Card, MarketsCard } from './cards';

export type { Card, MarketsCard };

export type TileType = 'learn' | 'invest' | 'fortune' | 'event' | 'markets';

export interface Tile {
  id: number;
  type: TileType;
  isStart?: boolean;
}

export interface Asset {
  id: string;
  name: string;
  type: 'liquid' | 'illiquid';
  assetClass:
    | 'savings'
    | 'bonds'
    | 'stocks'
    | 'mutualFunds'
    | 'crypto'
    | 'gold'
    | 'silver'
    | 'property'
    | 'business'
    | 'car'
    | 'other';
  purchasePrice: number;
  currentValue: number;
  quantity?: number;
  monthlyIncome: number;
  monthlyExpense: number;
  loanBalance?: number;
  interestRate?: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  successFactorField?: string;
  successFactorBonus?: number;
  monthlyBenefit?: number;
  specialAbility?: string;
}

export interface ActiveEffect {
  id: string;
  description: string;
  remainingWeeks: number;
  type:
    | 'sick-leave'
    | 'unpaid-leave'
    | 'expense-reduction'
    | 'free-item'
    | 'wedding-expense'
    | 'other';
  value?: number;
}

export interface Player {
  id: string;
  name: string;
  color: string;
  age: { years: number; months: number };
  targetRetirementAge: number;
  position: number;
  weeksPassed: number;
  salary: number;
  otherIncome: number;
  expenses: {
    rent: number;
    food: number;
    transport: number;
    education: number;
    utilities: number;
    insurance: number;
    other: number;
  };
  cash: number;
  assets: Asset[];
  skills: Skill[];
  successFactors: Record<string, number>;
  incomeMode: 'weekly' | 'monthly';
  activeEffects: ActiveEffect[];
  isAlive: boolean;
  isBeneficiary: boolean;
}

export interface MarketPrices {
  interestRate: number;
  bonds: number;
  stocks: number;
  mutualFunds: number;
  crypto: number;
  gold: number;
  silver: number;
  propertyIndex: number;
}

export type GamePhase =
  | 'setup'
  | 'playing'
  | 'card-drawn'
  | 'market-update'
  | 'end';

export interface LogEntry {
  week: number;
  playerName: string;
  message: string;
  type: 'move' | 'card' | 'transaction' | 'market' | 'system';
}

export interface GameState {
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  round: number;
  marketPrices: MarketPrices;
  initialMarketPrices: MarketPrices;
  decks: {
    learn: string[];
    invest: string[];
    fortune: string[];
    event: string[];
    markets: string[];
  };
  currentCard: Card | MarketsCard | null;
  diceResult: number | null;
  hasRolled: boolean;
  hasDrawnCard: boolean;
  log: LogEntry[];
}
