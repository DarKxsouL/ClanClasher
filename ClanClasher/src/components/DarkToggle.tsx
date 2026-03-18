import { useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

function DarkToggle() {
    const [isDarkMode, setIsDarkMode] = useState(true)
  return (
    <>
        <button 
            className={`relative w-20 h-8 cursor-pointer rounded-full border border-blue-200/70`}
            onClick={() => setIsDarkMode(!isDarkMode)}>
            <div className={`w-8 h-8 rounded-full border border-blue-200/70
                            absolute top-1/2 -translate-y-1/2
                            ${isDarkMode ? 'left-0 bg-[#1D2E3E]' : 'left-3/5 bg-white'} 
                            transition-all duration-300 ease-in-out`}>
                {
                    isDarkMode ?
                    <IoMoon color="white" size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    :
                    <IoSunny color="black" size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                }
            </div>
        </button>
    </>
  )
}

export default DarkToggle