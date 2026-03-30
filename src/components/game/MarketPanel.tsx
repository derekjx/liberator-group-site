'use client';

import React, { useState } from 'react';
import type { MarketPrices } from '@/lib/game/game-types';
import { formatCurrency } from '@/lib/game/game-engine';

interface MarketPanelProps {
  prices: MarketPrices;
  initialPrices: MarketPrices;
  interestRate: number;
}

interface MarketRow {
  key: keyof MarketPrices;
  label: string;
  prefix?: string;
  decimals?: number;
}

const MARKET_ROWS: MarketRow[] = [
  { key: 'stocks', label: 'Stocks (Index)' },
  { key: 'bonds', label: 'Bonds (per unit)' },
  { key: 'gold', label: 'Gold (per oz)' },
  { key: 'silver', label: 'Silver (per oz)' },
  { key: 'crypto', label: 'Cryptocurrency' },
  { key: 'propertyIndex', label: 'Property Index', prefix: '' },
  { key: 'mutualFunds', label: 'Mutual Funds' },
];

type LoanType = 'personal' | 'car' | 'mortgage' | 'credit';

const LOAN_MARGINS: Record<LoanType, number> = {
  personal: 6,
  car: 4,
  mortgage: 2,
  credit: 12,
};

const LOAN_LABELS: Record<LoanType, string> = {
  personal: 'Personal Loan',
  car: 'Car Finance',
  mortgage: 'Mortgage',
  credit: 'Credit Card',
};

function LoanCalculator({ interestRate }: { interestRate: number }) {
  const [amount, setAmount] = useState('100000');
  const [tenure, setTenure] = useState('12');
  const [loanType, setLoanType] = useState<LoanType>('personal');

  const principal = parseFloat(amount) || 0;
  const months = parseInt(tenure) || 12;
  const margin = LOAN_MARGINS[loanType];
  const annualRate = (interestRate + margin) / 100;
  const monthlyRate = annualRate / 12;

  let monthlyPayment = 0;
  if (monthlyRate > 0 && months > 0 && principal > 0) {
    monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
  } else if (months > 0 && principal > 0) {
    monthlyPayment = principal / months;
  }

  const totalRepayment = monthlyPayment * months;
  const totalInterest = totalRepayment - principal;

  return (
    <div
      className="rounded-xl p-4"
      style={{ background: '#0f0f1a', border: '1px solid #2a2a4a' }}
    >
      <h3 className="text-sm font-bold mb-3" style={{ color: '#d4a853' }}>
        Loan Calculator
      </h3>

      <div className="space-y-3">
        <div>
          <label className="text-xs" style={{ color: '#8888aa' }}>Loan Type</label>
          <select
            value={loanType}
            onChange={e => setLoanType(e.target.value as LoanType)}
            className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
            style={{ background: '#1a1a2e', color: '#f0f0f0', border: '1px solid #333' }}
          >
            {(Object.keys(LOAN_LABELS) as LoanType[]).map(k => (
              <option key={k} value={k}>
                {LOAN_LABELS[k]} (+{LOAN_MARGINS[k]}%)
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs" style={{ color: '#8888aa' }}>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: '#1a1a2e', color: '#f0f0f0', border: '1px solid #333' }}
            />
          </div>
          <div>
            <label className="text-xs" style={{ color: '#8888aa' }}>Months</label>
            <input
              type="number"
              value={tenure}
              onChange={e => setTenure(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded-lg text-sm"
              style={{ background: '#1a1a2e', color: '#f0f0f0', border: '1px solid #333' }}
            />
          </div>
        </div>

        <div
          className="rounded-lg p-3 space-y-1.5"
          style={{ background: '#16213e' }}
        >
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8888aa' }}>Annual Rate</span>
            <span className="text-xs font-semibold" style={{ color: '#f0f0f0' }}>
              {(annualRate * 100).toFixed(2)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8888aa' }}>Monthly Payment</span>
            <span className="text-sm font-bold" style={{ color: '#d4a853' }}>
              {monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8888aa' }}>Total Interest</span>
            <span className="text-xs font-semibold" style={{ color: '#EF4444' }}>
              {totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs" style={{ color: '#8888aa' }}>Total Repayment</span>
            <span className="text-xs font-semibold" style={{ color: '#f0f0f0' }}>
              {totalRepayment.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MarketPanel({
  prices,
  initialPrices,
  interestRate,
}: MarketPanelProps) {
  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      <h2 className="text-base font-bold" style={{ color: '#d4a853' }}>
        Market Prices
      </h2>

      {/* Interest Rate */}
      <div
        className="rounded-xl p-4"
        style={{ background: '#16213e', border: '1px solid #A855F744' }}
      >
        <p className="text-xs" style={{ color: '#8888aa' }}>Base Interest Rate</p>
        <p className="text-3xl font-bold mt-1" style={{ color: '#A855F7' }}>
          {interestRate.toFixed(2)}%
        </p>
        <p className="text-xs mt-1" style={{ color: '#8888aa' }}>
          Affects bond yields and loan rates
        </p>
      </div>

      {/* Price table */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: '1px solid #2a2a4a' }}
      >
        <table className="w-full">
          <thead>
            <tr style={{ background: '#16213e' }}>
              <th className="text-left px-3 py-2 text-xs font-semibold" style={{ color: '#8888aa' }}>
                Asset
              </th>
              <th className="text-right px-3 py-2 text-xs font-semibold" style={{ color: '#8888aa' }}>
                Price
              </th>
              <th className="text-right px-3 py-2 text-xs font-semibold" style={{ color: '#8888aa' }}>
                Change
              </th>
            </tr>
          </thead>
          <tbody>
            {MARKET_ROWS.map(({ key, label }) => {
              const current = prices[key] as number;
              const initial = initialPrices[key] as number;
              const change = initial > 0 ? ((current - initial) / initial) * 100 : 0;
              const isPos = change >= 0;

              return (
                <tr
                  key={key}
                  style={{ borderTop: '1px solid #1a1a2e' }}
                >
                  <td className="px-3 py-2">
                    <span className="text-sm" style={{ color: '#f0f0f0' }}>
                      {label}
                    </span>
                  </td>
                  <td className="text-right px-3 py-2">
                    <span className="text-sm font-semibold" style={{ color: '#f0f0f0' }}>
                      {key === 'propertyIndex'
                        ? `${current.toFixed(1)}`
                        : current.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </td>
                  <td className="text-right px-3 py-2">
                    <span
                      className="text-xs font-bold"
                      style={{ color: isPos ? '#22C55E' : '#EF4444' }}
                    >
                      {isPos ? '+' : ''}{change.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Loan Calculator */}
      <LoanCalculator interestRate={interestRate} />
    </div>
  );
}
