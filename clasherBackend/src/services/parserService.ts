import fs from 'fs';
import path from 'path';

// In CommonJS, we don't need the import.meta logic. 
// __dirname is already available.

export const loadStaticData = (fileName: string) => {
  try {
    // __dirname refers to 'server/src/services'
    // We go up one level (..) to 'src' and then into 'data'
    const filePath = path.join(__dirname, '../data', fileName);
    
    if (!fs.existsSync(filePath)) {
      console.error(`File not found: ${filePath}`);
      return null;
    }

    const rawData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error(`Error loading ${fileName}:`, error);
    return null;
  }
};

export const processVillageExport = (rawJson: any) => {
  const buildingData = loadStaticData('buildings.json');
  
  if (!buildingData) return [];

  // Assuming rawJson has a property 'buildings'
  const rawBuildings = rawJson.buildings || [];

  return rawBuildings.map((item: any) => {
    // We will refine this 'find' logic once you share the JSON snippet!
    const info = buildingData.find((b: any) => b.id === item.dataId);

    return {
      name: info ? info.name : "Unknown Building",
      level: (item.lvl || 0) + 1,
      id: item.dataId,
    };
  });
};