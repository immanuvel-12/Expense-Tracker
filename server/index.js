import "dotenv/config";
import mongoose from "mongoose";
import { createApp } from "./app.js";

const { MONGODB_URI, PORT = 4000 } = process.env;
if (!MONGODB_URI) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

await mongoose.connect(MONGODB_URI);
console.log("Connected to MongoDB");
createApp().listen(PORT, () => console.log(`Expensio API listening on ${PORT}`));
