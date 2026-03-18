

import BuildingData from "../models/BuildingData";

export const calculateProgress = async (
  userBuildings: any[],
  targetTH: number,
  boostPercentage: number = 0
) => {
  const th = Number(targetTH)
  console.log(`🚀 BACKEND: Starting calculation for TH${th}`);
  const multiplier = 1 - boostPercentage;

  const activeBuildersCount = userBuildings.filter((b) => b.timer && b.timer > 0).length;
  const activeUpgrades: any[] = [];

  let stats = {
    goldNeeded: 0,
    elixirNeeded: 0,
    darkElixirNeeded: 0,
    timeSeconds: 0,
    totalWeight: 0,
    maxWeight: 0,
  };

  for (const item of userBuildings) {
    const buildingId = Number(item.data);
    const master = await BuildingData.findById(buildingId);

    if (!master) {
      console.warn(`⚠️ BACKEND: Building ID ${buildingId} not found in MongoDB!`);
      continue; // Skip to next building if not in DB
    }

    // --- 1. HANDLE ACTIVE UPGRADES (The Fix) ---
    if (item.timer && item.timer > 0) {
      // Find the build_time for the level being built (current lvl + 1)
      const targetLevelData = master.levels.find(
        (l: any) => l.level === item.lvl ,
      );
      
      activeUpgrades.push({
        dataId: item.data,
        remainingSeconds: item.timer,
        totalSeconds: targetLevelData?.build_time || item.timer,
        // totalSeconds: targetLevelData?.build_time || targetLevelData?.upgrade_time || item.timer,
      });
    }

    // --- 2. CALCULATE COMPLETION WEIGHTS ---
    const maxLevelForTH = master.levels
      .filter((l: any) => l.required_townhall <= th)
      .sort((a: any, b: any) => b.level - a.level)[0]?.level || 1;

    stats.totalWeight += item.lvl;
    stats.maxWeight += maxLevelForTH;

    // --- 3. CALCULATE PENDING UPGRADE COSTS ---
    const pending = master.levels.filter(
      (l: any) => l.level > item.lvl && l.required_townhall <= th,
    );

    pending.forEach((upg: any) => {
      const cost = Math.floor((upg.build_cost || upg.upgrade_cost || 0) * multiplier);
      const time = Math.floor((upg.build_time || upg.upgrade_time || 0) * multiplier);

      if (master.upgrade_resource === "Gold") stats.goldNeeded += cost;
      else if (master.upgrade_resource === "Elixir") stats.elixirNeeded += cost;
      else if (master.upgrade_resource === "Dark Elixir") stats.darkElixirNeeded += cost;

      stats.timeSeconds += time;
    });
  }

  const completionPercentage = stats.maxWeight > 0 
    ? ((stats.totalWeight / stats.maxWeight) * 100).toFixed(1) 
    : "0.0";

  return {
    goldNeeded: stats.goldNeeded,
    elixirNeeded: stats.elixirNeeded,
    darkElixirNeeded: stats.darkElixirNeeded,
    timeRemainingDays: (stats.timeSeconds / 86400).toFixed(1),
    activeBuildersFromData: activeBuildersCount,
    completionPercentage,
    activeUpgrades, // This will now be populated!
  };
};