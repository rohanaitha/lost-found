import Chat from "../model/Chat.js";
import mongoose from "mongoose";

// Create or get chat room between 2 users
export const createOrGetChat = async (req, res) => {
  const { userId1, userId2 } = req.body;

  try {
    let chat = await Chat.findOne({
      members: { $all: [userId1, userId2] },
    });

    if (!chat) {
      chat = new Chat({ members: [userId1, userId2] });
      await chat.save();
    }

    res.json({ roomId: chat._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all messages in a room
export const getMessages = async (req, res) => {
  try {
    const chat = await Chat.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(req.params.roomId),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "members",
          foreignField: "userId",
          as: "memberDetails",
        },
      },
    ]);

    if (chat.length === 0) {
      return res.status(404).json({ error: "Chat not found" });
    }

    res.json({
      messages: chat[0].messages,
      members: chat[0].memberDetails,
      roomId: chat[0]._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add a new message to a room
export const addMessage = async (req, res) => {
  const { sender, text } = req.body;

  try {
    const chat = await Chat.findById(req.params.roomId);
    if (!chat) {
      return res.status(404).json({ error: "Chat room not found" });
    }

    const newMessage = {
      sender,
      text,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    // Send the saved message back in response
    res.json(newMessage);
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getInbox = async (req, res) => {
  try {
    const userId = req.user.id;

    const conversations = await Chat.aggregate([
      {
        $match: {
          members: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "members",
          foreignField: "userId",
          as: "memberDetails",
        },
      },
    ]);

    res.json(conversations);
  } catch (err) {
    console.error("Error sending room:", err);
    res.status(500).json({ error: err.message });
  }
};
