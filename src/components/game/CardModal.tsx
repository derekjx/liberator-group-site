'use client';

import React, { useState } from 'react';
import type { Card, MarketsCard } from '@/lib/game/cards';
import type { Asset, Skill, Player } from '@/lib/game/game-types';
import { useGame } from '@/lib/game/game-context';
import type { CardEffect } from '@/lib/game/game-context';

interface CardModalProps {
  card: Card | MarketsCard;
  onClose: () => void;
}

const TYPE_COLORS: Record<string, string> = {
  learn: '#3B82F6',
  invest: '#22C55E',
  fortune: '#EAB308',
  event: '#EF4444',
  markets: '#A855F7',
};

const TYPE_LABELS: Record<string, string> = {
  learn: 'Learn',
  invest: 'Invest',
  fortune: 'Fortune',
  event: 'Event',
  markets: 'Markets',
};

// ─── Parsers ───────────────────────────────────────────────────────────────────

function parseLearnCost(description: string): number {
  const forMatch = description.match(/for\s+([\d,]+)/i);
  if (forMatch) return parseInt(forMatch[1].replace(/,/g, ''), 10);
  const payMatch = description.match(/[Pp]ay\s+([\d,]+)/);
  if (payMatch) return parseInt(payMatch[1].replace(/,/g, ''), 10);
  if (/\bfree\b/i.test(description)) return 0;
  return 0;
}

function parseSuccessFactorFromDesc(description: string): { field: string; bonus: number } | null {
  const match = description.match(/Success Factor \+(\d+) in ([A-Za-z\s]+)/);
  if (match) return { field: match[2].trim(), bonus: parseInt(match[1], 10) };
  if (/Success Factor \+1 in all fields/i.test(description)) return { field: 'all', bonus: 1 };
  return null;
}

function parseSpecialAbility(description: string): string | undefined {
  if (/trade and invest in stocks and bonds/i.test(description)) return 'trade-stocks-anytime';
  if (/trade and invest in cryptocurrency/i.test(description)) return 'trade-crypto-anytime';
  if (/find and purchase a business/i.test(description)) return 'buy-business-anytime';
  if (/find and purchase a property/i.test(description)) return 'buy-property-anytime';
  if (/Tax Audit.*do not need to pay/i.test(description)) return 'tax-audit-immunity';
  if (/write a will/i.test(description)) return 'has-will';
  return undefined;
}

function parseMonthlyBenefit(description: string): number {
  const match = description.match(/[Rr]educe.*?by\s+([\d,]+)/);
  return match ? parseInt(match[1].replace(/,/g, ''), 10) : 0;
}

interface PropertyInvestData {
  kind: 'property';
  price: number;
  annualRental: number;
  annualServiceCharge: number;
}

interface BusinessInvestData {
  kind: 'business';
  price: number;
  monthlyIncome: number;
}

interface LiquidInvestData {
  kind: 'liquid';
  assetClass: Asset['assetClass'];
  label: string;
  priceKey: string; // key into marketPrices
  isSell?: boolean;
  discount?: number; // e.g. -0.05 = 5% below market
}

interface AirdropData {
  kind: 'airdrop';
}

type InvestData = PropertyInvestData | BusinessInvestData | LiquidInvestData | AirdropData;

