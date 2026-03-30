import type { GameState, Player, MarketPrices, Tile, Asset, Skill, LogEntry } from './game-types';
import type { Card, MarketsCard } from './cards';
import {
  learnCards,
  investCards,
  fortuneCards,
  eventCards,
  marketsCards,
  cardById,
} from './cards';

// ─── BOARD ─────────────────────────────────────────────────────────────────────

// 26 tiles, one lap = 26 weeks = 6 months
// Pattern: Learn, Invest, Fortune, Learn, Event, Markets (×4), then Learn, Markets at end
const BOARD_PATTERN: Tile['type'][] = [
  'learn', 'invest', 'fortune', 'learn', 'event', 'markets',
  'learn', 'invest', 'fortune', 'learn', 'event', 'markets',
  'learn', 'invest', 'fortune', 'learn', 'event', 'markets',
  'learn', 'invest', 'fortune', 'learn', 'event', 'markets',
  'learn', 'markets',
];

export function buildBoard(): Tile[] {
  return BOARD_PATTERN.map((type, i) => ({
    id: i,
    type,
    isStart: i === 0,
  }));
}

export const BOARD = buildBoard();

// ─── SHUFFLE ───────────────────────────────────────────────────────────────────

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── DECKS ─────────────────────────────────────────────────────────────────────

export function initDecks(): GameState['decks'] {
  return {
    learn: shuffle(learnCards.map(c => c.id)),
    invest: shuffle(investCards.map(c => c.id)),
    fortune: shuffle(fortuneCards.map(c => c.id)),
    event: shuffle(eventCards.map(c => c.id)),
    markets: shuffle(marketsCards.map(c => c.id)),
  };
}

// ─── DICE ──────────────────────────────────────────────────────────────────────

export function rollDie(): number {
  return Math.floor(Math.random() * 6) + 1;
}

// ─── PLAYER MOVEMENT ───────────────────────────────────────────────────────────

export function movePlayer(
  player: Player,
  roll: number,
  marketPrices: MarketPrices
): {
  newPosition: number;
  incomeCollected: number;
  tilesLanded: Tile[];
  completedLaps: number;
} {
  const BOARD_SIZE = 26;
  const oldPosition = player.position;
  const newPosition = (oldPosition + roll) % BOARD_SIZE;
  const completedLaps = Math.floor((oldPosition + roll) / BOARD_SIZE);

  // Collect income for tiles passed (including landing tile)
  let incomeCollected = 0;
  const tilesLanded: Tile[] = [];

  // Unpaid leave blocks salary; sick leave only blocks new opportunities (handled in UI)
  const isSalaryBlocked = player.activeEffects.some(
    e => e.type === 'unpaid-leave' && e.remainingWeeks > 0
  );
  // Asset income still flows during both types of leave
  const assetOnlyIncome = player.assets.reduce((s, a) => s + a.monthlyIncome - a.monthlyExpense, 0);
  const effectiveMonthlyIncome = isSalaryBlocked
    ? Math.max(0, assetOnlyIncome)
    : calcTotalIncome(player);

  if (player.incomeMode === 'weekly') {
    const weeklyIncome = effectiveMonthlyIncome / 4.33;
    incomeCollected = weeklyIncome * roll;
  } else {
    const tilesFromStart = oldPosition + roll;
    const monthsCompleted = Math.floor(tilesFromStart / 6) - Math.floor(oldPosition / 6);
    incomeCollected = effectiveMonthlyIncome * monthsCompleted;
  }

  // If completed a lap: additional lap bonus (already covered by weekly/monthly)
  if (completedLaps > 0) {
    // Trigger "collect salary" on passing start — handled by incomeMode above
    // but ensure at least 1 month if monthly mode and no group passed
    if (player.incomeMode === 'monthly' && incomeCollected === 0) {
      incomeCollected = calcTotalIncome(player);
    }
  }

  for (let i = 1; i <= roll; i++) {
    tilesLanded.push(BOARD[(oldPosition + i) % BOARD_SIZE]);
  }

  return { newPosition, incomeCollected, tilesLanded, completedLaps };
}

