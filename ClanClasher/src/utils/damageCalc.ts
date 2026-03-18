// src/utils/damageCalc.ts

export const calculateResults = (initialHP: number, queue: any[]) => {
  let currentHP = initialHP;
  let eqCount = 0;

  queue.forEach((action) => {
    // Find the damage value for the specific level selected in the action
    const levelData = action.levels.find((l: any) => l.level === action.selectedLevel);
    const damageValue = levelData?.value || 0;

    if (action.type === 'percent') {
      eqCount++;
      // Decay formula: 1st EQ is 100% of its power, 2nd is 1/3, etc.
      const multiplier = 1 / (2 * eqCount - 1);
      const damageAmount = initialHP * (damageValue / 100) * multiplier;
      currentHP -= damageAmount;
    } else {
      currentHP -= damageValue;
    }
  });

  return {
    remainingHP: Math.max(0, Math.ceil(currentHP)),
    percentDestroyed: Math.min(100, Math.floor(((initialHP - currentHP) / initialHP) * 100))
  };
};