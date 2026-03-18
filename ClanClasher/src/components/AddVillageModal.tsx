// Components/AddVillageModal.tsx
const AddVillageModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1D2E3E] w-full max-w-md rounded-3xl border border-white/10 p-8 shadow-2xl animate-in zoom-in duration-300">
        <h3 className="text-2xl font-bold mb-2">Link New Village</h3>
        <p className="text-gray-400 text-sm mb-6">Enter your Clash of Clans Player Tag to import your stats.</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Player Tag</label>
            <input 
              type="text" 
              placeholder="#P8RRV90U" 
              className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-all font-mono"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 font-bold transition-all">Cancel</button>
            <button className="flex-1 px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold shadow-lg shadow-blue-900/40 transition-all">Import Village</button>
          </div>
        </div>
      </div>
    </div>
  );
};