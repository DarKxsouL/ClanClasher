import React from 'react';
import imageMapData from '../data/image_map.json';

// Type definition for our image map
const imageMap: any = imageMapData;

interface Props {
  dataId: number;
  lvl: number;
}

const BuildingCard: React.FC<Props> = ({ dataId, lvl }) => {
  // Get building info from the map using the ID
  const info = imageMap.buildings[dataId.toString()];
  
  // Construct the image path. Note: ensure your public folder 
  // contains these images at the paths specified in your JSON.
  const imageUrl = info?.levels[lvl.toString()] || "/assets/placeholder.png";
  const buildingName = info?.name || "Unknown";

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl p-3 flex flex-col items-center hover:scale-105 transition-transform">
      <div className="relative w-16 h-16 mb-2">
        <img 
          src={imageUrl} 
          alt={buildingName} 
          className="w-full h-full object-contain"
          onError={(e) => (e.currentTarget.src = "/assets/placeholder.png")}
        />
      </div>
      <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">
        {buildingName}
      </h4>
      <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full mt-1">
        LVL {lvl}
      </span>
    </div>
  );
};

export default BuildingCard;