/**
 * Tests for Wash Decision Engine
 */

import {
  calculateSaltRiskScore,
  calculateWashRecommendation,
  generateExplanation,
  calculateEffectiveProtection,
} from '../lib/washDecisionEngine';

describe('calculateSaltRiskScore', () => {
  test('calculates risk score correctly with wash type', () => {
    const input = {
      daysSinceSnow: 5,
      daysSinceWash: 2,
      freezeDays: 3,
      washType: 'basic',
    };

    const result = calculateSaltRiskScore(input);

    // Protection: 3 - (2 * 0.8) = 3 - 1.6 = 1.4
    // Formula: (5 * 2) + (3 * 1.5) - 1.4 = 10 + 4.5 - 1.4 = 13.1
    expect(result.riskScore).toBeCloseTo(13.1);
    expect(result.riskLevel).toBe('High');
  });

  test('returns Low risk for low scores', () => {
    const input = {
      daysSinceSnow: 1,
      daysSinceWash: 1,
      freezeDays: 1,
      washType: 'undercarriage',
    };

    const result = calculateSaltRiskScore(input);

    // Protection: 7 - (1 * 0.8) = 7 - 0.8 = 6.2
    // Formula: (1 * 2) + (1 * 1.5) - 6.2 = 2 + 1.5 - 6.2 = -2.7 → 0
    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe('Low');
  });

  test('returns Moderate risk for medium scores', () => {
    const input = {
      daysSinceSnow: 3,
      daysSinceWash: 1,
      freezeDays: 2,
      washType: 'basic',
    };

    const result = calculateSaltRiskScore(input);

    // Protection: 3 - (1 * 0.8) = 3 - 0.8 = 2.2
    // Formula: (3 * 2) + (2 * 1.5) - 2.2 = 6 + 3 - 2.2 = 6.8
    expect(result.riskScore).toBeCloseTo(6.8);
    expect(result.riskLevel).toBe('Moderate');
  });

  test('handles zero values', () => {
    const input = {
      daysSinceSnow: 0,
      daysSinceWash: 0,
      freezeDays: 0,
      washType: 'full_service',
    };

    const result = calculateSaltRiskScore(input);

    // Protection: 10 - 0 = 10
    // Formula: 0 + 0 - 10 = -10 → 0
    expect(result.riskScore).toBe(0);
    expect(result.riskLevel).toBe('Low');
  });

  test('ensures non-negative risk score', () => {
    const input = {
      daysSinceSnow: 1,
      daysSinceWash: 1,
      freezeDays: 0,
      washType: 'full_service',
    };

    const result = calculateSaltRiskScore(input);

    // Protection: 10 - (1 * 0.8) = 9.2
    // Formula: (1 * 2) + 0 - 9.2 = 2 - 9.2 = -7.2 → 0
    expect(result.riskScore).toBe(0);
  });
});

describe('calculateWashRecommendation', () => {
  test('recommends Wait when snow expected within 48h', () => {
    const input = {
      snowNext48h: true,
      dryDaysAhead: 2,
      daysSinceSnow: 5,
      daysSinceWash: 2,
      freezeDays: 3,
    };

    const result = calculateWashRecommendation(input);

    expect(result.recommendation).toBe('Wait');
    expect(result.confidence).toBe('High');
    expect(result.priority).toBe('low');
  });

  test('recommends Wash Now for high risk score', () => {
    const input = {
      snowNext48h: false,
      dryDaysAhead: 3,
      daysSinceSnow: 8,
      daysSinceWash: 0,
      freezeDays: 4,
    };

    const result = calculateWashRecommendation(input);

    // Risk score: (8 * 2) + (4 * 1.5) - 0 = 16 + 6 = 22
    expect(result.recommendation).toBe('Wash Now');
    expect(result.riskScore).toBeGreaterThan(15);
  });

  test('recommends Undercarriage for moderate risk', () => {
    const input = {
      snowNext48h: false,
      dryDaysAhead: 2,
      daysSinceSnow: 5,
      daysSinceWash: 1,
      freezeDays: 2,
    };

    const result = calculateWashRecommendation(input);

    // Risk score: (5 * 2) + (2 * 1.5) - 1 = 10 + 3 - 1 = 12
    expect(result.recommendation).toBe('Undercarriage Recommended');
    expect(result.riskScore).toBeGreaterThan(8);
    expect(result.riskScore).toBeLessThanOrEqual(15);
  });

  test('recommends Wait for low risk', () => {
    const input = {
      snowNext48h: false,
      dryDaysAhead: 5,
      daysSinceSnow: 1,
      daysSinceWash: 0,
      freezeDays: 1,
    };

    const result = calculateWashRecommendation(input);

    // Risk score: (1 * 2) + (1 * 1.5) - 0 = 2 + 1.5 = 3.5
    expect(result.recommendation).toBe('Wait');
    expect(result.riskScore).toBeLessThanOrEqual(8);
  });

  test('includes all factors in result', () => {
    const input = {
      snowNext48h: false,
      dryDaysAhead: 3,
      daysSinceSnow: 3,
      daysSinceWash: 2,
      freezeDays: 2,
      washType: 'basic',
    };

    const result = calculateWashRecommendation(input);

    expect(result.factors).toEqual(input);
    expect(result).toHaveProperty('recommendation');
    expect(result).toHaveProperty('confidence');
    expect(result).toHaveProperty('priority');
    expect(result).toHaveProperty('riskScore');
    expect(result).toHaveProperty('riskLevel');
  });
});

