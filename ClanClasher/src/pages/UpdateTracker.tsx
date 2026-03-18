// import React, { useState } from "react";
// import { 
//   IoShield, IoHammer, IoFlask, IoPerson, 
//   IoColorWand, IoEyeOffOutline, IoEyeOutline, IoCheckmarkDoneCircle 
// } from "react-icons/io5";

// // Types for our data
// interface TrackerData {
//   name: string;
//   current: number;
//   max: number;
//   time: string;
//   cost: string;
//   type: string;
// }

// interface Categories {
//   id: 'buildings' | 'heroes' | 'lab' | 'spells';
//   label: string;
//   icon: React.ReactNode;
// }

// const categories: Categories[] = [
//   { id: 'buildings', label: 'Buildings', icon: <IoShield /> },
//   { id: 'heroes', label: 'Heroes', icon: <IoPerson /> },
//   { id: 'lab', label: 'Laboratory', icon: <IoFlask /> },
//   { id: 'spells', label: 'Spells', icon: <IoColorWand /> },
// ];

// function UpdateTracker() {
//   const [activeTab, setActiveTab] = useState<Categories['id']>('buildings');
//   const [hideMaxed, setHideMaxed] = useState(false);

//   // Mock Data
//   const trackerData: Record<Categories['id'], TrackerData[]> = {
//     buildings: [
//       { name: "Eagle Artillery", current: 4, max: 5, time: "12d 4h", cost: "18M", type: "Defense" },
//       { name: "Inferno Tower", current: 8, max: 8, time: "Maxed", cost: "0", type: "Defense" },
//       { name: "Clan Castle", current: 8, max: 9, time: "14d", cost: "16M", type: "Support" },
//     ],
//     heroes: [
//       { name: "Archer Queen", current: 80, max: 80, time: "Maxed", cost: "0", type: "DE" },
//       { name: "Barbarian King", current: 65, max: 80, time: "5d 12h", cost: "150k", type: "DE" },
//     ],
//     lab: [],
//     spells: []
//   };

//   // 1. Logic to filter data
//   const currentCategoryData = trackerData[activeTab] || [];
//   const filteredData = hideMaxed 
//     ? currentCategoryData.filter(item => item.current < item.max) 
//     : currentCategoryData;

//   // 2. Logic for dynamic completion percentage
//   const calculateCompletion = () => {
//     const allItems = Object.values(trackerData).flat();
//     if (allItems.length === 0) return 0;
//     const totalCurrent = allItems.reduce((acc, item) => acc + item.current, 0);
//     const totalMax = allItems.reduce((acc, item) => acc + item.max, 0);
//     return ((totalCurrent / totalMax) * 100).toFixed(1);
//   };

//   return (
//     <div className="p-6 text-white animate-in fade-in duration-500">
//       {/* Header Section */}
//       <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
//         <div>
//           <h2 className="text-3xl font-bold tracking-tight">Update Tracker</h2>
//           <p className="text-gray-400">Track your path to Max Town Hall 13</p>
//         </div>
        
//         <div className="flex items-center gap-6">
//           <button 
//             onClick={() => setHideMaxed(!hideMaxed)}
//             className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
//               hideMaxed 
//               ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' 
//               : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
//             }`}
//           >
//             {hideMaxed ? <IoEyeOffOutline size={18} /> : <IoEyeOutline size={18} />}
//             {hideMaxed ? "Hide Maxed: ON" : "Hide Maxed: OFF"}
//           </button>

//           <div className="text-right">
//             <span className="text-[10px] text-gray-500 uppercase font-black tracking-widest">Village Progress</span>
//             <div className="text-3xl font-black text-blue-500 font-mono">{calculateCompletion()}%</div>
//           </div>
//         </div>
//       </header>

//       {/* Category Tabs */}
//       <div className="flex flex-wrap gap-2 mb-8 bg-black/20 p-1.5 rounded-2xl w-fit border border-white/5">
//         {categories.map((cat) => (
//           <button
//             key={cat.id}
//             onClick={() => setActiveTab(cat.id)}
//             className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
//               activeTab === cat.id 
//               ? 'bg-blue-600 shadow-lg shadow-blue-600/20 text-white' 
//               : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
//             }`}
//           >
//             {cat.icon} {cat.label}
//           </button>
//         ))}
//       </div>

