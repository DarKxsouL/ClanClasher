// import mongoose from 'mongoose';
// import BuildingData from './models/BuildingData';
// import fs from 'fs';
// import path from 'path';
// import dotenv from 'dotenv';

// dotenv.config();

// const seedDatabase = async () => {
//   try {
//     console.log("Connecting to MongoDB...");
//     await mongoose.connect(process.env.MONGO_URI!);
//     const filePath = path.join(__dirname, './data/static_data.json');
//     const fileContent = fs.readFileSync(filePath, 'utf-8');
//     const rawData = JSON.parse(fileContent);
    
//     // Clear old data to prevent duplicates
//     await BuildingData.deleteMany({});

//     const formattedBuildings = rawData.buildings.map((b: any) => ({
//       ...b,
//       _id: b._id || b.id // Force the ID into the _id field
//     }));
    
//     // Insert new data
//     await BuildingData.insertMany(formattedBuildings);
    
    
//     console.log(`✅ Success! Seeded ${formattedBuildings.length} buildings to MongoDB.`);
//     process.exit();
//   } catch (err) {
//     console.error("❌ Seeding Failed:", err);
//     process.exit(1);
//   }
// };

// seedDatabase();


import mongoose from 'mongoose';
import BuildingData from './models/BuildingData'; // Consider renaming this to GameData later
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI!);
    
    const filePath = path.join(__dirname, './data/static_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rawData = JSON.parse(fileContent);
    
    await BuildingData.deleteMany({});

    // Define all categories to import
    const categories = [
      'buildings', 'traps', 'troops', 'spells', 
      'heroes', 'pets', 'equipment', 'helpers'
    ];

    let totalSeeded = 0;

    for (const category of categories) {
      if (!rawData[category]) continue;

      const formattedData = rawData[category].map((item: any) => ({
        ...item,
        _id: item._id || item.id,
        category: category // Optional: help filter later if needed
      }));

      await BuildingData.insertMany(formattedData);
      console.log(`- Seeded ${formattedData.length} items from ${category}`);
      totalSeeded += formattedData.length;
    }
    
    console.log(`✅ Success! Seeded ${totalSeeded} total items to MongoDB.`);
    process.exit();
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
};

seedDatabase();