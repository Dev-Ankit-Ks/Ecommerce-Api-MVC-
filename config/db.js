import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
dotenv.config();
const connectDB = mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(`> Server connected to MongoDB...`.bgGreen.white.bold);
  })
  .catch(() => console.log(`Server is not connected to MongoDB...`));

export default { connectDB };
