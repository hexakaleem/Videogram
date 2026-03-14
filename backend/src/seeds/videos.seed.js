import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
})


console.log("MONGO:::::::::::::", process.env.MONGO_URI)



// USER IDS
const USERS = {
  agentfox: "6971699000c74022dc4de3a7",
  fhk: "697261d9341d2072929acbcc",
  ahmad: "6972a1a288d447952e735656",
  alitareen: "6972a1c388d447952e73565a",
  salar: "6972a1e088d447952e73565e",
  kaleem: "6972a1f588d447952e735662",
  sohail: "6972a21688d447952e735666"
};

const seedVideos = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
    console.log("MongoDB connected");


    /* ---------------- AGENTFOX VIDEOS ---------------- */

    const agentFoxVideos = await Video.insertMany([
      {
        videoFile: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        thumbnail: "https://images.pexels.com/photos/414171/pexels-photo-414171.jpeg",
        title: "Mastering JavaScript Closures",
        description: "Deep dive into closures with real examples.",
        duration: 620,
        views: 3,
        owner: USERS.agentfox
      },
      {
        videoFile: "https://www.youtube.com/watch?v=PkZNo7MFNFg",
        thumbnail: "https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg",
        title: "Node.js Event Loop Explained",
        description: "Understand how Node.js works internally.",
        duration: 840,
        views: 5,
        owner: USERS.agentfox
      },
      {
        videoFile: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        thumbnail: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg",
        title: "MongoDB Aggregation Pipeline",
        description: "Learn aggregation with real backend examples.",
        duration: 760,
        views: 2,
        owner: USERS.agentfox
      }
    ]);

    /* ---------------- SOHAIL VIDEO ---------------- */

    const [sohailVideo] = await Video.insertMany([
      {
        videoFile: "https://www.youtube.com/watch?v=3PHXvlpOkf4",
        thumbnail: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
        title: "Express.js Crash Course",
        description: "Build REST APIs using Express.js.",
        duration: 540,
        views: 3,
        owner: USERS.sohail
      }
    ]);

    /* ---------------- WATCH HISTORY ---------------- */
    // Agentfox videos watched by others
    await User.updateMany(
      { _id: { $in: [USERS.fhk, USERS.ahmad, USERS.alitareen] } },
      { $push: { watchHistory: agentFoxVideos[0]._id } }
    );

    await User.updateMany(
      { _id: { $in: [USERS.salar, USERS.kaleem, USERS.fhk, USERS.ahmad, USERS.alitareen] } },
      { $push: { watchHistory: agentFoxVideos[1]._id } }
    );

    await User.updateMany(
      { _id: { $in: [USERS.salar, USERS.kaleem] } },
      { $push: { watchHistory: agentFoxVideos[2]._id } }
    );

    // Sohail video watched by 3 users
    await User.updateMany(
      { _id: { $in: [USERS.agentfox, USERS.fhk, USERS.ahmad] } },
      { $push: { watchHistory: sohailVideo._id } }
    );

    console.log("Videos seeded successfully");
    process.exit(0);

  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedVideos();
