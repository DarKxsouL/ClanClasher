import React from 'react';

interface StatsProps {
  gold: number;
  elixir: number;
  time: string;
}

const StatsHeader: React.FC<StatsProps> = ({ gold, elixir, time }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <p className="text-yellow-100 text-xs font-bold uppercase">Gold Needed</p>
          <p className="text-2xl font-black text-white">{gold.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-purple-600 to-purple-500 p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <p className="text-purple-100 text-xs font-bold uppercase">Elixir Needed</p>
          <p className="text-2xl font-black text-white">{elixir.toLocaleString()}</p>
        </div>
      </div>
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 rounded-2xl shadow-lg flex justify-between items-center">
        <div>
          <p className="text-blue-100 text-xs font-bold uppercase">Time to Max</p>
          <p className="text-2xl font-black text-white">{time} Days</p>
        </div>
      </div>
    </div>
  );
};

export default StatsHeader;