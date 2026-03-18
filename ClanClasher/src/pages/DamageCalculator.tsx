import React, { useState, useEffect, useMemo } from 'react';
import { calculateResults } from '../utils/damageCalc';
import { BUILDINGS_DATA, ATTACK_DATA } from '../data/gameData';
import { IoTrash, IoAdd } from "react-icons/io5";

const DamageCalculator = () => {
  // Target States
  const [targetTH, setTargetTH] = useState(13);
  const [targetBuildingId, setTargetBuildingId] = useState(BUILDINGS_DATA[0].id);
  const [targetLevel, setTargetLevel] = useState(1);
  
  // Attacker States
  const [attackerTH, setAttackerTH] = useState(13);
  const [actionQueue, setActionQueue] = useState<any[]>([]);

  // 1. Sync Building Selection
  const currentBuilding = useMemo(() => 
    BUILDINGS_DATA.find(b => b.id === targetBuildingId) || BUILDINGS_DATA[0]
  , [targetBuildingId]);

  // 2. Sync Level when TH or Building changes
  useEffect(() => {
    const validLevels = currentBuilding.levels.filter(l => l.thRequired <= targetTH);
    if (validLevels.length > 0) {
      setTargetLevel(validLevels[validLevels.length - 1].level); // Default to max for that TH
    }
  }, [targetTH, targetBuildingId, currentBuilding]);

  // 3. Calculate Results
  const initialHP = currentBuilding.levels.find(l => l.level === targetLevel)?.value || 0;
  const { remainingHP, percentDestroyed } = calculateResults(initialHP, actionQueue);

  return (
    <div className="p-6 text-white max-w-7xl mx-auto space-y-8">
      
      {/* --- TARGET SETUP --- */}
      <div className="bg-[#1D2E3E]/80 p-8 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-red-400">
          🎯 Target: {currentBuilding.name} (Lvl {targetLevel})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Dropdown label="Target Town Hall" value={targetTH} options={[11,12,13,14,15,16]} onChange={setTargetTH} />
          
          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-bold uppercase">Building Type</label>
            <select 
              value={targetBuildingId}
              onChange={(e) => setTargetBuildingId(e.target.value)}
              className="bg-black/40 p-3 rounded-xl border border-white/10 outline-none focus:border-blue-500"
            >
              {BUILDINGS_DATA.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs text-gray-500 font-bold uppercase">Building Level</label>
            <select 
              value={targetLevel}
              onChange={(e) => setTargetLevel(Number(e.target.value))}
              className="bg-black/40 p-3 rounded-xl border border-white/10 outline-none"
            >
              {currentBuilding.levels.filter(l => l.thRequired <= targetTH).map(l => (
                <option key={l.level} value={l.level}>Level {l.level} — {l.value} HP</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* --- ATTACKER CONFIG --- */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#1D2E3E]/60 p-6 rounded-3xl border border-white/10">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Attacker Arsenal</h3>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400 uppercase">My TH</span>
                    <select value={attackerTH} onChange={(e) => setAttackerTH(Number(e.target.value))} className="bg-black/40 rounded-md p-1">
                        {[11,12,13,14,15,16].map(v => <option key={v} value={v}>{v}</option>)}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AttackCategory title="Hero Equipment" items={ATTACK_DATA.equipments} th={attackerTH} onAdd={(item) => setActionQueue([...actionQueue, item])} />
              <AttackCategory title="Spells" items={ATTACK_DATA.spells} th={attackerTH} onAdd={(item) => setActionQueue([...actionQueue, item])} />
              {/* You can add Troops/Siege categories here */}
            </div>
          </div>

          {/* Action Sequence List */}
          <div className="bg-black/20 p-6 rounded-3xl border border-white/5 min-h-[200px]">
             <h3 className="text-xs font-bold text-gray-500 uppercase mb-4">Execution Sequence</h3>
             <div className="flex flex-wrap gap-3">
                {actionQueue.map((act, i) => (
                  <div key={i} className="flex items-center gap-2 bg-blue-600/20 border border-blue-500/30 px-3 py-2 rounded-xl group">
                    <span className="text-sm font-medium">{act.name} <span className="text-[10px] opacity-60">Lvl {act.selectedLevel}</span></span>
                    <button onClick={() => setActionQueue(actionQueue.filter((_, idx) => idx !== i))}>
                      <IoTrash className="text-red-400 hover:text-red-200" size={14} />
                    </button>
                  </div>
                ))}
                {actionQueue.length > 0 && (
                  <button onClick={() => setActionQueue([])} className="text-xs text-red-500 hover:underline px-2">Clear All</button>
                )}
             </div>
          </div>
        </div>

        {/* --- LIVE RESULTS --- */}
        <div className="bg-[#1D2E3E] p-8 rounded-3xl border-2 border-blue-500/20 flex flex-col items-center justify-center text-center shadow-2xl">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Remaining HP</p>
            <h1 className={`text-7xl font-black my-4 transition-colors ${remainingHP === 0 ? 'text-green-400' : 'text-white'}`}>
                {remainingHP}
            </h1>
            <div className="w-full bg-black/40 h-4 rounded-full mt-4 overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-500 ${remainingHP === 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                  style={{ width: `${100 - percentDestroyed}%` }}
                />
            </div>
            <p className="mt-4 font-mono text-blue-400">{percentDestroyed}% Damage Dealt</p>
            
            {remainingHP === 0 && (
              <div className="mt-6 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                TARGET DESTROYED
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Internal Sub-components to clean up the code
const Dropdown = ({ label, value, options, onChange }: any) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs text-gray-500 font-bold uppercase">{label}</label>
    <select 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-black/40 p-3 rounded-xl border border-white/10 outline-none"
    >
      {options.map((o: any) => <option key={o} value={o}>Town Hall {o}</option>)}
    </select>
  </div>
);

const AttackCategory = ({ title, items, th, onAdd }: any) => {
  const [selectedId, setSelectedId] = useState(items[0].id);
  const currentItem = items.find((i: any) => i.id === selectedId);
  const availableLevels = currentItem.levels.filter((l: any) => l.thRequired <= th);
  const [selectedLevel, setSelectedLevel] = useState(availableLevels[availableLevels.length - 1]?.level);

  // Re-sync level if TH changes
  useEffect(() => {
    setSelectedLevel(availableLevels[availableLevels.length - 1]?.level);
  }, [th, selectedId]);

  return (
    <div className="bg-white/5 p-5 rounded-2xl border border-white/5 space-y-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{title}</p>
      <select 
        value={selectedId} 
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full bg-black/40 p-2 rounded-lg text-sm border border-white/5"
      >
        {items.map((i: any) => <option key={i.id} value={i.id}>{i.name}</option>)}
      </select>
      <select 
        value={selectedLevel} 
        onChange={(e) => setSelectedLevel(Number(e.target.value))}
        className="w-full bg-black/40 p-2 rounded-lg text-sm border border-white/5"
      >
        {availableLevels.map((l: any) => (
          <option key={l.level} value={l.level}>Level {l.level} ({l.value}{currentItem.type === 'percent' ? '%' : ' Dmg'})</option>
        ))}
      </select>
      <button 
        onClick={() => onAdd({ ...currentItem, selectedLevel })}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 py-2 rounded-xl text-xs font-bold transition-all"
      >
        <IoAdd size={16} /> Add to Sequence
      </button>
    </div>
  );
};

export default DamageCalculator;