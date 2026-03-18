
import imageMapData from '../data/image_map.json';
const imageMap: any = imageMapData;

const formatCocTime = (seconds: number): string => {
  if (seconds <= 0) return "Ready";
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export const processVillageData = (rawData: any, dynamicMap: Record<number, string>, perks = { builder: 1, lab: 1 }, customName?: string) => {
  const now = Math.floor(Date.now() / 1000); 
  const exportTime = rawData.timestamp || now;
  const dataAge = Math.max(0, now - exportTime);

  const hasBuilderPotion = rawData.boosts?.builder_boost > 0;
  const hasLabPotion = rawData.boosts?.lab_boost > 0;

  const mapItem = (item: any, type: string) => {
    const actualRemaining = item.timer ? Math.max(0, item.timer - dataAge) : 0;

    // APPLY POTION MULTIPLIERS TO DISPLAY TIME
    // Note: This only changes the string "5h 20m", not the raw remainingSeconds used for the progress bar
    let displaySeconds = actualRemaining;
    if (type === 'hero' || type === 'building' || type === 'trap') {
      if (hasBuilderPotion) displaySeconds /= 10;
    } else if (type === 'unit' || type === 'spell') {
      if (hasLabPotion) displaySeconds /= 24;
    }
    
    // FETCH NAME FROM DB MAP (No static fallbacks)
    const name = dynamicMap[item.data] || `${type} (${item.data})`;
    
    const categoryKey = type === 'unit' ? 'units' : type === 'spell' ? 'spells' : `${type}s`; 
    const itemImages = imageMap[categoryKey]?.[item.data.toString()];
    const imageUrl = itemImages?.levels?.[item.lvl.toString()] || "/placeholder.png";

    return {
      id: `${type}-${item.data}-${item.lvl}-${Math.random()}`,
      dataId: item.data,
      name,
      currentLevel: item.lvl,
      image: imageUrl,
      isUpgrading: actualRemaining > 0,
      remainingSeconds: actualRemaining,
      finishTime: actualRemaining > 0 ? formatCocTime(actualRemaining) : null,
      type
    };
  };

  const buildingItems = (rawData.buildings || []).map((b: any) => mapItem(b, 'building'));
  const trapItems = (rawData.traps || []).map((t: any) => mapItem(t, 'trap'));
  const heroItems = (rawData.heroes || []).map((h: any) => mapItem(h, 'hero'));
  const petItems = (rawData.pets || []).map((p: any) => mapItem(p, 'pet'));
  
  const troopResearch = (rawData.units || []).map((u: any) => mapItem(u, 'unit'));
  const spellResearch = (rawData.spells || []).map((s: any) => mapItem(s, 'spell'));

  const builderUpgrades = [...buildingItems, ...trapItems, ...heroItems].filter(i => i.isUpgrading);
  const labUpgrades = [...troopResearch, ...spellResearch].filter(r => r.isUpgrading);
  const activePets = petItems.filter(p => p.isUpgrading);

  const hasBob = rawData.buildings.some((b: any) => b.data === 1000063);

  return {
    id: rawData.tag,
    name: customName || rawData.name || "Unnamed Village",
    townHallLevel: (rawData.buildings.find((b: any) => b.data === 1000001)?.lvl || 1) ,
    activeBuilders: builderUpgrades.length,
    totalBuilders: hasBob ? 6 : 5,
    labStatus: labUpgrades.length > 0 ? labUpgrades[0].finishTime : "Idle",
    nextFreeTime: builderUpgrades.length > 0 
      ? formatCocTime(Math.min(...builderUpgrades.map(u => u.remainingSeconds))) 
      : "Ready",
    
    // Separate arrays for UI
    builderUpgrades: builderUpgrades.map(u => ({...u, boosted: hasBuilderPotion})),
    labUpgrades: labUpgrades.map(u => ({...u, boosted: hasLabPotion})),
    boosts: {
      builderPotion: hasBuilderPotion ? formatCocTime(rawData.boosts.builder_boost) : null,
      labPotion: hasLabPotion ? formatCocTime(rawData.boosts.lab_boost) : null,
    },
    petUpgrades: activePets,
    isMain: true
  };
};