import React, { useState } from 'react';
import { IoChevronDown, IoLogOutOutline, IoCloudDoneOutline, IoSyncOutline, IoAddCircleOutline } from "react-icons/io5";
import { auth } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { type Village } from '../types/coc.ts';

interface NavbarProps {
  activeVillage: Village | null;
  villages?: Village[];
  onSwitch: (v: Village | null) => void;
  isSyncing?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ activeVillage, villages = [], onSwitch, isSyncing }) => {
  const { user } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  // Determine the status label based on the state of the app
  const getStatusLabel = () => {
    if (activeVillage) return "Active Village";
    if (villages.length > 0) return "Select Village";
    return "New Connection";
  };

  // Determine the village name or fallback text
  const getVillageName = () => {
    if (activeVillage) return activeVillage.name;
    return "Link Base";
  };

  return (
    <nav className="w-full h-20 bg-[#1D2E3E]/50 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-50 border-b border-white/5">
      <div className="flex items-center gap-8">
        <h1 className="text-2xl font-black tracking-tighter text-blue-500 uppercase">Clan Clasher</h1>
        
        {/* Village Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl border border-white/10 transition-all min-w-[160px]"
          >
            <div className="text-left">
              <p className="text-[10px] text-gray-500 uppercase font-bold leading-none">
                {getStatusLabel()}
              </p>
              <p className="text-sm font-semibold">
                {getVillageName()}
              </p>
            </div>
            <IoChevronDown className={`transition-transform ml-auto ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-full mt-2 w-64 bg-[#1D2E3E] border border-white/10 rounded-2xl shadow-2xl p-2 animate-in fade-in zoom-in duration-200">
              <div className="px-4 py-2 border-b border-white/5 mb-1">
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Your Villages</p>
              </div>
              
              <div className="max-h-60 overflow-y-auto scrollbar-hide">
                {villages.length > 0 ? (
                  villages.map((v) => (
                    <button 
                      key={v.id} 
                      onClick={() => {
                        onSwitch(v);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors mb-1 ${
                        activeVillage?.id === v.id 
                          ? 'bg-blue-600/20 border border-blue-500/20' 
                          : 'hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <div>
                        <p className={`text-sm font-bold ${activeVillage?.id === v.id ? 'text-blue-400' : 'text-gray-200'}`}>
                          {v.name}
                        </p>
                        <p className="text-[10px] text-gray-500">TH{v.townHallLevel} • {v.id}</p>
                      </div>
                      {activeVillage?.id === v.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_#3b82f6]" />
                      )}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center">
                    <p className="text-xs text-gray-500 italic mb-1">No villages found.</p>
                    <p className="text-[10px] text-gray-600">Export your base to start tracking.</p>
                  </div>
                )}
              </div>

              <div className="mt-1 pt-1 border-t border-white/5">
                <button 
                  onClick={() => {
                    onSwitch(null); // Triggers "Add New" state in App.tsx
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-blue-400 hover:bg-blue-400/10 rounded-xl transition-colors text-xs font-bold"
                >
                  <IoAddCircleOutline size={18} /> Add New Village
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Sync Status Indicator */}
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-opacity duration-300">
          {isSyncing ? (
            <span className="flex items-center gap-2 text-orange-400 animate-pulse">
              <IoSyncOutline className="animate-spin" size={16} /> Saving...
            </span>
          ) : (
            <span className="flex items-center gap-2 text-green-500/60">
              <IoCloudDoneOutline size={16} /> Synced
            </span>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className="flex items-center gap-3 bg-black/20 pl-4 pr-2 py-1.5 rounded-full border border-white/5">
          <div className="flex flex-col items-end mr-1">
            <span className="text-[10px] text-gray-500 font-bold uppercase leading-none">Chief</span>
            <span className="text-sm font-medium text-gray-200 max-w-[100px] truncate">
              {user?.displayName || user?.email?.split('@')[0]}
            </span>
          </div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center text-xs font-black ring-2 ring-white/5 shadow-lg">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-all active:scale-90"
            title="Sign Out"
          >
            <IoLogOutOutline size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;