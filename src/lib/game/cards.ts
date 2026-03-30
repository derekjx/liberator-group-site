export type CardType = 'learn' | 'invest' | 'fortune' | 'event' | 'markets';

export interface Card {
  id: string;
  type: CardType;
  title: string;
  description: string;
  isReshuffle?: boolean;
}

export interface MarketsCard extends Card {
  type: 'markets';
  changes: {
    interestRate?: number;
    bonds?: number;
    stocks?: number;
    propertyIndex?: number;
    gold?: number;
    silver?: number;
    crypto?: number;
  };
}

// ─── LEARN CARDS ───────────────────────────────────────────────────────────────

export const learnCards: Card[] = [
  {
    id: 'learn-001',
    type: 'learn',
    title: 'Cryptocurrency',
    description: 'Learn about Hard Wallet. Purchase a crypto hard wallet for 1,000 and transfer desired amount of crypto into and out of it at any time.',
  },
  {
    id: 'learn-002',
    type: 'learn',
    title: 'Taxes',
    description: 'Read up Extensively on Taxes. Understand the tax laws enough to counter the proposed fine by the auditor. If you pull the Tax Audit card under Event, you do not need to pay the fine.',
  },
  {
    id: 'learn-003',
    type: 'learn',
    title: 'Will',
    description: 'Learn to write a will. Write a will at any time in the game. In the event of drawing the Untimely Death card under Event, asset transfer in 3 months after accounting for inheritance tax. Continue to play as beneficiary. Do not draw your salary anymore.',
  },
  {
    id: 'learn-004',
    type: 'learn',
    title: 'Taxes',
    description: 'Hire Accountant. Pay Accountant prevailing market rates. If none known, pay 10,000 annually. If you pull the Tax Audit card under Event, you do not need to pay the fine.',
  },
  {
    id: 'learn-005',
    type: 'learn',
    title: 'Will',
    description: 'Pay a Lawyer to write a will. Pay 10,000 for a lawyer to write a will. In the event of drawing the Untimely Death card under Event, asset transfer in 2 months after accounting for inheritance tax. Continue to play as beneficiary. Do not draw your salary anymore.',
  },
  {
    id: 'learn-006',
    type: 'learn',
    title: 'Apply for Cashback Card',
    description: 'Get 10% off petrol expenses. Capped at 100 per month.',
  },
  {
    id: 'learn-007',
    type: 'learn',
    title: 'Apply for Cashback Card',
    description: 'Get 5% off grocery expenses. Capped at 400 per month.',
  },
  {
    id: 'learn-008',
    type: 'learn',
    title: 'Apply for Cashback Card',
    description: 'Get 5% off education expenses. Capped at 400 per month.',
  },
  {
    id: 'learn-009',
    type: 'learn',
    title: 'Apply for Cashback Card',
    description: 'Get 5% off utility expenses. Capped at 400 per month.',
  },
  {
    id: 'learn-010',
    type: 'learn',
    title: 'Apply for Cashback Card',
    description: 'Get 1% off all expenses. Capped at 1,000 per month.',
  },
  {
    id: 'learn-011',
    type: 'learn',
    title: 'Online Trading Book',
    description: 'Pay 100. Learn how to Trade and invest in stocks and bonds. Be able to take advantage on all players stock and bonds invest opportunities without the player landing on Invest.',
  },
  {
    id: 'learn-012',
    type: 'learn',
    title: 'Cryptocurrency Book',
    description: 'Pay 100. Learn how to Trade and invest in cryptocurrency. Be able to take advantage on all players Cryptocurrencies invest opportunities without the player landing on Invest.',
  },
  {
    id: 'learn-013',
    type: 'learn',
    title: 'Business Book',
    description: 'Pay 100. Learn how to find and purchase a business. Be able to take advantage on all players business invest opportunities without the player landing on Invest.',
  },
  {
    id: 'learn-014',
    type: 'learn',
    title: 'Property Book',
    description: 'Pay 100. Learn how to find and purchase a property. Be able to take advantage on all players property invest opportunities without the player landing on Invest.',
  },
  {
    id: 'learn-015',
    type: 'learn',
    title: 'First Aid Course',
    description: 'Pay 500. Earn Success Factor +1 in Health.',
  },
  {
    id: 'learn-016',
    type: 'learn',
    title: 'Cooking Course',
    description: 'Pay 200. Reduce food expenses by 10%. Capped at 200 per month.',
  },
  {
    id: 'learn-017',
    type: 'learn',
    title: 'Handywork Course',
    description: 'Pay 200. Reduce home repair costs by 80%. Earn Success Factor +1 in Handywork.',
  },
  {
    id: 'learn-018',
    type: 'learn',
    title: 'Negotiation Course',
    description: 'Pay 500. Earn Success Factor +1 in Negotiation.',
  },
  {
    id: 'learn-019',
    type: 'learn',
    title: 'Marketing Course',
    description: 'Pay 500. Earn Success Factor +1 in Marketing.',
  },
  {
    id: 'learn-020',
    type: 'learn',
    title: 'Sales Course',
    description: 'Pay 500. Earn Success Factor +1 in Sales.',
  },
  {
    id: 'learn-021',
    type: 'learn',
    title: 'Leadership Course',
    description: 'Pay 1,000. Earn Success Factor +1 in Leadership.',
  },
  {
    id: 'learn-022',
    type: 'learn',
    title: 'MBA',
    description: 'Pay 5,000. Earn Success Factor +1 in all fields.',
  },
  {
    id: 'learn-023',
    type: 'learn',
    title: 'Online Business Course',
    description: 'Pay 100. Earn Success Factor +1 in Business.',
  },
  {
    id: 'learn-024',
    type: 'learn',
    title: 'Real Estate Course',
    description: 'Pay 500. Earn Success Factor +1 in Property.',
  },
  {
    id: 'learn-025',
    type: 'learn',
    title: 'Financial Planning Course',
    description: 'Pay 500. Earn Success Factor +1 in Finance.',
  },
  {
    id: 'learn-026',
    type: 'learn',
    title: 'Coding Course',
    description: 'Pay 500. Earn Success Factor +1 in Technology.',
  },
  {
    id: 'learn-027',
    type: 'learn',
    title: 'Public Speaking Course',
    description: 'Pay 500. Earn Success Factor +1 in Communication.',
  },
  {
    id: 'learn-028',
    type: 'learn',
    title: 'Language Course',
    description: 'Pay 300. Earn Success Factor +1 in Communication.',
  },
  {
    id: 'learn-029',
    type: 'learn',
    title: 'Time Management Course',
    description: 'Pay 200. Earn Success Factor +1 in Productivity.',
  },
  {
    id: 'learn-030',
    type: 'learn',
    title: 'Exercise Habit',
    description: 'Free. Reduce health expenses by 10%. Capped at 100 per month.',
  },
  {
    id: 'learn-031',
    type: 'learn',
    title: 'Reading Habit',
    description: 'Free. Earn Success Factor +1 in Knowledge.',
  },
  {
    id: 'learn-032',
    type: 'learn',
    title: 'Meditation Habit',
    description: 'Free. Earn Success Factor +1 in Wellbeing.',
  },
  {
    id: 'learn-033',
    type: 'learn',
    title: 'Budget and Track Expenses',
    description: 'Free. Reduce all expenses by 5%. Capped at 500 per month.',
  },
  {
    id: 'learn-reshuffle',
    type: 'learn',
    title: 'Reshuffle',
    description: 'Reshuffle the Learn deck.',
    isReshuffle: true,
  },
];

