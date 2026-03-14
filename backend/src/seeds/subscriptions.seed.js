import dotenv from 'dotenv'
import mongoose from "mongoose"

import { Subscription } from "../models/subscription.model.js"
import { DB_NAME } from '../constants.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({
  path: path.resolve(__dirname, '../../../.env')
})
console.log("MONGO:::::::::::::", process.env.MONGO_URI)

// 🔗 USER IDS
const USERS = {
  agentfox: "6971699000c74022dc4de3a7",
  fhk: "697261d9341d2072929acbcc",
  ahmad: "6972a1a288d447952e735656",
  alitareen: "6972a1c388d447952e73565a",
  salar: "6972a1e088d447952e73565e",
  kaleem: "6972a1f588d447952e735662",
  sohail: "6972a21688d447952e735666"
}

const seedSubscriptions = async () => {
  try {

    await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
    console.log("✅ MongoDB connected for seeding")

    const subscriptions = []

    //Everyone subscribes to agentfox
    Object.values(USERS).forEach(userId => {
      if (userId !== USERS.agentfox) {
        subscriptions.push({
          subscriber: userId,
          channel: USERS.agentfox
        })
      }
    })

    //Two users subscribe to sohail
    subscriptions.push(
      { subscriber: USERS.fhk, channel: USERS.sohail },
      { subscriber: USERS.ahmad, channel: USERS.sohail }
    )

    // Insert safely (unique index prevents duplicates)
    await Subscription.insertMany(subscriptions, { ordered: false })

    console.log("Subscriptions seeded successfully")
    process.exit(0)

  } catch (error) {
    console.error("Error seeding subscriptions:", error.message)
    process.exit(1)
  }
}

seedSubscriptions()
