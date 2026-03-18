import { useEffect, useState } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import axios from 'axios';
import { AuthProvider, useAuth } from './context/AuthContext';
import "./App.css";

// Pages
import Auth from './pages/Auth';
import Home from "./pages/Home";
import UpdateTracker from "./pages/UpdateTracker";
import UpdatePlanner from "./pages/UpdatePlanner";
import PlayerStats from "./pages/PlayerStats";
import DamageCalculator from "./pages/DamageCalculator";

// Components
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";

// Services & Types
import { processVillageData } from "./services/villageService";
import type { Village } from "./types/coc";

const API_BASE = "http://localhost:5000/api";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentRawData, setCurrentRawData] = useState<any>(null);
  const [villages, setVillages] = useState<Village[]>([]);
  const [activeVillage, setActiveVillage] = useState<Village | null>(null);
  const [globalStats, setGlobalStats] = useState<any>(null);
  const [idNameMap, setIdNameMap] = useState<Record<number, string>>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [refreshTick, setRefreshTick] = useState(0);
  const [perks, setPerks] = useState({ builder: 0, lab: 0 });
  const [isAddingNew, setIsAddingNew] = useState(false);


  // 1. Fetch ID Map from MongoDB
  useEffect(() => {
    axios.get(`${API_BASE}/village/id-map`)
      .then(res => setIdNameMap(res.data))
      .catch(err => console.error("Could not fetch ID Map", err));
  }, []);


  // 2. LIVE CLOCK: Increment tick every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setRefreshTick(prev => prev + 1);
    }, 60000); 

    return () => clearInterval(timer);
  }, []);

  // 3. UI Sync: Re-map data whenever rawData, the map, or the clock tick changes
  useEffect(() => {
    if (currentRawData && Object.keys(idNameMap).length > 0) {
      console.log("⏰ Updating UI timers...");
      const mapped = processVillageData(currentRawData, idNameMap);
      setActiveVillage(mapped);
    }
  }, [currentRawData, idNameMap, refreshTick]);


  // // 2. Auto-load saved village on login
  useEffect(() => {
    if (user && Object.keys(idNameMap).length > 0) {
      fetchUserVillages();
    }
  }, [user, idNameMap]);

  // const fetchUserVillages = async () => {
  //   try {
  //     const token = await user?.getIdToken();
  //     const res = await axios.get(`${API_BASE}/village/my-villages`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     const processed = res.data.map((v: any) => processVillageData(v.rawData, idNameMap));
  //     setVillages(processed);
  //     if (processed.length > 0 && !activeVillage) {
  //       handleSwitchVillage(processed[0], res.data[0].rawData);
  //     }
  //   } catch (err) { console.error("Load error", err); }
  // };
  const fetchUserVillages = async (shouldSelectNewest = false) => {
    try {
      const token = await user?.getIdToken();
      const res = await axios.get(`${API_BASE}/village/my-villages`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const processed = res.data.map((v: any) => processVillageData(v.rawData, idNameMap, v.name));
      setVillages(processed);

      // Auto-switch to the first village ONLY if we aren't currently adding one
      // if (processed.length > 0 && !activeVillage && !isAddingNew) {
      //   handleSwitchVillage(processed[0], res.data[0].rawData);
      // } 
      
      if (shouldSelectNewest && processed.length > 0) {
        const newestIndex = processed.length - 1;   //processed ~ res.data
        handleSwitchVillage(processed[newestIndex], res.data[newestIndex].rawData);
        setIsAddingNew(false);
      } else if (processed.length > 0 && !activeVillage && !isAddingNew) {
        handleSwitchVillage(processed[0], res.data[0].rawData);
      }
    } catch (err) { console.error("Load error", err); }
  };

  const handleImportData = async (jsonInput: string) => {
    try {
      const rawData = JSON.parse(jsonInput);
      setCurrentRawData(rawData);
      
      // Temporary "Loading" name until DB responds
      const mapped = processVillageData(rawData, idNameMap, "Loading Name...");
      setActiveVillage(mapped);
      
      await fetchStats(rawData, mapped.townHallLevel);
      
      if (user) {
        await saveToCloud(rawData, mapped.townHallLevel);
        // Refresh the list from DB and select the one we just saved
        await fetchUserVillages(true); 
      }
    } catch (err) { 
      console.error("Import Error", err);
      setIsAddingNew(false); 
    }
  };

  const handleDeleteVillage = async () => {
    if (!user || !activeVillage) return;
    try {
      const token = await user.getIdToken();
      // Pass the specific tag to delete
      await axios.delete(`${API_BASE}/village/delete/${activeVillage.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      handleSwitchVillage(null);
      await fetchUserVillages();
    } catch (err) { console.error("Delete failed", err); }
  };

  const fetchStats = async (rawData: any, th: number) => {
    const payload = {
      buildings: [
        ...rawData.buildings,
        ...(rawData.traps || []),
        ...(rawData.heroes || []),
        ...(rawData.units || []),
        ...(rawData.spells || []),
        ...(rawData.pets || [])
      ],
      townHallLevel: th,
      boostPercentage: perks.builder // Pass Gold Pass perk to backend
    };
    const res = await axios.post(`${API_BASE}/village/calculate-stats`, payload);
    setGlobalStats(res.data);
  };

  const handleSwitchVillage = (v: Village | null, raw?: any) => {
    if (v === null) {
      setIsAddingNew(true); // Lock the UI to "Add New" state
      setActiveVillage(null);
      setGlobalStats(null);
      setCurrentRawData(null);
    } else {
      setIsAddingNew(false);
      setActiveVillage(v);
      if (raw) {
        setCurrentRawData(raw);
        fetchStats(raw, v.townHallLevel);
      }
    }
  };


  // const handleImportData = async (jsonInput: string) => {
  //   try {
  //     const rawData = JSON.parse(jsonInput);
  //     // Immediately set raw data to stop the "No Data" screen flickering
  //     setCurrentRawData(rawData);
      
  //     const mapped = processVillageData(rawData, idNameMap);
  //     setActiveVillage(mapped);
      
  //     await fetchStats(rawData, mapped.townHallLevel);
      
  //     if (user) {
  //       await saveToCloud(rawData, mapped.townHallLevel);
  //       // Refresh list and force selection of the one we just imported
  //       await fetchUserVillages(true); 
  //     }
  //   } catch (err) { 
  //     console.error("Import Error", err);
  //     setIsAddingNew(false); 
  //   }
  // };

  const saveToCloud = async (rawData: any, th: number) => {
    if (!user) return;
    
    setIsSyncing(true);
    try {
      const token = await user?.getIdToken();
      await axios.post(`${API_BASE}/village/save`, 
        { rawData, townHallLevel: th },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log("☁️ Data synced to MongoDB");
    } catch (err) {
      console.error("Cloud sync failed", err);
    } finally {
      setIsSyncing(false);
    }
  };

  // NEW: Handle Village Deletion
  // const handleDeleteVillage = async () => {
  //   if (!user) return;
  //   try {
  //     const token = await user.getIdToken();
  //     await axios.delete(`${API_BASE}/village/delete`, {
  //       headers: { Authorization: `Bearer ${token}` }
  //     });
  //     // Reset local state
  //     // setActiveVillage(null);
  //     // setCurrentRawData(null);
  //     // setGlobalStats(null);
  //     handleSwitchVillage(null);
  //     fetchUserVillages();
  //   } catch (err) { console.error("Delete failed", err); }
  // };

  if (loading) return <div className="h-screen w-full bg-[#0B151E] flex items-center justify-center text-white">Loading...</div>;

  return (
    <div className="w-full h-screen flex relative overflow-hidden text-white font-sans">
      <img className="fixed top-0 left-0 w-full h-full object-cover -z-10" src="/coc_bg_small.png" alt="bg" />
      
      {user && <Sidebar />}

      <div className="flex flex-col flex-1 h-screen overflow-hidden">
        {user && 
          <Navbar 
            activeVillage={activeVillage} 
            villages={villages} 
            onSwitch={handleSwitchVillage} 
            isSyncing={isSyncing}
          />
  }

        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <Routes>
            <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
            <Route path="/" element={user ? 
              <Home 
                activeVillage={activeVillage} 
                stats={globalStats} 
                perks={perks}
                setPerks={setPerks}
                onImportData={handleImportData} 
                onDeleteVillage={handleDeleteVillage} 
              />
              :  <Navigate to="/login" />
            } />
            <Route path="/update-tracker" element={user ? <UpdateTracker village={activeVillage} stats={globalStats} /> : <Navigate to="/login" />} />
            <Route path="/update-planner" element={user ? <UpdatePlanner village={activeVillage} /> : <Navigate to="/login" />} />
            <Route path="/damage-calculator" element={user ? <DamageCalculator /> : <Navigate to="/login" />} />
            <Route path="/player-stats" element={user ? <PlayerStats village={activeVillage} /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// No <Router> here because it's in main.tsx
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;