// ─── INVEST CARDS ──────────────────────────────────────────────────────────────

export const investCards: Card[] = [
  {
    id: 'invest-001',
    type: 'invest',
    title: 'Bonds',
    description: 'Opportunity to invest in bonds at prevailing market rates. Bond yields would be that of current interest rates.',
  },
  {
    id: 'invest-002',
    type: 'invest',
    title: 'Bonds',
    description: 'Opportunity to take a loan to invest in bonds at prevailing market rates. Bond yields would be that of current interest rates. Loan would be at the same rate as current interest rates.',
  },
  {
    id: 'invest-003',
    type: 'invest',
    title: 'Stocks',
    description: 'Opportunity to invest in stocks at prevailing market rates.',
  },
  {
    id: 'invest-004',
    type: 'invest',
    title: 'Stocks',
    description: 'Opportunity to add position in stocks at 5% discount to market rates, up to the quantity of stocks presently held.',
  },
  {
    id: 'invest-005',
    type: 'invest',
    title: 'Stocks',
    description: 'Opportunity to add position in stocks at 10% discount to market rates, up to the quantity of stocks presently held.',
  },
  {
    id: 'invest-006',
    type: 'invest',
    title: 'Cryptocurrency',
    description: 'Opportunity to invest in cryptocurrency at prevailing market rates.',
  },
  {
    id: 'invest-007',
    type: 'invest',
    title: 'Cryptocurrency',
    description: 'Opportunity to invest in a new cryptocurrency at 1 per unit.',
  },
  {
    id: 'invest-008',
    type: 'invest',
    title: 'Cryptocurrency Airdrop',
    description: 'For every 100 units of your most held cryptocurrency, receive 1 unit of a new cryptocurrency. Name the new cryptocurrency. Current value of the new cryptocurrency is 0.01 per unit.',
  },
  {
    id: 'invest-009',
    type: 'invest',
    title: 'Gold',
    description: 'Opportunity to invest in gold at prevailing market rates.',
  },
  {
    id: 'invest-010',
    type: 'invest',
    title: 'Silver',
    description: 'Opportunity to invest in silver at prevailing market rates.',
  },
  {
    id: 'invest-011',
    type: 'invest',
    title: 'Gold',
    description: 'Opportunity to sell gold at +5% above prevailing market rates.',
  },
  {
    id: 'invest-012',
    type: 'invest',
    title: 'Silver',
    description: 'Opportunity to sell silver at +5% above prevailing market rates.',
  },
  {
    id: 'invest-013',
    type: 'invest',
    title: 'Gold',
    description: 'Opportunity to invest in gold at 5% below prevailing market rates.',
  },
  {
    id: 'invest-014',
    type: 'invest',
    title: 'Silver',
    description: 'Opportunity to invest in silver at 5% below prevailing market rates.',
  },
  {
    id: 'invest-015',
    type: 'invest',
    title: 'Property',
    description: 'Studio apartment at 410,000. Annual rental income: 28,200. Service charges: 5,000 annually.',
  },
  {
    id: 'invest-016',
    type: 'invest',
    title: 'Property',
    description: 'Studio apartment at 700,000. Annual rental income: 63,000. Service charges: 4,800 annually.',
  },
  {
    id: 'invest-017',
    type: 'invest',
    title: 'Property',
    description: 'Studio apartment at 620,000. Annual rental income: 55,000. Service charges: 6,500 annually.',
  },
  {
    id: 'invest-018',
    type: 'invest',
    title: 'Property',
    description: '1 bedroom apartment at 950,000. Annual rental income: 75,000. Service charges: 12,100 annually.',
  },
  {
    id: 'invest-019',
    type: 'invest',
    title: 'Property',
    description: '1 bedroom apartment at 1,200,000. Annual rental income: 96,000. Service charges: 15,000 annually.',
  },
  {
    id: 'invest-020',
    type: 'invest',
    title: 'Property',
    description: '2 bedroom apartment at 1,800,000. Annual rental income: 120,000. Service charges: 20,000 annually.',
  },
  {
    id: 'invest-021',
    type: 'invest',
    title: 'Property',
    description: 'Shop at 800,000. Annual rental income: 60,000. Service charges: 8,000 annually.',
  },
  {
    id: 'invest-022',
    type: 'invest',
    title: 'Business',
    description: 'Online business for 50,000 with monthly income of 3,000.',
  },
  {
    id: 'invest-023',
    type: 'invest',
    title: 'Business',
    description: 'Franchise opportunity for 200,000 with monthly income of 15,000. Earn Success Factor +1 in Business if purchased.',
  },
  {
    id: 'invest-024',
    type: 'invest',
    title: 'Business',
    description: 'Start your own business. Pay 10,000. Monthly income determined by dice roll x 1,000 + Success Factor in Business x 500.',
  },
  {
    id: 'invest-reshuffle',
    type: 'invest',
    title: 'Reshuffle',
    description: 'Reshuffle the Invest deck.',
    isReshuffle: true,
  },
];

