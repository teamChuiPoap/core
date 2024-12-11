import { connect } from "mongoose";
import "dotenv/config";

const MONGO_URI = process.env.MONGO_URI as string;

export const connectDB = async () => {
  console.log(`- - -`.repeat(10));
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      keepAlive: true,
      connectTimeoutMS: 600000,
      socketTimeoutMS: 600000,
    };
    const db = await connect(
      "mongodb+srv://bethnjoroge985:A21jalnM5onhcXxy@cluster0.ds1lq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
      options
    );
    console.log("Connected to MongoDb :) ✅✅✅");
    console.log(`- - -`.repeat(10));
    return db;
  } catch (err: any) {
    console.error(err.message);
    process.exit(1);
  }
};
