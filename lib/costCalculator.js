/**
 * Cost Calculator Module
 * Pure JavaScript functions for wash cost analysis
 */

/**
 * Calculate monthly and annual wash costs
 * @param {Object} params - Cost parameters
 * @param {number} params.pricePerWash - Cost per individual wash
 * @param {number} params.monthlyMembership - Monthly membership fee
 * @param {number} params.washesPerMonth - Expected washes per month
 * @returns {Object} Cost analysis
 */
export function calculateWashCosts(params) {
  const {
    pricePerWash = 15,
    monthlyMembership = 30,
    washesPerMonth = 4,
  } = params;

  // Pay-per-wash costs
  const monthlyPayPerWash = pricePerWash * washesPerMonth;
  const annualPayPerWash = monthlyPayPerWash * 12;

  // Membership costs
  const annualMembership = monthlyMembership * 12;

  // Savings
  const monthlySavings = monthlyPayPerWash - monthlyMembership;
  const annualSavings = annualPayPerWash - annualMembership;

  // Break-even analysis
  const breakEvenWashesPerMonth = monthlyMembership / pricePerWash;
  const isMembershipWorthIt = washesPerMonth >= breakEvenWashesPerMonth;

  // Savings percentage
  const savingsPercentage = isMembershipWorthIt
    ? ((monthlySavings / monthlyPayPerWash) * 100)
    : 0;

  return {
    payPerWash: {
      monthly: monthlyPayPerWash,
      annual: annualPayPerWash,
    },
    membership: {
      monthly: monthlyMembership,
      annual: annualMembership,
    },
    savings: {
      monthly: monthlySavings,
      annual: annualSavings,
      percentage: savingsPercentage,
    },
    breakEven: {
      washesPerMonth: breakEvenWashesPerMonth,
      isMembershipWorthIt,
    },
  };
}

/**
 * Generate cost recommendation text
 * @param {Object} analysis - Cost analysis from calculateWashCosts
 * @returns {string} Recommendation text
 */
export function generateCostRecommendation(analysis) {
  const { breakEven, savings } = analysis;

  if (breakEven.isMembershipWorthIt) {
    return `Membership saves you $${Math.abs(savings.monthly).toFixed(2)}/month (${savings.percentage.toFixed(0)}% savings). Worth it!`;
  } else {
    return `Pay-per-wash is cheaper. You'd need ${Math.ceil(breakEven.washesPerMonth)} washes/month to break even on membership.`;
  }
}

/**
 * Calculate cost per wash with membership
 * @param {number} monthlyMembership - Monthly membership fee
 * @param {number} washesPerMonth - Washes used per month
 * @returns {number} Effective cost per wash
 */
export function calculateEffectiveCostPerWash(monthlyMembership, washesPerMonth) {
  if (washesPerMonth === 0) return Infinity;
  return monthlyMembership / washesPerMonth;
}