// ─── FORTUNE CARDS ─────────────────────────────────────────────────────────────

export const fortuneCards: Card[] = [
  {
    id: 'fortune-001',
    type: 'fortune',
    title: 'Win the Lottery',
    description: 'If you buy the lottery or have a bank promotion of the same, receive 1,000,000. You may donate it if you want a greater challenge.',
  },
  {
    id: 'fortune-002',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win Free Groceries for 6 months.',
  },
  {
    id: 'fortune-003',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win Free Petrol for 6 months.',
  },
  {
    id: 'fortune-004',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a free car worth 100,000. Keep it or sell it.',
  },
  {
    id: 'fortune-005',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a holiday worth 5,000. Keep it or sell it.',
  },
  {
    id: 'fortune-006',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a tablet worth 4,000. Keep it or sell it.',
  },
  {
    id: 'fortune-007',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win tickets to a concert worth 1,500. Keep it or sell it.',
  },
  {
    id: 'fortune-008',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a phone worth 4,000. Keep it or sell it.',
  },
  {
    id: 'fortune-009',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a laptop worth 4,000. Keep it or sell it.',
  },
  {
    id: 'fortune-010',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win a gift voucher worth 500. Reduce living expenses by 500 for 1 month.',
  },
  {
    id: 'fortune-011',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win 2 gift vouchers worth 500. Reduce living expenses by 500 for 2 months.',
  },
  {
    id: 'fortune-012',
    type: 'fortune',
    title: 'Shop Offer',
    description: 'Win 3 gift vouchers worth 500. Reduce living expenses by 500 for 3 months.',
  },
  {
    id: 'fortune-013',
    type: 'fortune',
    title: 'Credit Card 0% Loan',
    description: 'Get cash loan at 0% interest for 6 months, up to 90% of your credit limit (3.5x salary). Pay evenly over duration.',
  },
  {
    id: 'fortune-014',
    type: 'fortune',
    title: 'Credit Card 0% Loan',
    description: 'Get cash loan at 0% interest for 12 months, up to 90% of credit limit. Pay evenly over duration.',
  },
  {
    id: 'fortune-015',
    type: 'fortune',
    title: 'Credit Card 1% Loan',
    description: 'Get cash loan at 1% interest for 6 months, up to 90% of credit limit.',
  },
  {
    id: 'fortune-016',
    type: 'fortune',
    title: 'Bank Offer',
    description: 'Get 3% of your salary as offer to open a bank account.',
  },
  {
    id: 'fortune-017',
    type: 'fortune',
    title: 'Bank Offer',
    description: 'Get 5% of your salary as offer to open a bank account.',
  },
  {
    id: 'fortune-018',
    type: 'fortune',
    title: 'Bank Offer',
    description: 'Get 3,000 cash to open a bank account.',
  },
  {
    id: 'fortune-019',
    type: 'fortune',
    title: 'Bank Offer',
    description: 'Get 1,500 cash to open a bank account.',
  },
  {
    id: 'fortune-020',
    type: 'fortune',
    title: 'Salary Raise',
    description: 'Your employer gives you a 5% salary raise.',
  },
  {
    id: 'fortune-021',
    type: 'fortune',
    title: 'Salary Raise',
    description: 'Your employer gives you a 10% salary raise.',
  },
  {
    id: 'fortune-022',
    type: 'fortune',
    title: 'Bonus',
    description: 'Receive a bonus of 1 month salary.',
  },
  {
    id: 'fortune-023',
    type: 'fortune',
    title: 'Bonus',
    description: 'Receive a bonus of 2 months salary.',
  },
  {
    id: 'fortune-024',
    type: 'fortune',
    title: 'Bonus',
    description: 'Receive a bonus of 3 months salary.',
  },
  {
    id: 'fortune-025',
    type: 'fortune',
    title: 'Inheritance',
    description: 'Receive an inheritance of 50,000.',
  },
  {
    id: 'fortune-026',
    type: 'fortune',
    title: 'Inheritance',
    description: 'Receive an inheritance of 100,000.',
  },
  {
    id: 'fortune-027',
    type: 'fortune',
    title: 'Tax Refund',
    description: 'Receive a tax refund of 5,000.',
  },
  {
    id: 'fortune-028',
    type: 'fortune',
    title: 'Freelance Work',
    description: 'Earn 2,000 for a freelance project.',
  },
  {
    id: 'fortune-reshuffle',
    type: 'fortune',
    title: 'Reshuffle',
    description: 'Reshuffle the Fortune deck.',
    isReshuffle: true,
  },
];

