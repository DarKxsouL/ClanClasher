// import { IoTrophy, IoStar, IoShieldCheckmark, IoSkull, IoMedal, IoTrendingUp } from "react-icons/io5";

// function PlayerStats() {
//   // Mock API Data
//   const player = {
//     name: "Jitesh Adekar",
//     tag: "#P8RRV90U",
//     clan: "Elite Warriors",
//     role: "Co-Leader",
//     level: 165,
//     trophies: 5102,
//     bestTrophies: 5420,
//     warStars: 1250,
//     donations: 4500,
//     received: 1200,
//   };

//   return (
//     <div className="p-6 text-white animate-in">
//       {/* Header Profile Section */}
//       <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-blue-600/20 to-transparent p-8 rounded-3xl border border-white/5">
//         <div className="flex items-center gap-6">
//           <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-lg shadow-blue-500/20">
//             {player.level}
//           </div>
//           <div>
//             <h2 className="text-4xl font-black tracking-tight">{player.name}</h2>
//             <p className="text-blue-400 font-mono">{player.tag} • <span className="text-gray-400">{player.role} of {player.clan}</span></p>
//           </div>
//         </div>
//         <div className="flex gap-4">
//             <div className="bg-black/20 px-4 py-2 rounded-xl border border-white/5">
//                 <p className="text-xs text-gray-500 uppercase">War Stars</p>
//                 <p className="text-xl font-bold flex items-center gap-2"><IoStar className="text-yellow-500" /> {player.warStars}</p>
//             </div>
//         </div>
//       </header>

//       {/* Stats Bento Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
//         {/* Trophies Card */}
//         <div className="md:col-span-2 bg-[#1D2E3E]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 relative overflow-hidden">
//           <IoTrendingUp className="absolute -right-4 -bottom-4 text-white/5 size-40" />
//           <h3 className="text-lg font-semibold mb-6 flex items-center gap-2 text-gray-400">
//             <IoTrophy className="text-yellow-500" /> Trophy Count
//           </h3>
//           <div className="flex items-end gap-10">
//             <div>
//                 <p className="text-5xl font-black">{player.trophies}</p>
//                 <p className="text-sm text-green-400 mt-2">+125 this season</p>
//             </div>
//             <div className="border-l border-white/10 pl-10">
//                 <p className="text-xs text-gray-500 uppercase">All-time Best</p>
//                 <p className="text-2xl font-bold text-gray-300">{player.bestTrophies}</p>
//             </div>
//           </div>
//         </div>

//         {/* Legend League Status */}
//         <div className="bg-gradient-to-br from-purple-900/40 to-[#1D2E3E] p-6 rounded-3xl border border-purple-500/20 flex flex-col justify-between">
//            <div className="flex justify-between items-start">
//              <IoMedal size={40} className="text-purple-400" />
//              <span className="bg-purple-500/20 text-purple-300 text-[10px] px-2 py-1 rounded-full uppercase font-bold">Legend League</span>
//            </div>
//            <div>
//              <p className="text-sm text-gray-400">Rank #14,202</p>
//              <p className="text-xl font-bold">Global Leaderboard</p>
//            </div>
//         </div>

//         {/* Small Detail Cards */}
//         <DetailCard icon={<IoShieldCheckmark className="text-blue-400" />} label="Clan Games" value="4,000 pts" />
//         <DetailCard icon={<IoSkull className="text-red-500" />} label="War Hit Rate" value="85%" />
//         <div className="bg-[#1D2E3E]/80 p-6 rounded-3xl border border-white/10">
//             <h4 className="text-xs text-gray-500 uppercase mb-4">Donation Ratio</h4>
//             <div className="flex items-center gap-3">
//                 <span className="text-green-400 font-bold">{player.donations}</span>
//                 <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden flex">
//                     <div className="bg-green-500 h-full w-[75%]" />
//                     <div className="bg-red-500 h-full w-[25%]" />
//                 </div>
//                 <span className="text-red-400 font-bold">{player.received}</span>
//             </div>
//         </div>

//       </div>
//     </div>
//   );
// }

// function DetailCard({ icon, label, value }) {
//   return (
//     <div className="bg-[#1D2E3E]/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex items-center gap-4">
//       <div className="p-3 bg-white/5 rounded-2xl">{icon}</div>
//       <div>
//         <p className="text-xs text-gray-500 uppercase">{label}</p>
//         <p className="text-xl font-bold">{value}</p>
//       </div>
//     </div>
//   );
// }

// export default PlayerStats;




import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoTrophy, IoStar, IoMedal } from "react-icons/io5";

function PlayerStats({ village }: any) {
  const [liveData, setLiveData] = useState<any>(null);

  useEffect(() => {
    if (village?.id) {
      axios.get(`http://localhost:5000/api/player/${village.id.replace('#', '')}`)
        .then(res => setLiveData(res.data))
        .catch(err => console.error("Supercell API Offline or Tag Invalid"));
    }
  }, [village]);

  if (!liveData) return <div className="p-10 text-center">Loading Supercell Profile...</div>;

  return (
    <div className="p-6 text-white animate-in">
      <header className="mb-10 flex justify-between items-center bg-blue-600/10 p-8 rounded-3xl border border-white/5">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl font-black shadow-lg">
            {liveData.expLevel}
          </div>
          <div>
            <h2 className="text-4xl font-black">{liveData.name}</h2>
            <p className="text-blue-400 font-mono">{liveData.tag} • <span className="text-gray-400">{liveData.role} of {liveData.clan?.name}</span></p>
          </div>
        </div>
        <div className="bg-black/20 px-6 py-4 rounded-2xl border border-white/5 text-center">
           <p className="text-[10px] text-gray-500 uppercase font-black">War Stars</p>
           <p className="text-2xl font-black text-yellow-500 flex items-center gap-2 justify-center"><IoStar /> {liveData.warStars}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#1D2E3E]/80 p-8 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><IoTrophy className="text-yellow-500"/> Current Trophies</h3>
          <p className="text-6xl font-black">{liveData.trophies}</p>
          <p className="text-sm text-gray-400 mt-2">All time best: {liveData.bestTrophies}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-900/40 to-[#1D2E3E] p-8 rounded-3xl border border-purple-500/20">
          <IoMedal size={40} className="text-purple-400 mb-4" />
          <h3 className="text-xl font-bold">Attack Wins</h3>
          <p className="text-4xl font-black">{liveData.attackWins}</p>
          <p className="text-sm text-gray-400 uppercase tracking-widest mt-1">This Season</p>
        </div>
      </div>
    </div>
  );
}

export default PlayerStats;