// db/mongodb.js
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://hdmen55:55n1pDQ8K7GAn2T5@testdatabase.yva1f6o.mongodb.net/?retryWrites=true&w=majority";
console.log("Connecting to MongoDB...");

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbName = 'medchain';

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB.");

    const db = client.db(dbName);
    await initializeCollections(db);

  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

async function initializeCollections(db) {
  const collections = ['users', 'patients', 'datasets'];
  const existingCollections = await db.listCollections().toArray();
  const existingCollectionNames = existingCollections.map(c => c.name);

  for (let collectionName of collections) {
    if (!existingCollectionNames.includes(collectionName)) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
  }
}

module.exports = {
  client,
  connectToDatabase,
};

connectToDatabase().catch(console.error);