function parseInvestCard(card: Card, marketPrices: Record<string, number>): InvestData {
  const desc = card.description;
  const title = card.title.toLowerCase();

  // Property
  if (title.includes('property') || title.includes('apartment') || title.includes('shop')) {
    const priceMatch = desc.match(/([\d,]+),?\s*(?:annual rental|with an annual)/);
    const rentalMatch = desc.match(/annual rental.*?([\d,]+)/);
    const serviceMatch = desc.match(/service charges.*?([\d,]+)/);
    return {
      kind: 'property',
      price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 0,
      annualRental: rentalMatch ? parseInt(rentalMatch[1].replace(/,/g, ''), 10) : 0,
      annualServiceCharge: serviceMatch ? parseInt(serviceMatch[1].replace(/,/g, ''), 10) : 0,
    };
  }

  // Business
  if (title.includes('business') || title.includes('franchise')) {
    const priceMatch = desc.match(/for\s+([\d,]+)/i);
    const incomeMatch = desc.match(/monthly income.*?([\d,]+)/i);
    return {
      kind: 'business',
      price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, ''), 10) : 10000,
      monthlyIncome: incomeMatch ? parseInt(incomeMatch[1].replace(/,/g, ''), 10) : 0,
    };
  }

  // Airdrop
  if (/airdrop/i.test(desc)) return { kind: 'airdrop' };

  // Liquid assets
  const discountMatch = desc.match(/(\d+)%\s*(?:below|discount)/i);
  const aboveMatch = desc.match(/\+(\d+)%\s*above/i);
  const isSell = /sell/i.test(desc);
  const discount = discountMatch ? -parseInt(discountMatch[1], 10) / 100
    : aboveMatch ? parseInt(aboveMatch[1], 10) / 100 : 0;

  if (title.includes('gold')) return { kind: 'liquid', assetClass: 'gold', label: 'Gold', priceKey: 'gold', isSell, discount };
  if (title.includes('silver')) return { kind: 'liquid', assetClass: 'silver', label: 'Silver', priceKey: 'silver', isSell, discount };
  if (title.includes('crypto')) return { kind: 'liquid', assetClass: 'crypto', label: 'Cryptocurrency', priceKey: 'crypto', isSell, discount };
  if (title.includes('bond')) return { kind: 'liquid', assetClass: 'bonds', label: 'Bonds', priceKey: 'bonds', isSell, discount };
  if (title.includes('stock') || title.includes('mutual fund')) return { kind: 'liquid', assetClass: 'stocks', label: 'Stocks / Funds', priceKey: 'stocks', isSell, discount };

  return { kind: 'liquid', assetClass: 'other', label: card.title, priceKey: 'stocks', isSell, discount };
}

// ─── Markets changes display ───────────────────────────────────────────────────

