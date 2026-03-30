'use client';

import React, { useState } from 'react';
import type { Asset, MarketPrices, Player } from '@/lib/game/game-types';
import { useGame } from '@/lib/game/game-context';

const LIQUID_CLASSES: {
  assetClass: Asset['assetClass'];
  label: string;
  priceKey: keyof MarketPrices;
}[] = [
  { assetClass: 'stocks',     label: 'Stocks',          priceKey: 'stocks' },
  { assetClass: 'bonds',      label: 'Bonds',           priceKey: 'bonds' },
  { assetClass: 'mutualFunds',label: 'Mutual Funds',    priceKey: 'mutualFunds' },
  { assetClass: 'crypto',     label: 'Cryptocurrency',  priceKey: 'crypto' },
  { assetClass: 'gold',       label: 'Gold',            priceKey: 'gold' },
  { assetClass: 'silver',     label: 'Silver',          priceKey: 'silver' },
];

interface Props {
  player: Player;
  prices: MarketPrices;
}

type TabId = 'buy' | 'sell';

// ─── BUY PANEL ────────────────────────────────────────────────────────────────

function BuyPanel({ player, prices }: Props) {
  const { buyAsset } = useGame();
  const [selectedClass, setSelectedClass] = useState<Asset['assetClass']>('stocks');
  const [amount, setAmount] = useState('');

  const selected = LIQUID_CLASSES.find(c => c.assetClass === selectedClass)!;
  const price = prices[selected.priceKey] as number;
  const cashAmt = parseFloat(amount) || 0;
  const units = price > 0 ? cashAmt / price : 0;
  const canBuy = cashAmt > 0 && cashAmt <= player.cash;

  const handleBuy = () => {
    if (!canBuy) return;
    const asset: Asset = {
      id: `qt-${selectedClass}-${Date.now()}`,
      name: selected.label,
      type: 'liquid',
      assetClass: selectedClass,
      purchasePrice: cashAmt,
      currentValue: cashAmt,
      quantity: units,
      monthlyIncome: 0,
      monthlyExpense: 0,
    };
    buyAsset(player.id, asset);
    setAmount('');
  };

  return (
    <div className="space-y-3">
      {/* Asset class selector */}
      <div className="grid grid-cols-3 gap-1.5">
        {LIQUID_CLASSES.map(c => (
          <button
            key={c.assetClass}
            onClick={() => setSelectedClass(c.assetClass)}
            className="py-1.5 rounded-lg text-xs font-semibold transition-all"
            style={{
              background: selectedClass === c.assetClass ? '#22C55E22' : '#0f0f1a',
              color: selectedClass === c.assetClass ? '#22C55E' : '#8888aa',
              border: `1px solid ${selectedClass === c.assetClass ? '#22C55E66' : '#333'}`,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Price info */}
      <div
        className="flex justify-between items-center px-3 py-2 rounded-lg text-xs"
        style={{ background: '#0f0f1a' }}
      >
        <span style={{ color: '#8888aa' }}>Current price</span>
        <span style={{ color: '#f0f0f0', fontWeight: 600 }}>
          {price.toLocaleString(undefined, { maximumFractionDigits: 2 })}
        </span>
      </div>

      {/* Amount input */}
      <div>
        <label className="text-xs" style={{ color: '#8888aa' }}>
          Cash to invest (available: {player.cash.toLocaleString()})
        </label>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          placeholder="0"
          className="w-full mt-1 px-3 py-2.5 rounded-lg text-sm"
          style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333', outline: 'none' }}
        />
        {cashAmt > 0 && price > 0 && (
          <p className="text-xs mt-1" style={{ color: '#8888aa' }}>
            ≈ {units.toFixed(4)} units
          </p>
        )}
        {cashAmt > player.cash && (
          <p className="text-xs mt-1" style={{ color: '#EF4444' }}>Insufficient cash</p>
        )}
      </div>

      <button
        onClick={handleBuy}
        disabled={!canBuy}
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-opacity"
        style={{
          background: '#22C55E',
          color: '#0f0f1a',
          opacity: canBuy ? 1 : 0.4,
        }}
      >
        Buy {cashAmt > 0 ? `${cashAmt.toLocaleString()} of ${selected.label}` : ''}
      </button>
    </div>
  );
}

// ─── SELL PANEL ───────────────────────────────────────────────────────────────

function SellPanel({ player, prices }: Props) {
  const { partialSellAsset } = useGame();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sellPct, setSellPct] = useState(100);

  const liquidAssets = player.assets.filter(a => a.type === 'liquid');

  if (liquidAssets.length === 0) {
    return (
      <p className="text-xs text-center py-4" style={{ color: '#8888aa' }}>
        No liquid assets to sell.
      </p>
    );
  }

  const asset = liquidAssets.find(a => a.id === selectedId) ?? null;

  // Get current price from market if available
  const getAssetCurrentValue = (a: Asset): number => {
    const classEntry = LIQUID_CLASSES.find(c => c.assetClass === a.assetClass);
    if (!classEntry) return a.currentValue;
    const marketPrice = prices[classEntry.priceKey] as number;
    if (!a.quantity || a.quantity === 0) return a.currentValue;
    return a.quantity * marketPrice;
  };

  const currentValue = asset ? getAssetCurrentValue(asset) : 0;
  const fraction = sellPct / 100;
  const proceeds = Math.round(currentValue * fraction);
  const canSell = asset !== null && proceeds > 0;

  const handleSell = () => {
    if (!canSell || !asset) return;
    partialSellAsset(player.id, asset.id, fraction, proceeds);
    setSelectedId(null);
    setSellPct(100);
  };

  return (
    <div className="space-y-3">
      {/* Asset list */}
      <div className="space-y-1.5 max-h-40 overflow-y-auto">
        {liquidAssets.map(a => {
          const val = getAssetCurrentValue(a);
          const isSelected = selectedId === a.id;
          return (
            <button
              key={a.id}
              onClick={() => { setSelectedId(a.id); setSellPct(100); }}
              className="w-full flex justify-between items-center px-3 py-2 rounded-lg text-xs transition-all"
              style={{
                background: isSelected ? '#EF444422' : '#0f0f1a',
                border: `1px solid ${isSelected ? '#EF444466' : '#333'}`,
              }}
            >
              <span style={{ color: '#f0f0f0' }}>{a.name}</span>
              <div className="text-right">
                <p style={{ color: '#22C55E', fontWeight: 600 }}>{val.toLocaleString()}</p>
                {a.quantity && (
                  <p style={{ color: '#8888aa' }}>{a.quantity.toFixed(4)} units</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {asset && (
        <>
          {/* Sell % slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: '#8888aa' }}>Sell portion</span>
              <span style={{ color: '#EF4444', fontWeight: 600 }}>{sellPct}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={100}
              value={sellPct}
              onChange={e => setSellPct(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>

          {/* Proceeds preview */}
          <div
            className="flex justify-between items-center px-3 py-2 rounded-lg text-xs"
            style={{ background: '#0f0f1a' }}
          >
            <span style={{ color: '#8888aa' }}>You receive</span>
            <span style={{ color: '#22C55E', fontWeight: 700, fontSize: '14px' }}>
              +{proceeds.toLocaleString()}
            </span>
          </div>

          <button
            onClick={handleSell}
            className="w-full py-2.5 rounded-xl text-sm font-bold"
            style={{ background: '#EF4444', color: '#fff' }}
          >
            Sell {sellPct < 100 ? `${sellPct}%` : 'All'} of {asset.name}
          </button>
        </>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function QuickTrade({ player, prices }: Props) {
  const [tab, setTab] = useState<TabId>('buy');
  const [open, setOpen] = useState(false);

  const liquidCount = player.assets.filter(a => a.type === 'liquid').length;

  return (
    <div className="mx-3 mb-2">
      {/* Toggle button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all"
        style={{
          background: open ? '#16213e' : '#0f0f1a',
          color: '#8888aa',
          border: '1px solid #333',
        }}
      >
        <span style={{ color: '#22C55E' }}>&#8645;</span>
        Quick Trade — Liquid Assets
        {liquidCount > 0 && (
          <span
            className="px-1.5 py-0.5 rounded-full text-xs"
            style={{ background: '#22C55E22', color: '#22C55E' }}
          >
            {liquidCount} held
          </span>
        )}
        <span style={{ color: '#555' }}>{open ? '▲' : '▼'}</span>
      </button>

      {/* Panel */}
      {open && (
        <div
          className="mt-1 rounded-2xl p-4"
          style={{ background: '#1a1a2e', border: '1px solid #2a2a4a' }}
        >
          {/* Tabs */}
          <div className="flex gap-1 mb-4 rounded-lg p-1" style={{ background: '#0f0f1a' }}>
            {(['buy', 'sell'] as TabId[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="flex-1 py-1.5 rounded-md text-xs font-bold transition-all"
                style={{
                  background: tab === t ? (t === 'buy' ? '#22C55E' : '#EF4444') : 'transparent',
                  color: tab === t ? '#0f0f1a' : '#8888aa',
                }}
              >
                {t === 'buy' ? 'Buy' : 'Sell'}
              </button>
            ))}
          </div>

          {tab === 'buy'
            ? <BuyPanel player={player} prices={prices} />
            : <SellPanel player={player} prices={prices} />
          }

          <p className="text-xs text-center mt-3" style={{ color: '#555' }}>
            Liquid assets only · Property follows market rules
          </p>
        </div>
      )}
    </div>
  );
}