// ─── EVENT CARDS ───────────────────────────────────────────────────────────────

export const eventCards: Card[] = [
  {
    id: 'event-001',
    type: 'event',
    title: 'Get a Pet',
    description: 'Increase living expenses by 1,000 per month.',
  },
  {
    id: 'event-002',
    type: 'event',
    title: 'Adopt a Pet',
    description: 'Increase living expenses by 2,500 per month.',
  },
  {
    id: 'event-003',
    type: 'event',
    title: 'Pet Sick',
    description: 'Vet charges 500. Only applies if you have a pet.',
  },
  {
    id: 'event-004',
    type: 'event',
    title: 'Pet Sick',
    description: 'Vet charges 2,500. Only applies if you have a pet.',
  },
  {
    id: 'event-005',
    type: 'event',
    title: 'Pet Sick',
    description: 'Vet charges 1,500. Only applies if you have a pet.',
  },
  {
    id: 'event-006',
    type: 'event',
    title: 'Pet Sick',
    description: 'Vet charges 7,500. Only applies if you have a pet.',
  },
  {
    id: 'event-007',
    type: 'event',
    title: 'Pet Passes Away',
    description: 'Oldest pet passes away. Pet funeral expense at your choice. Remove living expenses associated with oldest pet.',
  },
  {
    id: 'event-008',
    type: 'event',
    title: 'Pet Passes Away',
    description: 'Youngest pet passes away. Remove living expenses associated with youngest pet.',
  },
  {
    id: 'event-009',
    type: 'event',
    title: 'Personal Sickness',
    description: 'Doctor charges 500.',
  },
  {
    id: 'event-010',
    type: 'event',
    title: 'Family Member Sick',
    description: 'Doctor charges 1,000.',
  },
  {
    id: 'event-011',
    type: 'event',
    title: 'Vaccination',
    description: 'Doctor charges 500.',
  },
  {
    id: 'event-012',
    type: 'event',
    title: 'Dental Work',
    description: 'Dentist charges 1,000.',
  },
  {
    id: 'event-013',
    type: 'event',
    title: 'Personal Sickness',
    description: 'Doctor charges 1,000.',
  },
  {
    id: 'event-014',
    type: 'event',
    title: 'Dental Work',
    description: 'Wisdom tooth extraction. Dentist charges 2,000.',
  },
  {
    id: 'event-015',
    type: 'event',
    title: 'Personal Accident',
    description: 'Doctor charges 100,000. If you are insured, no charges.',
  },
  {
    id: 'event-016',
    type: 'event',
    title: 'Critical Illness',
    description: 'Doctor charges 100,000. If you are insured, get paid insured amount and offset charges.',
  },
  {
    id: 'event-017',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 1 month except to liquidate liquid assets.',
  },
  {
    id: 'event-018',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 2 months.',
  },
  {
    id: 'event-019',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 3 months.',
  },
  {
    id: 'event-020',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 4 months.',
  },
  {
    id: 'event-021',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 5 months.',
  },
  {
    id: 'event-022',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 6 months.',
  },
  {
    id: 'event-023',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 7 months.',
  },
  {
    id: 'event-024',
    type: 'event',
    title: 'Sick Leave',
    description: 'Unable to take on any opportunity for 8 months.',
  },
  {
    id: 'event-025',
    type: 'event',
    title: 'Untimely Death',
    description: 'Due to untimely death, pass your assets to your beneficiary as per your will. Refer to guidebook.',
  },
  {
    id: 'event-026',
    type: 'event',
    title: 'Untimely Death of Partner',
    description: 'Get insured amount if applicable. Any income from partner no longer applies.',
  },
  {
    id: 'event-027',
    type: 'event',
    title: 'Tax Audit',
    description: 'Pay fine of 5% of Salary.',
  },
  {
    id: 'event-028',
    type: 'event',
    title: 'Tax Audit',
    description: 'Pay fine of 5% of Rental income.',
  },
  {
    id: 'event-029',
    type: 'event',
    title: 'Tax Audit',
    description: 'Pay fine of 5% of Business income.',
  },
  {
    id: 'event-030',
    type: 'event',
    title: 'Tax Audit',
    description: 'Pay fine of 5% of all income.',
  },
  {
    id: 'event-031',
    type: 'event',
    title: 'Speeding Fine',
    description: 'Pay 500.',
  },
  {
    id: 'event-032',
    type: 'event',
    title: 'Traffic Fine',
    description: 'Cut the Yellow Line. Pay 500.',
  },
  {
    id: 'event-033',
    type: 'event',
    title: 'Parking Fine',
    description: 'Wrong spot. Pay 500.',
  },
  {
    id: 'event-034',
    type: 'event',
    title: 'Parking Fine',
    description: 'Forgot to pay. Pay 500.',
  },
  {
    id: 'event-035',
    type: 'event',
    title: 'Traffic Fine',
    description: 'Beat the light. Pay 500.',
  },
  {
    id: 'event-036',
    type: 'event',
    title: 'Traffic Fine',
    description: 'Lacking lane discipline. Pay 500.',
  },
  {
    id: 'event-037',
    type: 'event',
    title: 'You have a Boy!',
    description: 'Living expenses increase by 3,000 per month.',
  },
  {
    id: 'event-038',
    type: 'event',
    title: 'You have a Girl!',
    description: 'Living expenses increase by 3,000 per month.',
  },
  {
    id: 'event-039',
    type: 'event',
    title: 'Get Married',
    description: 'Spend 200,000 within the next 3 years on wedding expenses above usual expenses.',
  },
  {
    id: 'event-040',
    type: 'event',
    title: 'Home Repairs',
    description: 'Pipe burst repairs cost 6,000.',
  },
  {
    id: 'event-041',
    type: 'event',
    title: 'Home Repairs',
    description: 'Heater broke. Repairs cost 1,200.',
  },
  {
    id: 'event-042',
    type: 'event',
    title: 'Home Repairs',
    description: 'Cracked tiles. Repairs cost 6,000.',
  },
  {
    id: 'event-043',
    type: 'event',
    title: 'Home Repairs',
    description: 'Door lock jammed. Repairs cost 400. If Handywork skill learnt, pay only 80.',
  },
  {
    id: 'event-044',
    type: 'event',
    title: 'Pest Control',
    description: 'Treatment costs 1,000.',
  },
  {
    id: 'event-045',
    type: 'event',
    title: 'Car Tire Puncture',
    description: 'Repairs cost 100. If Handywork skill learnt, pay only 30.',
  },
  {
    id: 'event-046',
    type: 'event',
    title: 'Rent Increase',
    description: 'Landlord increases rent by 10%. Only applies if renting.',
  },
  {
    id: 'event-047',
    type: 'event',
    title: 'Rent Increase',
    description: 'Landlord increases rent by 5%. Only applies if renting.',
  },
  {
    id: 'event-048',
    type: 'event',
    title: 'Eviction Notice',
    description: 'Vacate property in 12 months. At end of 12 months, rent at 20% higher than present or current market value.',
  },
  {
    id: 'event-049',
    type: 'event',
    title: 'Unpaid Leave',
    description: 'Unable to draw salary for 1 month.',
  },
  {
    id: 'event-050',
    type: 'event',
    title: 'Unpaid Leave',
    description: 'Unable to draw salary for 2 months.',
  },
  {
    id: 'event-051',
    type: 'event',
    title: 'Redundancy',
    description: 'Lose your job. You have 3 months salary as severance. Find a new job in 3 months (dice roll 4+ to succeed each month).',
  },
  {
    id: 'event-052',
    type: 'event',
    title: 'Job Offer',
    description: 'Receive a job offer with 10% higher salary. Accept or decline.',
  },
  {
    id: 'event-053',
    type: 'event',
    title: 'Job Offer',
    description: 'Receive a job offer with 20% higher salary. Accept or decline.',
  },
  {
    id: 'event-054',
    type: 'event',
    title: 'Car Breakdown',
    description: 'Repairs cost 3,000.',
  },
  {
    id: 'event-055',
    type: 'event',
    title: 'Car Accident',
    description: 'Repairs cost 10,000. If insured, no charges.',
  },
  {
    id: 'event-reshuffle',
    type: 'event',
    title: 'Reshuffle',
    description: 'Reshuffle the Event deck.',
    isReshuffle: true,
  },
];

