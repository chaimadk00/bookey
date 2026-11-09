import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function run() {
  try {
    console.log("Connecting to:", process.env.MONGODB_URI ? "URI found" : "NO URI");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB Atlas!");
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log("Collections:", collections.map(c => c.name));
    
    const users = await db.collection("users").find({}).toArray();
    console.log("Users in DB count:", users.length);
    console.log("Users:", users.map(u => ({ id: u._id, name: u.name, email: u.email, createdAt: u.createdAt })));
    
    const products = await db.collection("products").find({}).toArray();
    console.log("Products in DB count:", products.length);
  } catch (err) {
    console.error("Error connecting/querying DB:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

run();