function MarketsChanges({ changes }: { changes: MarketsCard['changes'] }) {
  const fields: { key: keyof MarketsCard['changes']; label: string }[] = [
    { key: 'interestRate', label: 'Interest Rate' },
    { key: 'bonds', label: 'Bonds' },
    { key: 'stocks', label: 'Stocks' },
    { key: 'propertyIndex', label: 'Property Index' },
    { key: 'gold', label: 'Gold' },
    { key: 'silver', label: 'Silver' },
    { key: 'crypto', label: 'Cryptocurrency' },
  ];
  const relevant = fields.filter(f => changes[f.key] !== undefined && changes[f.key] !== 0);
  if (relevant.length === 0) return null;
  return (
    <div className="mt-4 rounded-lg p-3" style={{ background: '#0f0f1a' }}>
      <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>PRICE CHANGES</p>
      <div className="grid grid-cols-2 gap-2">
        {relevant.map(({ key, label }) => {
          const val = changes[key] ?? 0;
          const pct = (val * 100).toFixed(1);
          const isPos = val > 0;
          return (
            <div key={key} className="flex items-center justify-between">
              <span className="text-xs" style={{ color: '#f0f0f0' }}>{label}</span>
              <span className="text-xs font-bold" style={{ color: isPos ? '#22C55E' : '#EF4444' }}>
                {isPos ? '+' : ''}{pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Learn action panel ────────────────────────────────────────────────────────

function LearnActionPanel({
  card,
  color,
  onAccept,
  onDecline,
}: {
  card: Card;
  color: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  const cost = parseLearnCost(card.description);
  const sf = parseSuccessFactorFromDesc(card.description);
  const ability = parseSpecialAbility(card.description);
  const benefit = parseMonthlyBenefit(card.description);

  return (
    <div className="mt-5 space-y-3">
      {/* What you get */}
      <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
        <p className="text-xs font-semibold" style={{ color: '#8888aa' }}>WHAT YOU GET</p>
        {cost > 0 && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Cost</span>
            <span style={{ color: '#EF4444' }}>-{cost.toLocaleString()}</span>
          </div>
        )}
        {cost === 0 && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Cost</span>
            <span style={{ color: '#22C55E' }}>Free</span>
          </div>
        )}
        {sf && sf.field !== 'all' && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Success Factor</span>
            <span style={{ color: '#22C55E' }}>+{sf.bonus} in {sf.field}</span>
          </div>
        )}
        {sf && sf.field === 'all' && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Success Factor</span>
            <span style={{ color: '#22C55E' }}>+{sf.bonus} in all fields</span>
          </div>
        )}
        {benefit > 0 && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Monthly saving</span>
            <span style={{ color: '#22C55E' }}>up to {benefit.toLocaleString()}/mo</span>
          </div>
        )}
        {ability && (
          <div className="flex justify-between text-xs">
            <span style={{ color: '#f0f0f0' }}>Unlocks</span>
            <span style={{ color: '#3B82F6' }}>Special ability</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#1a1a2e', color: '#8888aa', border: '1px solid #333' }}
        >
          Decline
        </button>
        <button
          onClick={onAccept}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold"
          style={{ background: color, color: '#0f0f1a' }}
        >
          {cost > 0 ? `Learn — Pay ${cost.toLocaleString()}` : 'Learn — Free'}
        </button>
      </div>
    </div>
  );
}

// ─── Invest action panel ───────────────────────────────────────────────────────

function InvestActionPanel({
  card,
  color,
  marketPrices,
  onAccept,
  onDecline,
}: {
  card: Card;
  color: string;
  marketPrices: Record<string, number>;
  onAccept: (asset: Asset) => void;
  onDecline: () => void;
}) {
  const data = parseInvestCard(card, marketPrices);
  const [investAmount, setInvestAmount] = useState('');
  const [useLoan, setUseLoan] = useState(false);
  const [loanPercent, setLoanPercent] = useState(80);
  const [assetName, setAssetName] = useState(card.title);

  if (data.kind === 'airdrop') {
    return (
      <div className="mt-5">
        <p className="text-xs mb-3" style={{ color: '#8888aa' }}>
          Airdrop is received automatically — no payment required.
        </p>
        <button
          onClick={onDecline}
          className="w-full py-2.5 rounded-xl text-sm font-bold"
          style={{ background: color, color: '#0f0f1a' }}
        >
          Got it
        </button>
      </div>
    );
  }

  if (data.kind === 'property') {
    const monthlyRental = Math.round(data.annualRental / 12);
    const monthlyService = Math.round(data.annualServiceCharge / 12);
    const loanAmount = useLoan ? Math.round(data.price * loanPercent / 100) : 0;
    const cashNeeded = data.price - loanAmount;
    const marketRate = (marketPrices['interestRate'] ?? 4);
    const mortgageRate = marketRate + 1;
    const monthlyLoanRepayment = loanAmount > 0
      ? Math.round(loanAmount * (mortgageRate / 100 / 12) / (1 - Math.pow(1 + mortgageRate / 100 / 12, -300)))
      : 0;
    const netMonthlyIncome = monthlyRental - monthlyService - monthlyLoanRepayment;

    const handleBuy = () => {
      const asset: Asset = {
        id: `${card.id}-${Date.now()}`,
        name: assetName,
        type: 'illiquid',
        assetClass: 'property',
        purchasePrice: data.price,
        currentValue: data.price,
        monthlyIncome: monthlyRental,
        monthlyExpense: monthlyService + monthlyLoanRepayment,
        loanBalance: loanAmount || undefined,
        interestRate: loanAmount > 0 ? mortgageRate : undefined,
      };
      onAccept(asset);
    };

    return (
      <div className="mt-4 space-y-3">
        <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>PROPERTY DETAILS</p>
          <Row label="Purchase Price" value={data.price.toLocaleString()} color="#f0f0f0" />
          <Row label="Annual Rental" value={`${data.annualRental.toLocaleString()} (${monthlyRental.toLocaleString()}/mo)`} color="#22C55E" />
          <Row label="Service Charges" value={`${monthlyService.toLocaleString()}/mo`} color="#EF4444" />
          {loanAmount > 0 && <Row label={`Mortgage (${mortgageRate.toFixed(1)}%)`} value={`${monthlyLoanRepayment.toLocaleString()}/mo`} color="#EF4444" />}
          <div className="h-px my-1" style={{ background: '#2a2a4a' }} />
          <Row
            label="Net Monthly Cashflow"
            value={`${netMonthlyIncome >= 0 ? '+' : ''}${netMonthlyIncome.toLocaleString()}/mo`}
            color={netMonthlyIncome >= 0 ? '#22C55E' : '#EF4444'}
            bold
          />
          <Row label="Cash Needed" value={cashNeeded.toLocaleString()} color="#EAB308" bold />
        </div>

        <div>
          <label className="text-xs" style={{ color: '#8888aa' }}>Property name / label</label>
          <input
            type="text"
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
            style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setUseLoan(!useLoan)}
            className="flex items-center gap-2 text-xs"
            style={{ color: useLoan ? '#d4a853' : '#8888aa' }}
          >
            <div
              className="w-4 h-4 rounded flex items-center justify-center"
              style={{ background: useLoan ? '#d4a853' : '#333', border: '1px solid #555' }}
            >
              {useLoan && <span style={{ color: '#0f0f1a', fontSize: '10px' }}>✓</span>}
            </div>
            Take mortgage loan
          </button>
          {useLoan && (
            <div className="flex items-center gap-2 flex-1">
              <input
                type="range"
                min={10}
                max={90}
                value={loanPercent}
                onChange={e => setLoanPercent(parseInt(e.target.value, 10))}
                className="flex-1"
              />
              <span className="text-xs w-8" style={{ color: '#d4a853' }}>{loanPercent}%</span>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#1a1a2e', color: '#8888aa', border: '1px solid #333' }}
          >
            Pass
          </button>
          <button
            onClick={handleBuy}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: color, color: '#0f0f1a' }}
          >
            Buy — {cashNeeded.toLocaleString()} cash
          </button>
        </div>
      </div>
    );
  }

  if (data.kind === 'business') {
    const handleBuy = () => {
      const asset: Asset = {
        id: `${card.id}-${Date.now()}`,
        name: assetName,
        type: 'illiquid',
        assetClass: 'business',
        purchasePrice: data.price,
        currentValue: data.price,
        monthlyIncome: data.monthlyIncome,
        monthlyExpense: 0,
      };
      onAccept(asset);
    };

    return (
      <div className="mt-4 space-y-3">
        <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
          <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>BUSINESS DETAILS</p>
          <Row label="Purchase Price" value={data.price.toLocaleString()} color="#f0f0f0" />
          <Row label="Monthly Income" value={`${data.monthlyIncome.toLocaleString()}/mo`} color="#22C55E" bold />
          <Row label="Annual Yield" value={`${((data.monthlyIncome * 12 / data.price) * 100).toFixed(1)}%`} color="#EAB308" />
        </div>
        <div>
          <label className="text-xs" style={{ color: '#8888aa' }}>Business name / label</label>
          <input
            type="text"
            value={assetName}
            onChange={e => setAssetName(e.target.value)}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
            style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={onDecline}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: '#1a1a2e', color: '#8888aa', border: '1px solid #333' }}
          >
            Pass
          </button>
          <button
            onClick={handleBuy}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold"
            style={{ background: color, color: '#0f0f1a' }}
          >
            Buy — {data.price.toLocaleString()} cash
          </button>
        </div>
      </div>
    );
  }

  // Liquid asset
  const currentPrice = (marketPrices[data.priceKey] ?? 0) * (1 + (data.discount ?? 0));
  const amount = parseFloat(investAmount) || 0;
  const units = currentPrice > 0 ? amount / currentPrice : 0;

  const handleBuyLiquid = () => {
    if (amount <= 0) return;
    const asset: Asset = {
      id: `${card.id}-${Date.now()}`,
      name: data.label,
      type: 'liquid',
      assetClass: data.assetClass,
      purchasePrice: amount,
      currentValue: amount,
      quantity: units,
      monthlyIncome: 0,
      monthlyExpense: 0,
    };
    onAccept(asset);
  };

  return (
    <div className="mt-4 space-y-3">
      <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>MARKET DETAILS</p>
        <Row
          label={`Current ${data.label} price`}
          value={currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}
          color="#f0f0f0"
        />
        {(data.discount ?? 0) !== 0 && (
          <Row
            label="Your discount"
            value={`${((data.discount ?? 0) * 100).toFixed(0)}%`}
            color={(data.discount ?? 0) < 0 ? '#22C55E' : '#EF4444'}
          />
        )}
      </div>

      <div>
        <label className="text-xs" style={{ color: '#8888aa' }}>
          Amount to invest (in cash)
        </label>
        <input
          type="number"
          value={investAmount}
          onChange={e => setInvestAmount(e.target.value)}
          placeholder="0"
          className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
          style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
        />
        {amount > 0 && currentPrice > 0 && (
          <p className="text-xs mt-1" style={{ color: '#8888aa' }}>
            ≈ {units.toFixed(4)} units of {data.label}
          </p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={onDecline}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
          style={{ background: '#1a1a2e', color: '#8888aa', border: '1px solid #333' }}
        >
          Pass
        </button>
        <button
          onClick={handleBuyLiquid}
          disabled={amount <= 0}
          className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-opacity"
          style={{
            background: color,
            color: '#0f0f1a',
            opacity: amount <= 0 ? 0.4 : 1,
          }}
        >
          Invest {amount > 0 ? amount.toLocaleString() : ''}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value, color, bold }: { label: string; value: string; color: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs" style={{ color: '#8888aa' }}>{label}</span>
      <span className={`text-xs ${bold ? 'font-bold' : ''}`} style={{ color }}>{value}</span>
    </div>
  );
}

// ─── Fortune / Event effect parsers ──────────────────────────────────────────

function parseFortuneEffect(card: Card, player: Player): CardEffect {
  const desc = card.description + ' ' + card.title;
  const lines: string[] = [];
  let cashDelta = 0;
  let salaryMultiplier: number | undefined;

  // Large cash amounts: "Receive 1,000,000" / "inheritance of 100,000" / "refund of 5,000"
  const receiveMatch = desc.match(/[Rr]eceive\s+([\d,]+)/);
  if (receiveMatch) { cashDelta += parseInt(receiveMatch[1].replace(/,/g, ''), 10); }

  const inheritMatch = desc.match(/inheritance.*?([\d,]+)/i);
  if (inheritMatch) { cashDelta += parseInt(inheritMatch[1].replace(/,/g, ''), 10); }

  const refundMatch = desc.match(/refund.*?([\d,]+)/i);
  if (refundMatch) { cashDelta += parseInt(refundMatch[1].replace(/,/g, ''), 10); }

  // Win item worth X — treat as cash equivalent
  const winWorthMatch = desc.match(/[Ww]orth\s+([\d,]+)/);
  if (winWorthMatch) { cashDelta += parseInt(winWorthMatch[1].replace(/,/g, ''), 10); }

  // "get 3,000" / "Get 1,500"
  const getMatch = desc.match(/[Gg]et\s+([\d,]+)\s+(?:as|cash|to)/);
  if (getMatch) { cashDelta += parseInt(getMatch[1].replace(/,/g, ''), 10); }

  // "Earn 2,000"
  const earnMatch = desc.match(/[Ee]arn\s+([\d,]+)/);
  if (earnMatch) { cashDelta += parseInt(earnMatch[1].replace(/,/g, ''), 10); }

  // Salary raise: "5% salary raise"
  const raiseMatch = desc.match(/(\d+)%\s*salary raise/i);
  if (raiseMatch) {
    const pct = parseInt(raiseMatch[1], 10) / 100;
    salaryMultiplier = 1 + pct;
    lines.push(`Salary raised by ${raiseMatch[1]}% (${Math.round(player.salary * pct).toLocaleString()}/mo increase)`);
  }

  // Bonus months: "bonus of X month"
  const bonusMatch = desc.match(/bonus of (\d+) month/i);
  if (bonusMatch) {
    const months = parseInt(bonusMatch[1], 10);
    cashDelta += player.salary * months;
    lines.push(`${months}-month bonus: +${(player.salary * months).toLocaleString()}`);
  }

  // % of salary: "3% of your salary"
  const salaryPctMatch = desc.match(/(\d+)%\s*of your salary/i);
  if (salaryPctMatch) {
    const pct = parseInt(salaryPctMatch[1], 10) / 100;
    cashDelta += player.salary * pct;
    lines.push(`${salaryPctMatch[1]}% of salary: +${Math.round(player.salary * pct).toLocaleString()}`);
  }

  if (cashDelta !== 0 && !lines.some(l => l.includes('salary') && l.includes('+'))) {
    lines.push(`Cash: +${cashDelta.toLocaleString()}`);
  }
  if (cashDelta === 0 && !salaryMultiplier) {
    lines.push('No direct cash effect — apply manually if needed');
  }

  return {
    cashDelta,
    salaryMultiplier,
    description: `Fortune: ${card.title} — ${lines.join(', ')}`,
  };
}

function parseEventEffect(card: Card, player: Player): CardEffect {
  const desc = card.description + ' ' + card.title;
  const lines: string[] = [];
  let cashDelta = 0;
  let monthlyExpenseDelta = 0;
  const expensesDelta: Partial<Player['expenses']> = {};
  let activeEffectToAdd: import('@/lib/game/game-types').ActiveEffect | undefined;

  // Sick leave: "for X month(s)"
  const sickLeaveMatch = desc.match(/[Ss]ick [Ll]eave.*?(?:for\s+)?(\d+)\s+months?/);
  if (sickLeaveMatch) {
    const months = parseInt(sickLeaveMatch[1], 10);
    const weeks = months * 4;
    activeEffectToAdd = {
      id: `sick-leave-${Date.now()}`,
      description: `Sick leave — cannot take Learn/Invest opportunities for ${months} month(s)`,
      remainingWeeks: weeks,
      type: 'sick-leave',
    };
    lines.push(`Sick leave: ${months} month(s) — no Learn/Invest actions`);
  }

  // Unpaid leave: "Unpaid Leave X months"
  const unpaidMatch = desc.match(/[Uu]npaid [Ll]eave.*?(\d+)\s+months?/);
  if (unpaidMatch) {
    const months = parseInt(unpaidMatch[1], 10);
    const weeks = months * 4;
    activeEffectToAdd = {
      id: `unpaid-leave-${Date.now()}`,
      description: `Unpaid leave — no salary for ${months} month(s)`,
      remainingWeeks: weeks,
      type: 'unpaid-leave',
    };
    cashDelta -= player.salary * months;
    lines.push(`Unpaid leave ${months} month(s): -${(player.salary * months).toLocaleString()} salary`);
  }

  // Fine as % of salary
  if (!unpaidMatch) {
    const fineSalaryMatch = desc.match(/[Ff]ine\s+\d+%\s+of\s+[Ss]alary/);
    if (fineSalaryMatch) {
      const pctMatch = desc.match(/(\d+)%\s+of\s+[Ss]alary/);
      const pct = pctMatch ? parseInt(pctMatch[1], 10) / 100 : 0.05;
      cashDelta -= Math.round(player.salary * pct);
      lines.push(`Tax fine: -${Math.abs(cashDelta).toLocaleString()}`);
    }

    // Fine as % of all income
    const fineAllMatch = desc.match(/[Ff]ine\s+\d+%\s+of\s+[Aa]ll/);
    if (fineAllMatch) {
      const pctMatch = desc.match(/(\d+)%\s+of\s+[Aa]ll/);
      const pct = pctMatch ? parseInt(pctMatch[1], 10) / 100 : 0.05;
      cashDelta -= Math.round((player.salary + player.otherIncome) * pct);
      lines.push(`Tax fine (all income): -${Math.abs(cashDelta).toLocaleString()}`);
    }
  }

  // Direct charges / costs / fines (fixed amounts) — only if no leave already
  if (cashDelta === 0 && !activeEffectToAdd) {
    const chargesMatch = desc.match(/(?:charges?|costs?|[Ff]ine(?:\s+of)?|[Pp]ay(?:\s+(?:[Ff]ine(?:\s+of)?|Fine))?)\s+([\d,]+)/);
    if (chargesMatch) {
      const amt = parseInt(chargesMatch[1].replace(/,/g, ''), 10);
      cashDelta -= amt;
      lines.push(`Charge: -${amt.toLocaleString()}`);
    }
  }

  // Increase living expenses by X per month
  const expIncreaseMatch = desc.match(/[Ii]ncrease.*?expenses.*?by\s+([\d,]+)\s+per month/i);
  if (expIncreaseMatch) {
    monthlyExpenseDelta = parseInt(expIncreaseMatch[1].replace(/,/g, ''), 10);
    lines.push(`Monthly expenses +${monthlyExpenseDelta.toLocaleString()}/mo`);
  }

  // Rent increase by X%
  const rentIncreaseMatch = desc.match(/[Rr]ent.*?(\d+)%/);
  if (rentIncreaseMatch && !sickLeaveMatch && !unpaidMatch) {
    const pct = parseInt(rentIncreaseMatch[1], 10) / 100;
    const rentIncrease = Math.round(player.expenses.rent * pct);
    expensesDelta.rent = rentIncrease;
    lines.push(`Rent +${rentIncrease.toLocaleString()}/mo`);
  }

  if (!lines.length) lines.push('Read card and apply any manual effects as needed');

  return {
    cashDelta: cashDelta || undefined,
    monthlyExpenseDelta: monthlyExpenseDelta || undefined,
    expensesDelta: Object.keys(expensesDelta).length ? expensesDelta : undefined,
    activeEffectToAdd,
    description: `Event: ${card.title} — ${lines.join(', ')}`,
  };
}

// ─── Fortune action panel ─────────────────────────────────────────────────────

function FortuneActionPanel({
  card,
  color,
  player,
  onApply,
}: {
  card: Card;
  color: string;
  player: Player;
  onApply: (effect: CardEffect) => void;
}) {
  const effect = parseFortuneEffect(card, player);
  const hasCash = (effect.cashDelta ?? 0) !== 0;
  const hasSalary = !!effect.salaryMultiplier;

  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>APPLIED TO YOUR BALANCE</p>
        {hasCash && (
          <Row
            label="Cash received"
            value={`+${(effect.cashDelta ?? 0).toLocaleString()}`}
            color="#22C55E"
            bold
          />
        )}
        {hasSalary && effect.salaryMultiplier && (
          <Row
            label="New monthly salary"
            value={`${Math.round(player.salary * effect.salaryMultiplier).toLocaleString()}/mo`}
            color="#22C55E"
            bold
          />
        )}
        {!hasCash && !hasSalary && (
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Apply any effects shown on the card manually via My Finances.
          </p>
        )}
      </div>
      <button
        onClick={() => onApply(effect)}
        className="w-full py-3 rounded-xl text-sm font-bold"
        style={{ background: color, color: '#0f0f1a' }}
      >
        {hasCash || hasSalary ? 'Apply & Continue' : 'Got it'}
      </button>
    </div>
  );
}

// ─── Event action panel ───────────────────────────────────────────────────────

function EventActionPanel({
  card,
  color,
  player,
  onApply,
}: {
  card: Card;
  color: string;
  player: Player;
  onApply: (effect: CardEffect) => void;
}) {
  const effect = parseEventEffect(card, player);
  const hasCash = (effect.cashDelta ?? 0) !== 0;
  const hasExpense = (effect.monthlyExpenseDelta ?? 0) !== 0;
  const hasRentChange = !!(effect.expensesDelta?.rent);
  const hasActiveEffect = !!effect.activeEffectToAdd;

  return (
    <div className="mt-5 space-y-3">
      <div className="rounded-lg p-3 space-y-1.5" style={{ background: '#0f0f1a' }}>
        <p className="text-xs font-semibold mb-2" style={{ color: '#8888aa' }}>EFFECT ON YOUR BALANCE</p>
        {hasActiveEffect && effect.activeEffectToAdd && (
          <div className="rounded p-2 mb-1" style={{ background: '#EF444422', border: '1px solid #EF444444' }}>
            <p className="text-xs font-semibold" style={{ color: '#EF4444' }}>
              {effect.activeEffectToAdd.description}
            </p>
          </div>
        )}
        {hasCash && (
          <Row
            label="Cash impact"
            value={`${(effect.cashDelta ?? 0) > 0 ? '+' : ''}${(effect.cashDelta ?? 0).toLocaleString()}`}
            color={(effect.cashDelta ?? 0) >= 0 ? '#22C55E' : '#EF4444'}
            bold
          />
        )}
        {hasExpense && (
          <Row
            label="Monthly expenses"
            value={`+${(effect.monthlyExpenseDelta ?? 0).toLocaleString()}/mo`}
            color="#EF4444"
            bold
          />
        )}
        {hasRentChange && effect.expensesDelta?.rent && (
          <Row
            label="Rent increase"
            value={`+${effect.expensesDelta.rent.toLocaleString()}/mo`}
            color="#EF4444"
            bold
          />
        )}
        {!hasCash && !hasExpense && !hasRentChange && !hasActiveEffect && (
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Read the card carefully and apply any manual effects via My Finances.
          </p>
        )}
      </div>
      <button
        onClick={() => onApply(effect)}
        className="w-full py-3 rounded-xl text-sm font-bold"
        style={{ background: color, color: '#0f0f1a' }}
      >
        {hasCash || hasExpense || hasRentChange || hasActiveEffect ? 'Apply & Continue' : 'Got it'}
      </button>
    </div>
  );
}

// ─── Main modal ───────────────────────────────────────────────────────────────

export default function CardModal({ card, onClose }: CardModalProps) {
  const { applyMarketsCardAction, applyCardEffect, dismissCard, state, addSkill, buyAsset, updateFinances, currentPlayer } = useGame();
  const color = TYPE_COLORS[card.type];
  const isMarkets = card.type === 'markets';
  const isLearn = card.type === 'learn';
  const isInvest = card.type === 'invest';
  const isFortune = card.type === 'fortune';
  const isEvent = card.type === 'event';
  const marketsCard = isMarkets ? (card as MarketsCard) : null;

  const close = () => {
    dismissCard();
    onClose();
  };

  const handleMarketsApply = () => {
    if (marketsCard && !card.isReshuffle) applyMarketsCardAction(marketsCard);
    close();
  };

  const handleLearnAccept = () => {
    if (!currentPlayer) return close();
    const cost = parseLearnCost(card.description);
    const sf = parseSuccessFactorFromDesc(card.description);
    const ability = parseSpecialAbility(card.description);
    const benefit = parseMonthlyBenefit(card.description);

    // Deduct cost
    if (cost > 0) {
      updateFinances(currentPlayer.id, { cash: currentPlayer.cash - cost });
    }

    // Build skill
    const skill: Skill = {
      id: `${card.id}-${Date.now()}`,
      name: card.title,
      description: card.description,
      successFactorField: sf && sf.field !== 'all' ? sf.field : undefined,
      successFactorBonus: sf?.bonus,
      monthlyBenefit: benefit || undefined,
      specialAbility: ability,
    };

    // If +1 all fields, add multiple
    if (sf && sf.field === 'all') {
      ['Business', 'Marketing', 'Sales', 'Finance', 'Property', 'Leadership', 'Technology', 'Communication'].forEach(f => {
        addSkill(currentPlayer.id, { ...skill, id: `${skill.id}-${f}`, successFactorField: f });
      });
    } else {
      addSkill(currentPlayer.id, skill);
    }

    close();
  };

  const handleInvestAccept = (asset: Asset) => {
    if (!currentPlayer) return close();
    buyAsset(currentPlayer.id, asset);
    close();
  };

  const handleFortuneApply = (effect: CardEffect) => {
    if (!currentPlayer) return close();
    if ((effect.cashDelta ?? 0) !== 0 || effect.salaryMultiplier) {
      applyCardEffect(currentPlayer.id, effect);
    }
    close();
  };

  const handleEventApply = (effect: CardEffect) => {
    if (!currentPlayer) return close();
    if ((effect.cashDelta ?? 0) !== 0 || (effect.monthlyExpenseDelta ?? 0) !== 0 || effect.expensesDelta) {
      applyCardEffect(currentPlayer.id, effect);
    }
    close();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-6 modal-enter overflow-y-auto"
        style={{ background: '#1a1a2e', border: `1px solid ${color}`, maxHeight: '90vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider"
            style={{ background: color, color: '#0f0f1a' }}
          >
            {TYPE_LABELS[card.type]}
          </span>
          {card.isReshuffle && (
            <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#333', color: '#8888aa' }}>
              Reshuffle
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-3" style={{ color }}>
          {card.title}
        </h2>

        <div className="h-px mb-3" style={{ background: `${color}44` }} />

        {/* Description */}
        <p className="text-sm leading-relaxed" style={{ color: '#f0f0f0' }}>
          {card.description}
        </p>

        {/* Markets changes */}
        {marketsCard && marketsCard.changes && !card.isReshuffle && (
          <MarketsChanges changes={marketsCard.changes} />
        )}

        {/* Action areas */}
        {card.isReshuffle && (
          <button
            onClick={close}
            className="mt-6 w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: color, color: '#0f0f1a' }}
          >
            Deck Reshuffled — Continue
          </button>
        )}

        {!card.isReshuffle && isMarkets && (
          <button
            onClick={handleMarketsApply}
            className="mt-6 w-full py-3 rounded-xl text-sm font-bold"
            style={{ background: color, color: '#0f0f1a' }}
          >
            Apply & Continue
          </button>
        )}

        {!card.isReshuffle && isLearn && currentPlayer && (
          <LearnActionPanel
            card={card}
            color={color}
            onAccept={handleLearnAccept}
            onDecline={close}
          />
        )}

        {!card.isReshuffle && isInvest && currentPlayer && (
          <InvestActionPanel
            card={card}
            color={color}
            marketPrices={state.marketPrices as unknown as Record<string, number>}
            onAccept={handleInvestAccept}
            onDecline={close}
          />
        )}

        {!card.isReshuffle && isFortune && currentPlayer && (
          <FortuneActionPanel
            card={card}
            color={color}
            player={currentPlayer}
            onApply={handleFortuneApply}
          />
        )}

        {!card.isReshuffle && isEvent && currentPlayer && (
          <EventActionPanel
            card={card}
            color={color}
            player={currentPlayer}
            onApply={handleEventApply}
          />
        )}
      </div>
    </div>
  );
}
