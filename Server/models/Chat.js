const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Chat = new Schema(
  {
    converstationId: {
      type: String,
    },
    sender: {
      type: String,
    },
    text: {
      type: String,
    },
    pictureChat: String,
    file: String,
  },
  { timestamps: true }
);
const Chats = mongoose.model('Chat', Chat);
module.exports = Chats;