// ─── MARKETS CARD ──────────────────────────────────────────────────────────────

export function applyMarketsCard(
  prices: MarketPrices,
  card: MarketsCard
): MarketPrices {
  const ch = card.changes;
  return {
    interestRate: prices.interestRate + (ch.interestRate ? ch.interestRate * 100 : 0),
    bonds: prices.bonds * (1 + (ch.bonds ?? 0)),
    stocks: prices.stocks * (1 + (ch.stocks ?? 0)),
    mutualFunds: prices.mutualFunds * (1 + (ch.stocks ?? 0)), // tracks stocks
    crypto: prices.crypto * (1 + (ch.crypto ?? 0)),
    gold: prices.gold * (1 + (ch.gold ?? 0)),
    silver: prices.silver * (1 + (ch.silver ?? 0)),
    propertyIndex: prices.propertyIndex * (1 + (ch.propertyIndex ?? 0)),
  };
}

// ─── INCOME & CASHFLOW ─────────────────────────────────────────────────────────

export function calcTotalIncome(player: Player): number {
  const assetIncome = player.assets.reduce((sum, a) => sum + a.monthlyIncome, 0);
  return player.salary + player.otherIncome + assetIncome;
}

export function calcTotalExpenses(player: Player): number {
  const baseExpenses = Object.values(player.expenses).reduce((s, v) => s + v, 0);
  const assetExpenses = player.assets.reduce((sum, a) => sum + a.monthlyExpense, 0);

  // Apply active effects (expense reductions)
  let reductionAmount = 0;
  for (const effect of player.activeEffects) {
    if (effect.type === 'expense-reduction' && effect.value) {
      reductionAmount += effect.value;
    }
  }

  return Math.max(0, baseExpenses + assetExpenses - reductionAmount);
}

export function calcCashflow(player: Player): number {
  return calcTotalIncome(player) - calcTotalExpenses(player);
}

export function calcNetWorth(player: Player): number {
  const assetValue = player.assets.reduce((sum, a) => sum + a.currentValue, 0);
  const totalLiabilities = player.assets.reduce(
    (sum, a) => sum + (a.loanBalance ?? 0),
    0
  );
  return player.cash + assetValue - totalLiabilities;
}

// ─── DRAW CARD ─────────────────────────────────────────────────────────────────

export function drawCard(
  deck: string[],
  deckType: string
): { card: Card; newDeck: string[] } {
  if (deck.length === 0) {
    // Rebuild and reshuffle
    const sourceMap: Record<string, Card[]> = {
      learn: learnCards,
      invest: investCards,
      fortune: fortuneCards,
      event: eventCards,
      markets: marketsCards as unknown as Card[],
    };
    const fresh = shuffle((sourceMap[deckType] ?? learnCards).map(c => c.id));
    const cardId = fresh[0];
    const card = cardById.get(cardId);
    if (!card) throw new Error(`Card not found: ${cardId}`);
    return { card, newDeck: fresh.slice(1) };
  }

  const [cardId, ...rest] = deck;
  const card = cardById.get(cardId);
  if (!card) throw new Error(`Card not found: ${cardId}`);

  // If reshuffle card: rebuild deck and draw again
  if (card.isReshuffle) {
    const sourceMap: Record<string, Card[]> = {
      learn: learnCards,
      invest: investCards,
      fortune: fortuneCards,
      event: eventCards,
      markets: marketsCards as unknown as Card[],
    };
    const fresh = shuffle((sourceMap[deckType] ?? learnCards).map(c => c.id));
    // Return the reshuffle card itself so UI can show it, newDeck is fully reshuffled
    return { card, newDeck: fresh };
  }

  return { card, newDeck: rest };
}

