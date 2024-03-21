const Converstation = require('../models/Converstation.js');
const Chat = require('../models/Chat.js');
const path = require('path');

const postConverstation = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;
    console.log(req.body);
    const newConverstation = new Converstation({
      userIdChat: [senderId, receiverId],
    });
    const sendConverstation = await newConverstation.save();
    res.status(200).json(sendConverstation);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getConverstation = async (req, res) => {
  try {
    const { userId } = req.params;

    const searchConverstation = await Converstation.find({ userIdChat: { $in: [userId] } });
    res.status(200).json(searchConverstation);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Chat session

const postChat = async (req, res) => {
  try {
    const { converstationId, sender, text } = req.body;
    const pictureChat = req.file ? path.basename(req.file.path) : '';

    const newChat = new Chat({
      converstationId,
      sender,
      text,
      pictureChat,
    });
    const postChat = await newChat.save();
    // const postChat = await Chat.find();
    res.status(200).json(postChat);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const getChat = async (req, res) => {
  try {
    const { converstationId } = req.params;

    const getChat = await Chat.find({ converstationId });
    res.status(200).json(getChat);
  } catch (error) {
    res.status(500).json({ error });
  }
};
const deleteChatUser = async (req, res) => {
  try {
    const { converstationId } = req.params;

    await Chat.deleteMany({ converstationId });
    const allChatAfterDelete = await Chat.find();
    res.status(200).json(allChatAfterDelete);
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { deleteChatUser, getChat, postConverstation, getConverstation, postChat };
