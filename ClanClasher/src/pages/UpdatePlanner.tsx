import React, { useState, useMemo } from "react";
import { 
  IoHammer, IoFlash, IoAddCircle, IoMoon, 
  IoSunny, IoChevronForward, IoInformationCircle, IoSettingsOutline, IoTimeOutline 
} from "react-icons/io5";

// --- TYPES ---
interface QueueItem {
  name: string;
  durationDays: number;
}

interface Builder {
  id: number;
  building: string;
  level: number | null;
  finishDate: string | null; // ISO String
  progress: number;
  isLocked?: boolean;
  queue: QueueItem[];
}

// --- UTILS (Keep these here or move to timeHelpers.ts) ---
const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const h = hour % 12 || 12;
  return `${h} ${period}`;
};

const isOffline = (date: Date, start: number, end: number) => {
  const h = date.getHours();
  return start > end ? (h >= start || h < end) : (h >= start && h < end);
};

const calculateFutureFinish = (currentFinish: Date, days: number) => {
  return new Date(currentFinish.getTime() + days * 24 * 60 * 60 * 1000);
};

// --- MAIN COMPONENT ---
function UpdatePlanner() {
  const [offlineStart, setOfflineStart] = useState(23); // 11 PM
  const [offlineEnd, setOfflineEnd] = useState(7);    // 7 AM
  const [showSettings, setShowSettings] = useState(false);

  const [builders] = useState<Builder[]>([
    { id: 1, building: "X-Bow", level: 8, finishDate: "2026-03-08T14:30:00", progress: 75, queue: [{ name: "Archer Tower", durationDays: 5 }] },
    { id: 2, building: "Hidden Tesla", level: 11, finishDate: "2026-03-07T23:45:00", progress: 95, queue: [] },
    { id: 3, building: "Idle", level: null, finishDate: null, progress: 0, queue: [] },
    { id: 4, building: "Scattershot", level: 2, finishDate: "2026-03-12T04:00:00", progress: 30, queue: [] },
    { id: 5, building: "Barracks", level: 15, finishDate: "2026-03-09T12:00:00", progress: 55, queue: [] },
    { id: 6, building: "Locked", level: null, finishDate: null, progress: 0, isLocked: true, queue: [] },
  ]);

  return (
    <div className="p-6 text-white animate-in fade-in duration-500">
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Smart Planner</h2>
          <div className="flex items-center gap-3 mt-2">
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center gap-2 text-[10px] bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-full border border-indigo-500/30 font-black uppercase tracking-widest hover:bg-indigo-500/30 transition-all"
            >
              <IoMoon /> {formatHour(offlineStart)} — {formatHour(offlineEnd)} <IoSettingsOutline />
            </button>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/20">
          <IoAddCircle size={22} /> Plan Next Build
        </button>
      </header>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-8 p-6 bg-[#1D2E3E]/80 backdrop-blur-xl rounded-3xl border border-indigo-500/20 animate-in slide-in-from-top-4">
          <h3 className="text-sm font-bold text-indigo-300 mb-4 flex items-center gap-2">
            <IoTimeOutline /> Configure Your Daily Schedule
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">When do you go Offline?</label>
              <select 
                value={offlineStart} 
                onChange={(e) => setOfflineStart(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500"
              >
                {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{formatHour(i)}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">When are you back Online?</label>
              <select 
                value={offlineEnd} 
                onChange={(e) => setOfflineEnd(Number(e.target.value))}
                className="w-full bg-black/40 border border-white/10 p-3 rounded-xl outline-none focus:border-indigo-500"
              >
                {Array.from({length: 24}, (_, i) => <option key={i} value={i}>{formatHour(i)}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Builder Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {builders.map((builder) => (
          <BuilderCard 
            key={builder.id} 
            builder={builder} 
            schedule={{ start: offlineStart, end: offlineEnd }} 
          />
        ))}
      </div>
    </div>
  );
}

// --- SUB-COMPONENT ---
function BuilderCard({ builder, schedule }: { builder: Builder; schedule: { start: number, end: number } }) {
  if (builder.isLocked) return <LockedCard />;

  const isIdle = builder.building === "Idle";
  const finishDate = builder.finishDate ? new Date(builder.finishDate) : null;
  const finishesInDark = finishDate ? isOffline(finishDate, schedule.start, schedule.end) : false;

  return (
    <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${
      isIdle ? 'bg-green-500/5 border-green-500/20' : 'bg-[#1D2E3E]/60 border-white/10 hover:border-blue-500/20'
    }`}>
      
      {/* Header Info */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className={`p-4 rounded-2xl ${isIdle ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400 shadow-lg shadow-orange-950/20'}`}>
            <IoHammer size={28} />
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest leading-none mb-1">Builder #{builder.id}</p>
            <h4 className={`text-2xl font-black ${isIdle ? 'text-green-400' : 'text-white'}`}>{isIdle ? 'Available' : builder.building}</h4>
          </div>
        </div>

        {!isIdle && finishDate && (
          <div className={`flex flex-col items-end p-3 rounded-2xl border transition-colors ${
            finishesInDark ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-white/5 border-white/5 text-gray-400'
          }`}>
             <span className="text-[10px] font-black uppercase opacity-60">Finishes At</span>
             <span className="text-sm font-bold flex items-center gap-1.5">
                {finishesInDark ? <IoMoon size={14} /> : <IoSunny size={14} className="text-yellow-500" />}
                {finishDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
          </div>
        )}
      </div>

      {!isIdle ? (
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-[10px] font-black text-gray-500 uppercase px-1 tracking-widest">
              <span>Progress (Lvl {builder.level})</span>
              <span className={finishesInDark ? 'text-red-400' : 'text-blue-400'}>{builder.progress}%</span>
            </div>
            <div className="w-full bg-black/40 h-3 rounded-full overflow-hidden border border-white/5 p-0.5">
              <div 
                className={`h-full transition-all duration-1000 rounded-full ${finishesInDark ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.4)]' : 'bg-gradient-to-r from-orange-600 to-orange-400'}`} 
                style={{ width: `${builder.progress}%` }} 
              />
            </div>
          </div>

          {/* Efficiency Warning */}
          {finishesInDark && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl text-red-400">
              <IoInformationCircle size={24} className="shrink-0" />
              <p className="text-xs font-medium leading-snug">
                Warning: This upgrade finishes while you are offline. This builder will waste efficiency until <strong>{formatHour(schedule.end)}</strong>.
              </p>
            </div>
          )}

          {/* Planned Queue Section */}
          <div className="pt-4 border-t border-white/5">
            <p className="text-[10px] text-gray-500 font-black uppercase mb-3 tracking-widest">Next Assignment</p>
            
            {builder.queue.length > 0 ? (
              builder.queue.map((item, i) => {
                const futureFinish = finishDate ? calculateFutureFinish(finishDate, item.durationDays) : null;
                const nextInDark = futureFinish ? isOffline(futureFinish, schedule.start, schedule.end) : false;

                return (
                  <div key={i} className="flex items-center justify-between bg-blue-500/5 border border-blue-500/20 p-4 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 font-black text-xs italic shadow-inner">TH13</div>
                      <div>
                        <span className="font-bold text-sm block">{item.name}</span>
                        <span className={`text-[10px] font-medium flex items-center gap-1 ${nextInDark ? 'text-orange-400' : 'text-gray-500'}`}>
                          {nextInDark ? <IoMoon /> : <IoSunny />} 
                          Estimated Finish: {futureFinish?.toLocaleDateString()} at {futureFinish?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    <IoChevronForward className="text-gray-600" />
                  </div>
                );
              })
            ) : (
              <button className="w-full flex items-center gap-4 bg-black/20 p-4 rounded-2xl border border-dashed border-white/10 hover:border-blue-500/40 hover:bg-white/5 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition-colors">
                  <IoAddCircle size={24} />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-gray-400 group-hover:text-gray-200">Set Next Upgrade</p>
                  <p className="text-[10px] text-gray-600 font-medium italic">Builder starts immediately after current task</p>
                </div>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="py-12 flex flex-col items-center justify-center bg-green-500/5 border-2 border-dashed border-green-500/10 rounded-3xl">
          <p className="text-green-500/40 font-black uppercase text-[10px] mb-4 tracking-widest">Awaiting Command</p>
          <button className="bg-green-500 hover:bg-green-400 text-green-950 font-black px-10 py-3 rounded-2xl transition-all shadow-lg shadow-green-500/20 active:scale-95">
            Start New Build
          </button>
        </div>
      )}
    </div>
  );
}

function LockedCard() {
  return (
    <div className="bg-black/20 border-2 border-dashed border-white/5 p-8 rounded-[2rem] flex flex-col items-center justify-center opacity-30 grayscale cursor-not-allowed">
      <div className="w-16 h-16 rounded-3xl bg-gray-800 flex items-center justify-center mb-4">
        <IoHammer className="text-gray-600" size={32} />
      </div>
      <p className="text-gray-500 font-black text-xs uppercase tracking-widest mb-1">Slot #6 Locked</p>
      <p className="text-blue-500 font-bold text-xs underline decoration-dotted">Unlock B.O.B Base</p>
    </div>
  );
}

export default UpdatePlanner;