// ─── DEFAULTS ──────────────────────────────────────────────────────────────────

export const DEFAULT_MARKET_PRICES: MarketPrices = {
  interestRate: 4,
  bonds: 90,
  stocks: 6000,
  mutualFunds: 6000,
  crypto: 100000,
  gold: 2800,
  silver: 30,
  propertyIndex: 100,
};

// ─── CREATE PLAYER ─────────────────────────────────────────────────────────────

export function createPlayer(name: string, color: string): Player {
  return {
    id: `player-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name,
    color,
    age: { years: 25, months: 0 },
    targetRetirementAge: 60,
    position: 0,
    weeksPassed: 0,
    salary: 10000,
    otherIncome: 0,
    expenses: {
      rent: 3000,
      food: 1000,
      transport: 500,
      education: 0,
      utilities: 300,
      insurance: 200,
      other: 200,
    },
    cash: 50000,
    assets: [],
    skills: [],
    successFactors: {},
    incomeMode: 'weekly',
    activeEffects: [],
    isAlive: true,
    isBeneficiary: false,
  };
}

// ─── AGE ADVANCE ───────────────────────────────────────────────────────────────

export function advanceAge(
  age: Player['age'],
  weeks: number
): Player['age'] {
  const totalMonths = age.years * 12 + age.months + Math.floor(weeks / 4.33);
  return {
    years: Math.floor(totalMonths / 12),
    months: Math.round(totalMonths % 12),
  };
}

// ─── FORMAT HELPERS ────────────────────────────────────────────────────────────

export function formatCurrency(n: number): string {
  const abs = Math.abs(n);
  if (abs >= 1_000_000) {
    return `${n < 0 ? '-' : ''}${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${n < 0 ? '-' : ''}${(abs / 1_000).toFixed(1)}K`;
  }
  return `${n < 0 ? '-' : ''}${abs.toFixed(0)}`;
}

// ─── APPLY ACTIVE EFFECTS TICK ─────────────────────────────────────────────────

export function tickActiveEffects(player: Player): Player {
  const updated = player.activeEffects
    .map(e => ({ ...e, remainingWeeks: e.remainingWeeks - 1 }))
    .filter(e => e.remainingWeeks > 0);
  return { ...player, activeEffects: updated };
}

// ─── APPLY ASSET PRICE UPDATES ─────────────────────────────────────────────────

export function updateAssetValues(
  player: Player,
  oldPrices: MarketPrices,
  newPrices: MarketPrices
): Player {
  const updatedAssets = player.assets.map((asset): Asset => {
    let ratio = 1;
    switch (asset.assetClass) {
      case 'bonds':
        ratio = oldPrices.bonds > 0 ? newPrices.bonds / oldPrices.bonds : 1;
        break;
      case 'stocks':
      case 'mutualFunds':
        ratio = oldPrices.stocks > 0 ? newPrices.stocks / oldPrices.stocks : 1;
        break;
      case 'crypto':
        ratio = oldPrices.crypto > 0 ? newPrices.crypto / oldPrices.crypto : 1;
        break;
      case 'gold':
        ratio = oldPrices.gold > 0 ? newPrices.gold / oldPrices.gold : 1;
        break;
      case 'silver':
        ratio = oldPrices.silver > 0 ? newPrices.silver / oldPrices.silver : 1;
        break;
      case 'property':
        ratio =
          oldPrices.propertyIndex > 0
            ? newPrices.propertyIndex / oldPrices.propertyIndex
            : 1;
        break;
      default:
        ratio = 1;
    }
    return { ...asset, currentValue: asset.currentValue * ratio };
  });
  return { ...player, assets: updatedAssets };
}

// ─── LOG ENTRY ─────────────────────────────────────────────────────────────────

export function makeLog(
  player: Player,
  message: string,
  type: LogEntry['type']
): LogEntry {
  return {
    week: player.weeksPassed,
    playerName: player.name,
    message,
    type,
  };
}