describe('generateExplanation', () => {
  test('generates explanation for Wait recommendation with snow', () => {
    const result = {
      recommendation: 'Wait',
      riskScore: 10,
      riskLevel: 'Moderate',
      factors: {
        snowNext48h: true,
        dryDaysAhead: 1,
        daysSinceSnow: 2,
        freezeDays: 2,
      },
    };

    const explanation = generateExplanation(result);

    expect(explanation).toContain('Snow is expected');
    expect(explanation).toContain('48 hours');
  });

  test('generates explanation for Wash Now recommendation', () => {
    const result = {
      recommendation: 'Wash Now',
      riskScore: 18,
      riskLevel: 'High',
      factors: {
        snowNext48h: false,
        dryDaysAhead: 3,
        daysSinceSnow: 6,
        freezeDays: 4,
      },
    };

    const explanation = generateExplanation(result);

    expect(explanation).toContain('6 days');
    expect(explanation.toLowerCase()).toContain('salt');
  });

  test('generates explanation for Undercarriage recommendation', () => {
    const result = {
      recommendation: 'Undercarriage Recommended',
      riskScore: 10,
      riskLevel: 'Moderate',
      factors: {
        snowNext48h: false,
        dryDaysAhead: 3,
        daysSinceSnow: 4,
        freezeDays: 2,
      },
    };

    const explanation = generateExplanation(result);

    expect(explanation.toLowerCase()).toContain('undercarriage');
    expect(explanation.toLowerCase()).toContain('moderate');
  });

  test('generates explanation for Wait with low risk', () => {
    const result = {
      recommendation: 'Wait',
      riskScore: 2,
      riskLevel: 'Low',
      factors: {
        snowNext48h: false,
        dryDaysAhead: 5,
        daysSinceSnow: 1,
        freezeDays: 0,
      },
    };

    const explanation = generateExplanation(result);

    expect(explanation.toLowerCase()).toContain('low');
  });
});

