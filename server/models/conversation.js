// models/Conversation.js
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Each conversation includes 2 (or more) user IDs
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt
);

module.exports = mongoose.model("Conversation", conversationSchema);


