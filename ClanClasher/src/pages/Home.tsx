
import React, { useState } from "react";
import { IoHammer, IoTimeOutline, IoShieldCheckmark, IoRefreshOutline, IoFlask, IoCloudUploadOutline, IoTrashOutline, IoFlash } from "react-icons/io5";
import { type Village } from "../types/coc";

interface HomeProps {
  activeVillage: any;
  stats: any;
  perks: { builder: number; lab: number };
  setPerks: (p: any) => void;
  onImportData: (json: string) => void;
  onDeleteVillage: () => void;
}

const Home: React.FC<HomeProps> = ({ activeVillage, stats, perks, setPerks, onImportData, onDeleteVillage }) => {
  const [jsonInput, setJsonInput] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const hasData = activeVillage !== null && activeVillage.id;

  const getProgressWidth = (dataId: number, remaining: number) => {
    const upgradeStats = stats?.activeUpgrades?.find((u: any) => u.dataId === dataId);
    if (!upgradeStats || !upgradeStats.totalSeconds) return "2%";
    const percentage = ((upgradeStats.totalSeconds - remaining) / upgradeStats.totalSeconds) * 100;
    return `${Math.max(2, Math.min(100, percentage))}%`;
  };

  if (!hasData || isUpdating) {
    return (
      <div className="p-6 h-full flex items-center justify-center animate-in fade-in zoom-in duration-500">
        <div className="max-w-2xl w-full bg-[#1D2E3E]/90 backdrop-blur-xl p-10 rounded-[2rem] border border-white/10 shadow-2xl text-center">
          <IoCloudUploadOutline size={40} className="text-blue-400 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-3 text-white">{isUpdating ? "Update Village" : "Welcome, Chief!"}</h2>
          <textarea className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 font-mono text-sm text-blue-100 mb-6 focus:border-blue-500 outline-none" placeholder="Paste JSON here..." value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} />
          <div className="flex gap-4">
             {isUpdating && <button onClick={() => setIsUpdating(false)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl">Cancel</button>}
             <button onClick={() => { onImportData(jsonInput); setIsUpdating(false); setJsonInput(""); }} className="flex-[2] bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg">Confirm Village Data</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white animate-in fade-in duration-500">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{activeVillage.name} <span className="text-blue-400 text-sm ml-2">TH{activeVillage.townHallLevel}</span></h2>
          <p className="text-gray-500 font-mono text-sm">{activeVillage.id}</p>
        </div>
        <div className="flex gap-3">
          {/* Gold Pass Perk Selector */}
          <select 
            value={perks.builder} 
            onChange={(e) => setPerks({ builder: Number(e.target.value), lab: Number(e.target.value) })}
            className="bg-white/5 border border-white/10 text-xs rounded-lg px-3 py-2 outline-none text-blue-400 font-bold"
          >
            <option value={0}>0% Perk</option>
            <option value={0.1}>10% Perk</option>
            <option value={0.15}>15% Perk</option>
            <option value={0.2}>20% Perk</option>
          </select>
          <button onClick={() => setIsUpdating(true)} className="flex items-center gap-2 text-xs bg-white/5 px-4 py-2 rounded-lg border border-white/10 text-gray-400 hover:text-white"><IoRefreshOutline /> Update</button>
          <button onClick={() => window.confirm("Delete village?") && onDeleteVillage()} className="flex items-center gap-2 text-xs bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/10 text-red-400"><IoTrashOutline /> Delete</button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard icon={<IoHammer />} title="Builders" value={`${activeVillage.activeBuilders} / ${activeVillage.totalBuilders}`} color="text-orange-400" />
        <StatCard icon={<IoFlask />} title="Lab Status" value={activeVillage.labStatus} color="text-purple-400" />
        <StatCard icon={<IoShieldCheckmark />} title="War Status" value="Online" color="text-green-400" />
        <StatCard icon={<IoTimeOutline />} title="Next Builder Free" value={activeVillage.nextFreeTime} color="text-blue-400" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-[#1D2E3E]/80 p-8 rounded-3xl border border-white/10 flex flex-col items-center">
             <h3 className="text-lg font-bold w-full mb-6">Village Completion</h3>
             <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                   <circle cx="80" cy="80" r="70" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="12" />
                   <circle cx="80" cy="80" r="70" fill="transparent" stroke="#3b82f6" strokeWidth="12" strokeDasharray="440" strokeDashoffset={440 - (440 * (stats?.completionPercentage || 0)) / 100} strokeLinecap="round" />
                </svg>
                <span className="absolute text-3xl font-black">{stats?.completionPercentage || 0}%</span>
             </div>
             <p className="mt-6 text-sm text-gray-400">Total Gold Needed: <span className="text-white font-bold">{(stats?.goldNeeded / 1000000 || 0).toFixed(1)}M</span></p>
          </div>

          <div className="bg-[#1D2E3E]/80 p-6 rounded-3xl border border-white/10">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-400"><IoFlask /> Laboratory Research</h3>
            <div className="space-y-4">
              {activeVillage.labUpgrades && activeVillage.labUpgrades.length > 0 ? (
                activeVillage.labUpgrades.map((item: any) => (
                  <div key={item.id} className="bg-purple-500/5 p-4 rounded-xl border border-purple-500/10">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-bold">{item.name} <span className="text-xs font-normal opacity-50">Lvl {item.currentLevel}</span></span>
                      <span className="text-purple-400 font-mono text-xs">{item.finishTime}</span>
                    </div>
                    <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-purple-500 h-full" style={{ width: getProgressWidth(item.dataId, item.remainingSeconds) }} />
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-purple-500/10 p-6 rounded-xl border border-purple-500/10 text-center text-sm text-purple-200">
                  <div className="flex flex-col items-center gap-2">
                    <IoShieldCheckmark className="text-purple-300" size={24} />
                    <span className="font-semibold">Lab is free</span>
                    <span className="text-xs text-purple-200/80">No research is currently in progress.</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-[#1D2E3E]/80 p-6 rounded-3xl border border-white/10">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-orange-400"><IoHammer /> Active Builders</h3>
          <div className="space-y-4">
            {(() => {
              const activeUpgrades = activeVillage.builderUpgrades || [];
              const freeCount = activeVillage.totalBuilders - activeVillage.activeBuilders;
              const items = [
                ...activeUpgrades.map((upgrade: any) => ({ type: 'active', data: upgrade })),
                ...Array.from({ length: freeCount }, () => ({ type: 'free' }))
              ];
              return items.map((item, index) => {
                if (item.type === 'active') {
                  return (
                    <div key={item.data.id} className="bg-black/20 p-4 rounded-xl border border-white/5 relative group">
                      <div className="flex justify-between text-sm mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold">{item.data.name}</span>
                          {item.data.boosted && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20 flex items-center gap-1"><IoFlash size={10} /> 10x BOOST</span>}
                        </div>
                        <span className="text-orange-400 font-mono text-xs">{item.data.finishTime}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-orange-500 h-full transition-all" style={{ width: getProgressWidth(item.data.dataId, item.data.remainingSeconds) }} />
                      </div>
                    </div>
                  );
                } else {
                  return (
                    <div key={`free-${index}`} className="bg-black/10 p-6 rounded-xl border border-white/10 text-center text-sm text-gray-300">
                      <div className="flex flex-col items-center gap-2">
                        <IoShieldCheckmark className="text-green-300" size={24} />
                        <span className="font-semibold">Builder is free</span>
                        <span className="text-xs text-gray-400">Ready for new upgrades.</span>
                      </div>
                    </div>
                  );
                }
              });
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: any; title: string; value: string; color: string; }> = ({ icon, title, value, color }) => (
  <div className="bg-[#1D2E3E]/60 p-5 rounded-2xl border border-white/5">
    <div className={`mb-2 ${color}`}>{icon}</div>
    <div className="text-gray-500 text-[10px] font-bold uppercase">{title}</div>
    <div className="text-2xl font-black">{value}</div>
  </div>
);

export default Home;