//       {/* Grid List */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
//         {filteredData.length > 0 ? (
//           filteredData.map((item, index) => (
//             <TrackerItem key={item.name + index} item={item} />
//           ))
//         ) : (
//           <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-[#1D2E3E]/40 rounded-3xl border-2 border-dashed border-white/5">
//             <IoCheckmarkDoneCircle size={50} className="text-green-500/50 mb-4" />
//             <p className="text-gray-500 italic font-medium text-lg text-center px-4">
//               {hideMaxed 
//                 ? "All items in this category are maxed! Great work, Chief." 
//                 : "No data available in this category yet."}
//             </p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// // Sub-component: TrackerItem
// function TrackerItem({ item }: { item: TrackerData }) {
//   const isMaxed = item.current === item.max;
//   const progressPercent = (item.current / item.max) * 100;

//   return (
//     <div className={`bg-[#1D2E3E]/80 backdrop-blur-md p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden ${
//       isMaxed ? 'border-green-500/20 opacity-70' : 'border-white/10 hover:border-blue-500/40 shadow-xl'
//     }`}>
//       {/* Visual background hint for maxed items */}
//       {isMaxed && <div className="absolute top-0 right-0 p-2 text-green-500/20"><IoShield size={100} /></div>}

//       <div className="flex justify-between items-start mb-4 relative z-10">
//         <div>
//           <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded ${
//             isMaxed ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'
//           }`}>
//             {isMaxed ? 'Maxed' : item.type}
//           </span>
//           <h4 className="text-xl font-bold mt-2">{item.name}</h4>
//           <p className="text-sm text-gray-400 font-medium">Level {item.current} <span className="text-gray-600">/ {item.max}</span></p>
//         </div>
        
//         {!isMaxed && (
//           <div className="text-right">
//             <div className="flex items-center justify-end gap-1 text-orange-400 font-bold">
//               <IoHammer size={16} /> <span>{item.time}</span>
//             </div>
//             <div className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">Cost: {item.cost}</div>
//           </div>
//         )}
//       </div>

//       {/* Progress Bar Container */}
//       <div className="relative w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
//         <div 
//           className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
//             isMaxed ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-gradient-to-r from-blue-600 to-blue-400'
//           }`}
//           style={{ width: `${progressPercent}%` }}
//         />
//       </div>
      
//       {/* Action Buttons: Only show if not maxed */}
//       {!isMaxed && (
//         <div className="mt-5 flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
//           <button className="px-4 py-1.5 text-xs font-bold bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
//             Edit
//           </button>
//           <button className="px-4 py-1.5 text-xs font-bold bg-green-600/20 text-green-400 rounded-lg border border-green-600/30 hover:bg-green-600 hover:text-white transition-all">
//             Upgrade
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default UpdateTracker;



import React, { useState } from "react";
import BuildingCard from '../components/BuildingCard';
import StatsHeader from '../components/StatsHeader';

function UpdateTracker({ village, stats }: any) {
  const [hideMaxed, setHideMaxed] = useState(false);

  if (!village) return (
    <div className="h-full flex items-center justify-center text-gray-500 italic">
      Import village data on the Home screen to see tracking.
    </div>
  );

  return (
    <div className="p-6 animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter text-blue-500">Update Tracker</h2>
          <p className="text-gray-400 font-medium">Progress for TH{village.townHallLevel}</p>
        </div>
        <button 
          onClick={() => setHideMaxed(!hideMaxed)}
          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${hideMaxed ? 'bg-orange-500/20 border-orange-500/40 text-orange-400' : 'bg-white/5 border-white/10 text-gray-400'}`}
        >
          {hideMaxed ? "Show All" : "Hide Maxed"}
        </button>
      </header>

      <StatsHeader 
        gold={stats.goldNeeded} 
        elixir={stats.elixirNeeded} 
        time={stats.timeRemainingDays} 
      />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {village.buildings.map((b: any) => (
          <BuildingCard key={b.id} dataId={b.dataId} lvl={b.currentLevel} />
        ))}
      </div>
    </div>
  );
}

export default UpdateTracker;