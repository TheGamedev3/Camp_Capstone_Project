import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // ensures process.env is loaded

let connected = false;

export async function onConnect(): Promise<void> {
  if(connected)return; connected = true;
  
  let uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("ENV NOT CONFIGURED WITH A MONGO_DB URI!\nRun with 'npm run mini' to run the preview version instead");
  }

  const testMode = process.env.NODE_ENV === 'test';

  // Swap to test DB if in test mode
  uri = testMode
    ? uri.replace(/([^/]+)$/, '$1_test')
    : uri;

  try {
    await mongoose.connect(uri);
    console.log('✅ Mongoose DB Connected')
    if (!testMode) {
      // TO DO: Add seeding logic here if needed in future
      /*
      const { DB_Info } = await import('@Chemicals');
      const singleton = await DB_Info.fetchSingleton();
      if (singleton.seeded === false) {
        const { seedDatabase } = await import('@MongooseAPI');
        await seedDatabase();
        await DB_Info.modify({ seeded: true });
      }
      */
    }
  } catch (err) {
    console.error('Mongo connection failed:', err);
    throw err;
  }
}
