// src/utils/damageCalculator.ts

export const calculateRemainingHP = (
  initialHP: number,
  actions: { type: 'flat' | 'percent'; value: number }[]
) => {
  let currentHP = initialHP;
  let eqCount = 0;

  actions.forEach((action) => {
    if (action.type === 'flat') {
      currentHP -= action.value;
    } else if (action.type === 'percent') {
      eqCount++;
      // Formula: 1st=100%, 2nd=1/3, 3rd=1/5, 4th=1/7 of the Max %
      const multiplier = 1 / (2 * eqCount - 1);
      const damageFromMax = initialHP * (action.value / 100) * multiplier;
      currentHP -= damageFromMax;
    }
  });

  return Math.max(0, Math.floor(currentHP));
};