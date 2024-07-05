import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import ChatMessage from "./models/ChatMessage.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGODB_URI);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI);

app.get("/messages", async (req, res) => {
  try {
    const messages = await ChatMessage.find();
    res.json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/messages", async (req, res) => {
  try {
    const { user, message } = req.body;

    if (!user || !message) {
      return res.status(400).json({ error: "User and message are required" });
    }

    const chatMessage = new ChatMessage({
      user,
      message
    });

    await chatMessage.save();

    res.status(201).json(chatMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
