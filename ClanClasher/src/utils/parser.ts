export const parseExport = (json: any) => {
  return json.buildings.map((b: any) => ({
    name: COC_ID_MAP[b.data] || `Unknown (${b.data})`,
    level: b.lvl + 1, // JSON uses 0-indexed levels
    isUpgrading: !!b.timer,
    remainingTime: b.timer || 0
  }));
};