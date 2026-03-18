
import { Router } from 'express';
import { calculateProgress } from '../services/trackerService';
import BuildingData from '../models/BuildingData';
import User from '../models/User';
import Village from '../models/Village';
import { verifyToken } from '../middleware/authMiddleware';
import { getPlayerData } from '../services/cocService';

const router = Router();

// --- PUBLIC ROUTES ---

// @route   POST api/village/calculate-stats
router.post('/calculate-stats', async (req, res) => {
  try {
    const { buildings, townHallLevel } = req.body;
    const stats = await calculateProgress(buildings, townHallLevel);
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET api/village/id-map
router.get('/id-map', async (req, res) => {
  try {
    const buildings = await BuildingData.find({}, '_id name');
    const map: Record<number, string> = {};
    
    buildings.forEach(b => {
      map[b._id as number] = b.name as string;
    });

    res.json(map);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});


// --- PROTECTED ROUTES (Requires Login) ---

// @route   POST api/village/save
// @desc    Save or Update user village data
router.post('/save', verifyToken, async (req: any, res) => {
  const { rawData, townHallLevel } = req.body;
  const firebaseUid = req.user.uid;

  try {
    // 1. Get the MongoDB User ID using the Firebase UID
    const user = await User.findOne({ firebaseUid });
    if (!user) return res.status(404).json({ error: "User record not found in MongoDB" });

    let playerName = "Unknown Chief";
    try {
      const apiData = await getPlayerData(rawData.tag);
      playerName = apiData.name; // This will get "luffy2"
    } catch (apiErr) {
      console.warn("Could not fetch name from API, using fallback");
    }

    // 2. Save or Update the village data
    const savedVillage = await Village.findOneAndUpdate(
      { userId: user._id, "rawData.tag": rawData.tag },
      { 
        rawData, 
        townHallLevel, 
        name: playerName,
        updatedAt: new Date() 
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // FIX: Update User's village array in MongoDB Atlas
    await User.findByIdAndUpdate(user._id, {
      $addToSet: { villages: savedVillage._id }
    });

    res.status(200).json({ success: true, village: savedVillage });
  } catch (err: any) {
    console.error("Save error:", err);
    res.status(500).json({ error: "Server error while saving village" });
  }
});

// @route   GET api/village/my-villages
router.get('/my-villages', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    // FIX: Just find and return. DO NOT delete anything here!
    const villages = await Village.find({ userId: user._id });
    res.json(villages);
  } catch (err: any) {
    res.status(500).json({ error: "Server error while loading villages" });
  }
});

// @route   DELETE api/village/delete/:tag
router.delete('/delete/:tag', verifyToken, async (req: any, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) return res.status(404).json({ error: "User not found" });

    const village = await Village.findOneAndDelete({ 
      userId: user._id, 
      "rawData.tag": req.params.tag 
    });

    if (village) {
      await User.findByIdAndUpdate(user._id, { $pull: { villages: village._id } });
    }

    res.json({ success: true, message: "Village deleted successfully" });
  } catch (err: any) {
    res.status(500).json({ error: "Server error while deleting village" });
  }
});

export default router;