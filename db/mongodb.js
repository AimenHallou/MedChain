// db/mongodb.js
import mongoose from "mongoose";

global.mongoose = {
  conn: null,
  promise: null,
};

export async function dbConnect() {
  if (global.mongoose && global.mongoose.conn) {
    console.log("Using existing connection");
    return global.mongoose.conn;
  } else {
    const conString =
      "mongodb+srv://hdmen55:55n1pDQ8K7GAn2T5@testdatabase.yva1f6o.mongodb.net/?retryWrites=true&w=majority";
    const promise = mongoose.connect(conString, {
      dbName: "medchain",
    });

    global.mongoose = {
      conn: mongoose.connection,
      promise,
    };
    console.log("Connected to MongoDB");
    return await promise;
  }
}

async function initializeCollections(db) {
  const collections = ["users", "patients", "datasets"];
  const existingCollections = await db.listCollections().toArray();
  const existingCollectionNames = existingCollections.map((c) => c.name);

  for (let collectionName of collections) {
    if (!existingCollectionNames.includes(collectionName)) {
      await db.createCollection(collectionName);
      console.log(`Created collection: ${collectionName}`);
    }
  }
}