// NEW TESTS FOR PROTECTION DECAY SYSTEM
describe('Protection Decay System', () => {
  describe('calculateEffectiveProtection', () => {
    test('Full service wash - Day 1', () => {
      const result = calculateEffectiveProtection(1, 'full_service');

      expect(result.initialProtection).toBe(10);
      expect(result.currentProtection).toBeCloseTo(9.2);
      expect(result.protectionLevel).toBe('High');
      expect(result.decayAmount).toBeCloseTo(0.8);
    });

    test('Full service wash - Day 7', () => {
      const result = calculateEffectiveProtection(7, 'full_service');

      expect(result.currentProtection).toBeCloseTo(4.4);
      expect(result.protectionLevel).toBe('Medium');
    });

    test('Full service wash - Day 14', () => {
      const result = calculateEffectiveProtection(14, 'full_service');

      // 10 - (14 * 0.8) = 10 - 11.2 = -1.2, clamped to 0
      expect(result.currentProtection).toBe(0);
      expect(result.protectionLevel).toBe('None');
    });

    test('Basic wash - Day 3', () => {
      const result = calculateEffectiveProtection(3, 'basic');

      // 3 - (3 * 0.8) = 3 - 2.4 = 0.6
      expect(result.currentProtection).toBeCloseTo(0.6);
      expect(result.protectionLevel).toBe('Low');
    });

    test('Basic wash - Day 4', () => {
      const result = calculateEffectiveProtection(4, 'basic');

      // 3 - (4 * 0.8) = 3 - 3.2 = -0.2, clamped to 0
      expect(result.currentProtection).toBe(0);
      expect(result.protectionLevel).toBe('None');
    });

    test('Undercarriage wash - Day 5', () => {
      const result = calculateEffectiveProtection(5, 'undercarriage');

      // 7 - (5 * 0.8) = 7 - 4 = 3
      expect(result.currentProtection).toBe(3);
      expect(result.protectionLevel).toBe('Medium');
    });

    test('Default to basic wash type', () => {
      const result = calculateEffectiveProtection(1);

      expect(result.initialProtection).toBe(3);
      expect(result.washType).toBe('Basic Exterior');
    });

    test('Calculate days until protection expires', () => {
      const resultFullService = calculateEffectiveProtection(1, 'full_service');
      const resultBasic = calculateEffectiveProtection(1, 'basic');

      // Full service: 10 / 0.8 = 12.5 days
      expect(resultFullService.daysUntilExpired).toBe(13);

      // Basic: 3 / 0.8 = 3.75 days
      expect(resultBasic.daysUntilExpired).toBe(4);
    });
  });

  describe('Risk Score with Wash Types', () => {
    test('Recent full service wash reduces risk significantly', () => {
      const result = calculateSaltRiskScore({
        daysSinceSnow: 5,
        daysSinceWash: 1,
        freezeDays: 3,
        washType: 'full_service'
      });

      // Protection: 10 - (1 * 0.8) = 9.2
      // Risk: (5*2) + (3*1.5) - 9.2 = 10 + 4.5 - 9.2 = 5.3
      expect(result.effectiveProtection).toBeCloseTo(9.2);
      expect(result.riskScore).toBeCloseTo(5.3);
      expect(result.riskLevel).toBe('Moderate');
    });

    test('Week-old basic wash offers little protection', () => {
      const result = calculateSaltRiskScore({
        daysSinceSnow: 5,
        daysSinceWash: 7,
        freezeDays: 3,
        washType: 'basic'
      });

      // Protection: 3 - (7 * 0.8) = 3 - 5.6 = -2.6 → 0
      // Risk: (5*2) + (3*1.5) - 0 = 14.5
      expect(result.effectiveProtection).toBe(0);
      expect(result.riskScore).toBe(14.5);
      expect(result.riskLevel).toBe('High');
    });

    test('Undercarriage wash provides medium protection', () => {
      const result = calculateSaltRiskScore({
        daysSinceSnow: 3,
        daysSinceWash: 5,
        freezeDays: 2,
        washType: 'undercarriage'
      });

      // Protection: 7 - (5 * 0.8) = 7 - 4 = 3
      // Risk: (3*2) + (2*1.5) - 3 = 6 + 3 - 3 = 6
      expect(result.effectiveProtection).toBe(3);
      expect(result.riskScore).toBe(6);
      expect(result.riskLevel).toBe('Moderate');
    });

    test('Fresh undercarriage wash vs old full service', () => {
      const freshUndercarriage = calculateSaltRiskScore({
        daysSinceSnow: 5,
        daysSinceWash: 1,
        freezeDays: 3,
        washType: 'undercarriage'
      });

      const oldFullService = calculateSaltRiskScore({
        daysSinceSnow: 5,
        daysSinceWash: 10,
        freezeDays: 3,
        washType: 'full_service'
      });

      // Fresh undercarriage: 7 - 0.8 = 6.2 protection
      // Old full service: 10 - 8 = 2 protection
      expect(freshUndercarriage.effectiveProtection).toBeCloseTo(6.2);
      expect(oldFullService.effectiveProtection).toBe(2);

      // Fresh undercarriage should have lower risk
      expect(freshUndercarriage.riskScore).toBeLessThan(oldFullService.riskScore);
    });
  });

  describe('Recommendation with Wash Types', () => {
    test('Full service wash changes recommendation from Wash Now to Wait', () => {
      const baseConditions = {
        snowNext48h: false,
        dryDaysAhead: 3,
        daysSinceSnow: 5,
        daysSinceWash: 1,
        freezeDays: 3
      };

      const withBasic = calculateWashRecommendation({
        ...baseConditions,
        washType: 'basic'
      });

      const withFullService = calculateWashRecommendation({
        ...baseConditions,
        washType: 'full_service'
      });

      // Basic protection: 3 - 0.8 = 2.2
      // Risk: 10 + 4.5 - 2.2 = 12.3 (Undercarriage Recommended)
      expect(withBasic.recommendation).toBe('Undercarriage Recommended');

      // Full service protection: 10 - 0.8 = 9.2
      // Risk: 10 + 4.5 - 9.2 = 5.3 (Wait)
      expect(withFullService.recommendation).toBe('Wait');
    });
  });
});
