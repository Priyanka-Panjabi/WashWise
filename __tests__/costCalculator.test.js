/**
 * Tests for Cost Calculator
 */

import {
  calculateWashCosts,
  generateCostRecommendation,
  calculateEffectiveCostPerWash,
} from '../lib/costCalculator';

describe('calculateWashCosts', () => {
  test('calculates costs correctly when membership is worth it', () => {
    const params = {
      pricePerWash: 15,
      monthlyMembership: 30,
      washesPerMonth: 4,
    };

    const result = calculateWashCosts(params);

    expect(result.payPerWash.monthly).toBe(60);
    expect(result.payPerWash.annual).toBe(720);
    expect(result.membership.monthly).toBe(30);
    expect(result.membership.annual).toBe(360);
    expect(result.savings.monthly).toBe(30);
    expect(result.savings.annual).toBe(360);
    expect(result.breakEven.isMembershipWorthIt).toBe(true);
  });

  test('calculates when membership is not worth it', () => {
    const params = {
      pricePerWash: 15,
      monthlyMembership: 30,
      washesPerMonth: 1,
    };

    const result = calculateWashCosts(params);

    expect(result.payPerWash.monthly).toBe(15);
    expect(result.payPerWash.annual).toBe(180);
    expect(result.membership.monthly).toBe(30);
    expect(result.breakEven.isMembershipWorthIt).toBe(false);
  });

  test('calculates break-even point correctly', () => {
    const params = {
      pricePerWash: 15,
      monthlyMembership: 30,
      washesPerMonth: 3,
    };

    const result = calculateWashCosts(params);

    // Break-even: 30 / 15 = 2 washes/month
    expect(result.breakEven.washesPerMonth).toBe(2);
    expect(result.breakEven.isMembershipWorthIt).toBe(true);
  });

  test('handles default values', () => {
    const result = calculateWashCosts({});

    expect(result.payPerWash.monthly).toBe(60);
    expect(result.membership.monthly).toBe(30);
  });

  test('calculates savings percentage correctly', () => {
    const params = {
      pricePerWash: 20,
      monthlyMembership: 40,
      washesPerMonth: 4,
    };

    const result = calculateWashCosts(params);

    // Pay-per-wash: 80, Membership: 40, Savings: 40
    // Percentage: (40 / 80) * 100 = 50%
    expect(result.savings.percentage).toBe(50);
  });

  test('returns zero savings percentage when not worth it', () => {
    const params = {
      pricePerWash: 15,
      monthlyMembership: 50,
      washesPerMonth: 2,
    };

    const result = calculateWashCosts(params);

    expect(result.savings.percentage).toBe(0);
  });
});

describe('generateCostRecommendation', () => {
  test('recommends membership when worth it', () => {
    const analysis = {
      breakEven: { isMembershipWorthIt: true },
      savings: { monthly: 30, percentage: 50 },
    };

    const recommendation = generateCostRecommendation(analysis);

    expect(recommendation).toContain('Membership');
    expect(recommendation).toContain('$30.00');
    expect(recommendation).toContain('50% savings');
  });

  test('recommends pay-per-wash when membership not worth it', () => {
    const analysis = {
      breakEven: { isMembershipWorthIt: false, washesPerMonth: 3 },
      savings: { monthly: -10 },
    };

    const recommendation = generateCostRecommendation(analysis);

    expect(recommendation).toContain('Pay-per-wash');
    expect(recommendation).toContain('3');
  });
});

describe('calculateEffectiveCostPerWash', () => {
  test('calculates effective cost per wash', () => {
    const result = calculateEffectiveCostPerWash(30, 4);
    expect(result).toBe(7.5);
  });

  test('returns Infinity when no washes', () => {
    const result = calculateEffectiveCostPerWash(30, 0);
    expect(result).toBe(Infinity);
  });

  test('handles fractional washes', () => {
    const result = calculateEffectiveCostPerWash(30, 2.5);
    expect(result).toBe(12);
  });
});
