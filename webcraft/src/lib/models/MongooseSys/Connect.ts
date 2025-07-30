import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../DB_Objects/User'

import { SeedData } from '../SeedData';
import { seedDummyPlayers } from './Seeder';

dotenv.config(); // ensures process.env is loaded

let connected = false;

export async function onConnect(): Promise<void> {
  if(connected)return; connected = true;
  
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("ENV NOT CONFIGURED WITH A MONGO_DB URI!\nRun with 'npm run mini' to run the preview version instead");
  }

  const testMode = process.env.TestMode === 'true';

  // Swap to test DB if in test mode
  uri = testMode
    ? uri.replace(/([^/]+)$/, '$1_test')
    : uri;

  try {
    await mongoose.connect(uri);
    console.log('✅ Mongoose DB Connected');

    const db = mongoose.connection.db;
    const collections = await db.collections();
    
    if (testMode) {
      // always re-initialize on test mode
      console.log('🧪 TestMode enabled → Clearing all collections');
      const collections = await db.collections();
      for (const collection of collections) {
        await collection.deleteMany({});
        console.log(`🧹 Cleared collection: ${collection.collectionName}`);
      }

      console.log('🌱 Seeding dummy test data...');
      await seedDummyPlayers(SeedData);
    }else if(!collections.map(c => c.collectionName).includes('users')){
      // this means the database hasn't been initialized yet
      // seed the test data in...
      await seedDummyPlayers(SeedData);
    }
  } catch (err) {
    console.error('Mongo connection failed:', err);
    throw err;
  }
}
