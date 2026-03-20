import mongoose from 'mongoose';
import {
  BuildingModel,
  TrapModel,
  TroopModel,
  GuardianModel,
  SpellModel,
  HeroModel,
  PetModel,
  EquipmentModel,
  HelperModel,
} from './models/gamedata';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI!);

    const filePath = path.join(__dirname, './static_data.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const rawData = JSON.parse(fileContent);

    // Define collections mapping
    const collectionsConfig: Array<{
      name: string;
      model: any;
      key: string;
    }> = [
      { name: 'buildings', model: BuildingModel, key: 'buildings' },
      { name: 'traps', model: TrapModel, key: 'traps' },
      { name: 'troops', model: TroopModel, key: 'troops' },
      { name: 'guardians', model: GuardianModel, key: 'guardians' },
      { name: 'spells', model: SpellModel, key: 'spells' },
      { name: 'heroes', model: HeroModel, key: 'heroes' },
      { name: 'pets', model: PetModel, key: 'pets' },
      { name: 'equipment', model: EquipmentModel, key: 'equipment' },
      { name: 'helpers', model: HelperModel, key: 'helpers' },
    ];

    let totalSeeded = 0;

    // Seed each collection separately
    for (const collection of collectionsConfig) {
      try {
        // Clear existing data
        await (collection.model as any).deleteMany({});

        if (!rawData[collection.key] || rawData[collection.key].length === 0) {
          console.log(`⚠️  No data found for ${collection.name}`);
          continue;
        }

        // Insert data
        const result = await (collection.model as any).insertMany(
          rawData[collection.key]
        );
        console.log(
          `✅ Seeded ${result.length} items into ${collection.name} collection`
        );
        totalSeeded += result.length;
      } catch (err) {
        console.error(`❌ Error seeding ${collection.name} collection:`, err);
      }
    }

    console.log(`\n✅ Success! Seeded ${totalSeeded} total items to MongoDB.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding Failed:", err);
    process.exit(1);
  }
};

seedDatabase();