// ─── MARKETS CARDS ─────────────────────────────────────────────────────────────

export const marketsCards: MarketsCard[] = [
  {
    id: 'markets-001',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: 0% | Stocks: +1% | Property: +1% | Gold: +0.5% | Silver: +2% | Crypto: +5%',
    changes: { bonds: 0, stocks: 0.01, propertyIndex: 0.01, gold: 0.005, silver: 0.02, crypto: 0.05 },
  },
  {
    id: 'markets-002',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: -0.5% | Stocks: +1.5% | Property: +0.5% | Gold: +1% | Silver: +3% | Crypto: +7.5%',
    changes: { bonds: -0.005, stocks: 0.015, propertyIndex: 0.005, gold: 0.01, silver: 0.03, crypto: 0.075 },
  },
  {
    id: 'markets-003',
    type: 'markets',
    title: 'Market Correction',
    description: 'Bonds: -1% | Stocks: -3% | Property: +1% | Gold: -3% | Silver: -5% | Crypto: -12%',
    changes: { bonds: -0.01, stocks: -0.03, propertyIndex: 0.01, gold: -0.03, silver: -0.05, crypto: -0.12 },
  },
  {
    id: 'markets-004',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: +1% | Stocks: -3% | Property: +1% | Gold: -0.5% | Silver: -1% | Crypto: -10%',
    changes: { bonds: 0.01, stocks: -0.03, propertyIndex: 0.01, gold: -0.005, silver: -0.01, crypto: -0.10 },
  },
  {
    id: 'markets-005',
    type: 'markets',
    title: 'Bull Run',
    description: 'Bonds: -1% | Stocks: +4% | Property: +2% | Gold: +3% | Silver: +6% | Crypto: +10%',
    changes: { bonds: -0.01, stocks: 0.04, propertyIndex: 0.02, gold: 0.03, silver: 0.06, crypto: 0.10 },
  },
  {
    id: 'markets-006',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: 0% | Stocks: +2% | Property: +1.5% | Gold: +1% | Silver: +3% | Crypto: +4%',
    changes: { bonds: 0, stocks: 0.02, propertyIndex: 0.015, gold: 0.01, silver: 0.03, crypto: 0.04 },
  },
  {
    id: 'markets-007',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: -0.5% | Stocks: +2% | Property: +1.5% | Gold: +1% | Silver: +3% | Crypto: +4%',
    changes: { bonds: -0.005, stocks: 0.02, propertyIndex: 0.015, gold: 0.01, silver: 0.03, crypto: 0.04 },
  },
  {
    id: 'markets-008',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: -0.5% | Stocks: +2% | Property: +2% | Gold: +1% | Silver: +1.5% | Crypto: +5%',
    changes: { bonds: -0.005, stocks: 0.02, propertyIndex: 0.02, gold: 0.01, silver: 0.015, crypto: 0.05 },
  },
  {
    id: 'markets-009',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: -0.5% | Stocks: +1.5% | Property: +1% | Gold: +1.5% | Silver: +2% | Crypto: +3%',
    changes: { bonds: -0.005, stocks: 0.015, propertyIndex: 0.01, gold: 0.015, silver: 0.02, crypto: 0.03 },
  },
  {
    id: 'markets-010',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: -0.5% | Stocks: +1% | Property: +0.5% | Gold: +2% | Silver: +3% | Crypto: +6%',
    changes: { bonds: -0.005, stocks: 0.01, propertyIndex: 0.005, gold: 0.02, silver: 0.03, crypto: 0.06 },
  },
  {
    id: 'markets-011',
    type: 'markets',
    title: 'Property Boom',
    description: 'Bonds: -0.5% | Stocks: +2% | Property: +3% | Gold: -0.5% | Silver: -1% | Crypto: -3%',
    changes: { bonds: -0.005, stocks: 0.02, propertyIndex: 0.03, gold: -0.005, silver: -0.01, crypto: -0.03 },
  },
  {
    id: 'markets-012',
    type: 'markets',
    title: 'Mixed Signals',
    description: 'Bonds: -0.5% | Stocks: +1% | Property: -1% | Gold: -1% | Silver: -2% | Crypto: +3%',
    changes: { bonds: -0.005, stocks: 0.01, propertyIndex: -0.01, gold: -0.01, silver: -0.02, crypto: 0.03 },
  },
  {
    id: 'markets-013',
    type: 'markets',
    title: 'Steady Growth',
    description: 'Bonds: -0.5% | Stocks: +0.5% | Property: -1% | Gold: +0.5% | Silver: +0.5% | Crypto: +3%',
    changes: { bonds: -0.005, stocks: 0.005, propertyIndex: -0.01, gold: 0.005, silver: 0.005, crypto: 0.03 },
  },
  {
    id: 'markets-014',
    type: 'markets',
    title: 'Strong Rally',
    description: 'Bonds: -0.5% | Stocks: +3% | Property: +2% | Gold: +2% | Silver: +4% | Crypto: +8%',
    changes: { bonds: -0.005, stocks: 0.03, propertyIndex: 0.02, gold: 0.02, silver: 0.04, crypto: 0.08 },
  },
  {
    id: 'markets-015',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: 0% | Stocks: +1% | Property: +0.5% | Gold: +0.5% | Silver: +0.5% | Crypto: +3%',
    changes: { bonds: 0, stocks: 0.01, propertyIndex: 0.005, gold: 0.005, silver: 0.005, crypto: 0.03 },
  },
  {
    id: 'markets-016',
    type: 'markets',
    title: 'Property Surge',
    description: 'Bonds: 0% | Stocks: +2% | Property: +4% | Gold: +1% | Silver: +1.5% | Crypto: +5%',
    changes: { bonds: 0, stocks: 0.02, propertyIndex: 0.04, gold: 0.01, silver: 0.015, crypto: 0.05 },
  },
  {
    id: 'markets-017',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: 0% | Stocks: +1.5% | Property: +0.5% | Gold: +1.5% | Silver: +2% | Crypto: +3%',
    changes: { bonds: 0, stocks: 0.015, propertyIndex: 0.005, gold: 0.015, silver: 0.02, crypto: 0.03 },
  },
  {
    id: 'markets-018',
    type: 'markets',
    title: 'Risk Off',
    description: 'Bonds: 0% | Stocks: -1% | Property: -1.5% | Gold: +2% | Silver: +3% | Crypto: +6%',
    changes: { bonds: 0, stocks: -0.01, propertyIndex: -0.015, gold: 0.02, silver: 0.03, crypto: 0.06 },
  },
  {
    id: 'markets-019',
    type: 'markets',
    title: 'Market Update',
    description: 'Bonds: 0% | Stocks: +2% | Property: +2% | Gold: -0.5% | Silver: -1% | Crypto: -3%',
    changes: { bonds: 0, stocks: 0.02, propertyIndex: 0.02, gold: -0.005, silver: -0.01, crypto: -0.03 },
  },
  {
    id: 'markets-020',
    type: 'markets',
    title: 'Property Driven',
    description: 'Bonds: 0% | Stocks: +1% | Property: +3% | Gold: -1% | Silver: -2% | Crypto: +3%',
    changes: { bonds: 0, stocks: 0.01, propertyIndex: 0.03, gold: -0.01, silver: -0.02, crypto: 0.03 },
  },
  {
    id: 'markets-021',
    type: 'markets',
    title: 'Rate Rise',
    description: 'Interest Rate: +0.5% | Bonds: +0.5% | Stocks: -1% | Property: -0.5% | Gold: -0.5% | Silver: +0.5% | Crypto: +3%',
    changes: { interestRate: 0.005, bonds: 0.005, stocks: -0.01, propertyIndex: -0.005, gold: -0.005, silver: 0.005, crypto: 0.03 },
  },
  {
    id: 'markets-022',
    type: 'markets',
    title: 'Rate Rise',
    description: 'Interest Rate: +0.5% | Bonds: +0.5% | Stocks: -2% | Property: -1% | Gold: -1% | Silver: +1.5% | Crypto: +5%',
    changes: { interestRate: 0.005, bonds: 0.005, stocks: -0.02, propertyIndex: -0.01, gold: -0.01, silver: 0.015, crypto: 0.05 },
  },
  {
    id: 'markets-023',
    type: 'markets',
    title: 'Rate Rise',
    description: 'Interest Rate: +1% | Bonds: +1% | Stocks: -1% | Property: +0.5% | Gold: -0.5% | Silver: -0.5% | Crypto: -3%',
    changes: { interestRate: 0.01, bonds: 0.01, stocks: -0.01, propertyIndex: 0.005, gold: -0.005, silver: -0.005, crypto: -0.03 },
  },
  {
    id: 'markets-024',
    type: 'markets',
    title: 'Recession Signal',
    description: 'Interest Rate: +1% | Bonds: +1% | Stocks: -2% | Property: -4% | Gold: -1% | Silver: -1.5% | Crypto: -5%',
    changes: { interestRate: 0.01, bonds: 0.01, stocks: -0.02, propertyIndex: -0.04, gold: -0.01, silver: -0.015, crypto: -0.05 },
  },
  {
    id: 'markets-025',
    type: 'markets',
    title: 'Stagflation',
    description: 'Interest Rate: +1% | Bonds: +1% | Stocks: -1.5% | Property: -0.5% | Gold: -1.5% | Silver: -2% | Crypto: -3%',
    changes: { interestRate: 0.01, bonds: 0.01, stocks: -0.015, propertyIndex: -0.005, gold: -0.015, silver: -0.02, crypto: -0.03 },
  },
  {
    id: 'markets-reshuffle',
    type: 'markets',
    title: 'Reshuffle',
    description: 'Reshuffle the Markets deck.',
    isReshuffle: true,
    changes: {},
  },
];

// ─── ALL CARDS MAP (for lookup by id) ──────────────────────────────────────────

export const allCards: Card[] = [
  ...learnCards,
  ...investCards,
  ...fortuneCards,
  ...eventCards,
  ...marketsCards,
];

export const cardById = new Map<string, Card>(allCards.map(c => [c.id, c]));
