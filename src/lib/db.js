import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Veritabanına bağlandı ${conn.connection.host}`);
  } catch (error) {
    console.log("Error connecting o database", error);
    process.exit(1);
  }
};
