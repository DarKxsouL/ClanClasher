import { useState } from "react"
import { NavLink } from "react-router-dom";
import { IoMenu, IoHome, IoTimer, IoSettings  } from "react-icons/io5";
import { BsTools } from "react-icons/bs";
import { MdQueryStats } from "react-icons/md";
import { GiHeavyFall } from "react-icons/gi";

function Sidebar() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} h-screen 
                     bg-[#1D2E3E] backdrop-blur-sm 
                     sticky top-0 left-0 px-4 py-5
                     text-white overflow-hidden
                     transition-all duration-300 ease-in-out flex flex-col`}>
        
        {/* Menu Toggle Button */}
        <button 
          className="cursor-pointer hover:bg-white/10 p-2 rounded-lg w-fit transition-colors" 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
            <IoMenu color="white" size={30} />
        </button>

        <ul className="mt-10 flex flex-col gap-6 flex-1">
            {/* Top Section: Navigation Links */}
            <div className="flex flex-col gap-6 flex-1">
              <SidebarItem to="/" icon={<IoHome size={25} />} label="Home" isOpen={isSidebarOpen} />
              <SidebarItem to="/update-tracker" icon={<BsTools size={25} />} label="Update Tracker" isOpen={isSidebarOpen} />
              <SidebarItem to="/update-planner" icon={<IoTimer size={25} />} label="Update Planner" isOpen={isSidebarOpen} />
              <SidebarItem to="/damage-calculator" icon={<GiHeavyFall size={25} />} label="Damage Calculator" isOpen={isSidebarOpen} />
              <SidebarItem to="/player-stats" icon={<MdQueryStats size={25} />} label="Player Stats" isOpen={isSidebarOpen} />
            </div>

            {/* Bottom Section: Settings */}
            <div className="pt-5 border-t border-white/5">
              <SidebarItem to="/settings" icon={<IoSettings size={25} />} label="Settings" isOpen={isSidebarOpen} />
            </div>
        </ul>
    </div>
  )
}

// Helper component to keep the code clean
function SidebarItem({ to, icon, label, isOpen }: { to: string, icon: React.ReactNode, label: string, isOpen: boolean }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center gap-4 p-2 rounded-md transition-colors ${isActive ? 'bg-blue-500/20 text-blue-400' : 'hover:bg-white/5'}`
      }
    >
      <div className="min-w-[30px] flex justify-center">
        {icon}
      </div>
      
      {/* This span hides when isOpen is false. 
          'whitespace-nowrap' prevents the text from wrapping/glitching during the width transition.
      */}
      <span className={`transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'opacity-100 w-auto' : 'opacity-0 w-0'}`}>
        {label}
      </span>
    </NavLink>
  )
}

export default Sidebar