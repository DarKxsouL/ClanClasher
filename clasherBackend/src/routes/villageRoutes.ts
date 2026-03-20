import { Router } from 'express';
import mongoose from 'mongoose';
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

// Helper to get a single collection's _id->name map
const getDb = () => {
  const db = mongoose.connection.db;
  if (!db) throw new Error('MongoDB connection is not ready');
  return db;
};

const getIdNamePairs = async (collectionName: string) => {
  const db = getDb();
  const docs = await db
    .collection(collectionName)
    .find({}, { projection: { _id: 1, name: 1 } })
    .toArray();
  return docs as Array<{ _id: any; name: string }>;
};

// @route   GET api/village/id-map
router.get('/id-map', async (req, res) => {
  try {
    const collections = ['buildings', 'traps', 'troops', 'guardians', 'spells', 'heroes', 'pets', 'equipment', 'helpers'];
    const map: Record<string, string> = {};

    for (const collectionName of collections) {
      const docs = await getIdNamePairs(collectionName);
      docs.forEach((doc) => {
        if (doc && doc._id != null) {
          map[String(doc._id)] = doc.name;
        }
      });
    }

    res.json(map);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// @route   GET api/village/game-data
router.get('/game-data', async (req, res) => {
  try {
    const db = getDb();
    const collections = ['buildings', 'traps', 'troops', 'guardians', 'spells', 'heroes', 'pets', 'equipment', 'helpers'];

    const results = await Promise.all(
      collections.map((name) => db.collection(name).find({}).toArray())
    );

    const [buildings, traps, troops, guardians, spells, heroes, pets, equipment, helpers] = results;

    res.json({
      buildings,
      traps,
      troops,
      guardians,
      spells,
      heroes,
      pets,
      equipment,
      helpers,
    });
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

    // 2. Check for existing village with the same tag
    const existingVillage = await Village.findOne({ userId: user._id, "rawData.tag": rawData.tag });

    if (existingVillage) {
      // Check timestamp: only update if new data is newer
      if (rawData.timestamp > existingVillage.rawData.timestamp) {
        existingVillage.rawData = rawData;
        existingVillage.townHallLevel = townHallLevel;
        existingVillage.name = playerName;
        existingVillage.updatedAt = new Date();
        await existingVillage.save();
        res.status(200).json({ success: true, village: existingVillage, message: 'Village updated with newer data' });
      } else {
        res.status(200).json({ success: false, message: 'Data is not newer than existing village' });
      }
    } else {
      // Create new village
      const newVillage = new Village({
        userId: user._id,
        rawData,
        townHallLevel,
        name: playerName
      });
      const savedVillage = await newVillage.save();

      // Update User's village array
      await User.findByIdAndUpdate(user._id, {
        $addToSet: { villages: savedVillage._id }
      });

      res.status(200).json({ success: true, village: savedVillage, message: 'New village added' });
    }
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

    // Decode the tag in case it's URL encoded (to handle '#' characters)
    const tag = decodeURIComponent(req.params.tag);
    
    const village = await Village.findOneAndDelete({ 
      userId: user._id, 
      "rawData.tag": tag 
    });

    if (village) {
      await User.findByIdAndUpdate(user._id, { $pull: { villages: village._id } });
      res.json({ success: true, message: "Village deleted successfully" });
    } else {
      res.status(404).json({ error: "Village not found" });
    }
  } catch (err: any) {
    res.status(500).json({ error: "Server error while deleting village" });
  }
});

export default router;