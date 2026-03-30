'use client';

import React, { useState } from 'react';
import type { Player, Asset } from '@/lib/game/game-types';
import { calcCashflow, calcNetWorth, calcTotalIncome, calcTotalExpenses, formatCurrency } from '@/lib/game/game-engine';
import { useGame } from '@/lib/game/game-context';

interface FinancesPanelProps {
  player: Player;
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-2 mb-2">
      <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#8888aa' }}>
        {title}
      </span>
      <div className="flex-1 h-px" style={{ background: '#333' }} />
    </div>
  );
}

function Row({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-sm" style={{ color: '#c0c0d0' }}>{label}</span>
      <span className="text-sm font-semibold" style={{ color: color ?? '#f0f0f0' }}>
        {value}
      </span>
    </div>
  );
}

function EditModal({
  player,
  onClose,
}: {
  player: Player;
  onClose: () => void;
}) {
  const { updateFinances } = useGame();
  const [salary, setSalary] = useState(player.salary.toString());
  const [cash, setCash] = useState(player.cash.toString());
  const [expenses, setExpenses] = useState({ ...player.expenses });

  const handleSave = () => {
    updateFinances(player.id, {
      salary: parseFloat(salary) || 0,
      cash: parseFloat(cash) || 0,
      expenses,
    });
    onClose();
  };

  const expenseFields: { key: keyof Player['expenses']; label: string }[] = [
    { key: 'rent', label: 'Rent' },
    { key: 'food', label: 'Food' },
    { key: 'transport', label: 'Transport' },
    { key: 'education', label: 'Education' },
    { key: 'utilities', label: 'Utilities' },
    { key: 'insurance', label: 'Insurance' },
    { key: 'other', label: 'Other' },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-5 modal-enter max-h-[85vh] overflow-y-auto"
        style={{ background: '#1a1a2e', border: '1px solid #d4a853' }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: '#d4a853' }}>
          Edit Finances — {player.name}
        </h3>

        <div className="space-y-3">
          <div>
            <label className="text-xs" style={{ color: '#8888aa' }}>Monthly Salary</label>
            <input
              type="number"
              value={salary}
              onChange={e => setSalary(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
            />
          </div>
          <div>
            <label className="text-xs" style={{ color: '#8888aa' }}>Cash on Hand</label>
            <input
              type="number"
              value={cash}
              onChange={e => setCash(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
            />
          </div>

          <SectionHeader title="Monthly Expenses" />
          {expenseFields.map(({ key, label }) => (
            <div key={key}>
              <label className="text-xs" style={{ color: '#8888aa' }}>{label}</label>
              <input
                type="number"
                value={expenses[key].toString()}
                onChange={e =>
                  setExpenses(prev => ({
                    ...prev,
                    [key]: parseFloat(e.target.value) || 0,
                  }))
                }
                className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
                style={{ background: '#0f0f1a', color: '#f0f0f0', border: '1px solid #333' }}
              />
            </div>
          ))}
        </div>

        <div className="flex gap-2 mt-5">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-lg text-sm"
            style={{ background: '#333', color: '#f0f0f0' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2 rounded-lg text-sm font-bold"
            style={{ background: '#d4a853', color: '#0f0f1a' }}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

function AssetCard({ asset, onSell }: { asset: Asset; onSell: () => void }) {
  const gain = asset.currentValue - asset.purchasePrice;
  const gainPct = asset.purchasePrice > 0
    ? ((gain / asset.purchasePrice) * 100).toFixed(1)
    : '0.0';

  return (
    <div
      className="rounded-lg p-3 mb-2"
      style={{ background: '#0f0f1a', border: '1px solid #2a2a4a' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
            {asset.name}
          </p>
          <p className="text-xs mt-0.5" style={{ color: '#8888aa' }}>
            {asset.assetClass.charAt(0).toUpperCase() + asset.assetClass.slice(1)}
          </p>
        </div>
        <button
          onClick={onSell}
          className="text-xs px-2 py-1 rounded"
          style={{ background: '#EF444422', color: '#EF4444' }}
        >
          Sell
        </button>
      </div>
      <div className="grid grid-cols-3 gap-1 mt-2">
        <div>
          <p className="text-xs" style={{ color: '#8888aa' }}>Value</p>
          <p className="text-xs font-semibold" style={{ color: '#f0f0f0' }}>
            {formatCurrency(asset.currentValue)}
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: '#8888aa' }}>G/L</p>
          <p
            className="text-xs font-semibold"
            style={{ color: gain >= 0 ? '#22C55E' : '#EF4444' }}
          >
            {gain >= 0 ? '+' : ''}{gainPct}%
          </p>
        </div>
        <div>
          <p className="text-xs" style={{ color: '#8888aa' }}>Cash/mo</p>
          <p
            className="text-xs font-semibold"
            style={{
              color:
                asset.monthlyIncome - asset.monthlyExpense >= 0
                  ? '#22C55E'
                  : '#EF4444',
            }}
          >
            {formatCurrency(asset.monthlyIncome - asset.monthlyExpense)}
          </p>
        </div>
      </div>
      {asset.loanBalance && asset.loanBalance > 0 && (
        <p className="text-xs mt-1" style={{ color: '#EF4444' }}>
          Loan: {formatCurrency(asset.loanBalance)}
        </p>
      )}
    </div>
  );
}

export default function FinancesPanel({ player }: FinancesPanelProps) {
  const { sellAsset } = useGame();
  const [showEdit, setShowEdit] = useState(false);

  const totalIncome = calcTotalIncome(player);
  const totalExpenses = calcTotalExpenses(player);
  const cashflow = totalIncome - totalExpenses;
  const netWorth = calcNetWorth(player);

  const assetIncome = player.assets.reduce((s, a) => s + a.monthlyIncome, 0);
  const assetExpenses = player.assets.reduce((s, a) => s + a.monthlyExpense, 0);

  const handleSell = (asset: Asset) => {
    const confirmed = window.confirm(
      `Sell ${asset.name} at current value ${formatCurrency(asset.currentValue)}?`
    );
    if (confirmed) {
      sellAsset(player.id, asset.id, asset.currentValue);
    }
  };

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold" style={{ color: '#d4a853' }}>
            {player.name}
          </h2>
          <p className="text-xs" style={{ color: '#8888aa' }}>
            Age {player.age.years}y {player.age.months}m · Week {player.weeksPassed}
          </p>
        </div>
        <button
          onClick={() => setShowEdit(true)}
          className="text-xs px-3 py-1.5 rounded-lg"
          style={{ background: '#16213e', color: '#d4a853', border: '1px solid #d4a85344' }}
        >
          Edit
        </button>
      </div>

      {/* Net Worth + Cash */}
      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: '#16213e' }}>
          <p className="text-xs" style={{ color: '#8888aa' }}>Net Worth</p>
          <p className="text-lg font-bold mt-0.5" style={{ color: '#d4a853' }}>
            {formatCurrency(netWorth)}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: '#16213e' }}>
          <p className="text-xs" style={{ color: '#8888aa' }}>Cash</p>
          <p className="text-lg font-bold mt-0.5" style={{ color: '#f0f0f0' }}>
            {formatCurrency(player.cash)}
          </p>
        </div>
      </div>

      {/* Cashflow summary */}
      <div
        className="rounded-xl p-3 text-center"
        style={{
          background: cashflow >= 0 ? '#22C55E11' : '#EF444411',
          border: `1px solid ${cashflow >= 0 ? '#22C55E44' : '#EF444444'}`,
        }}
      >
        <p className="text-xs" style={{ color: '#8888aa' }}>Monthly Cashflow</p>
        <p
          className="text-2xl font-bold mt-1"
          style={{ color: cashflow >= 0 ? '#22C55E' : '#EF4444' }}
        >
          {cashflow >= 0 ? '+' : ''}{formatCurrency(cashflow)}
        </p>
      </div>

      {/* Income */}
      <div>
        <SectionHeader title="Income (Monthly)" />
        <Row label="Salary" value={`+${formatCurrency(player.salary)}`} color="#22C55E" />
        {player.otherIncome > 0 && (
          <Row label="Other Income" value={`+${formatCurrency(player.otherIncome)}`} color="#22C55E" />
        )}
        {assetIncome > 0 && (
          <Row label="Asset Income" value={`+${formatCurrency(assetIncome)}`} color="#22C55E" />
        )}
        <div className="flex justify-between items-center pt-2 border-t mt-1" style={{ borderColor: '#333' }}>
          <span className="text-sm font-bold" style={{ color: '#f0f0f0' }}>Total Income</span>
          <span className="text-sm font-bold" style={{ color: '#22C55E' }}>
            +{formatCurrency(totalIncome)}
          </span>
        </div>
      </div>

      {/* Expenses */}
      <div>
        <SectionHeader title="Expenses (Monthly)" />
        {Object.entries(player.expenses).map(([key, val]) =>
          val > 0 ? (
            <Row
              key={key}
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              value={`-${formatCurrency(val)}`}
              color="#EF4444"
            />
          ) : null
        )}
        {assetExpenses > 0 && (
          <Row label="Asset Expenses" value={`-${formatCurrency(assetExpenses)}`} color="#EF4444" />
        )}
        <div className="flex justify-between items-center pt-2 border-t mt-1" style={{ borderColor: '#333' }}>
          <span className="text-sm font-bold" style={{ color: '#f0f0f0' }}>Total Expenses</span>
          <span className="text-sm font-bold" style={{ color: '#EF4444' }}>
            -{formatCurrency(totalExpenses)}
          </span>
        </div>
      </div>

      {/* Assets */}
      {player.assets.length > 0 && (
        <div>
          <SectionHeader title={`Assets (${player.assets.length})`} />
          {player.assets.map(asset => (
            <AssetCard key={asset.id} asset={asset} onSell={() => handleSell(asset)} />
          ))}
        </div>
      )}

      {/* Skills */}
      {player.skills.length > 0 && (
        <div>
          <SectionHeader title={`Skills (${player.skills.length})`} />
          <div className="flex flex-wrap gap-1.5">
            {player.skills.map(skill => (
              <span
                key={skill.id}
                className="text-xs px-2 py-1 rounded-full"
                style={{ background: '#3B82F622', color: '#3B82F6', border: '1px solid #3B82F644' }}
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Success Factors */}
      {Object.keys(player.successFactors).length > 0 && (
        <div>
          <SectionHeader title="Success Factors" />
          <div className="flex flex-wrap gap-1.5">
            {Object.entries(player.successFactors).map(([field, val]) => (
              <div
                key={field}
                className="text-xs px-2 py-1 rounded-full flex items-center gap-1"
                style={{ background: '#EAB30822', color: '#EAB308', border: '1px solid #EAB30844' }}
              >
                <span>{field}</span>
                <span className="font-bold">+{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Effects */}
      {player.activeEffects.length > 0 && (
        <div>
          <SectionHeader title="Active Effects" />
          {player.activeEffects.map(effect => (
            <div
              key={effect.id}
              className="flex justify-between items-center py-1"
            >
              <span className="text-xs" style={{ color: '#f0f0f0' }}>
                {effect.description}
              </span>
              <span className="text-xs" style={{ color: '#EAB308' }}>
                {effect.remainingWeeks}w left
              </span>
            </div>
          ))}
        </div>
      )}

      {showEdit && (
        <EditModal player={player} onClose={() => setShowEdit(false)} />
      )}
    </div>
  );
}
