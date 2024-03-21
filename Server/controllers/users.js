const User = require('../models/User.js');

// Read From database
const Alluser = async (req, res) => {
  try {
    const { firstName } = req.query;
    let query = {};

    if (firstName) {
      query.firstName = { $regex: `${firstName}`, $options: 'i' };
    }
    const users = await User.find(query);
    if (!users) console.log('Ga ada di databaase');
    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, location, occupation, description, gmail, github, linkedin, instagram, id } = req.body;
    const newUpdateData = {
      firstName,
      lastName,
      location,
      occupation,
      description,
      gmail,
      github,
      instagram,
      linkedin,
    };

    if (req.file) {
      newUpdateData.picturePath = req.file.filename;
    }

    const newUpdate = await User.findByIdAndUpdate(id, newUpdateData, { new: true });

    console.log(newUpdate);
    if (!newUpdate) {
      console.log('User not found in database');
    }

    res.status(200).json(newUpdate);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) console.log('Ga ada di databaase');
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

const getUserFriends = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });

    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

// Update ke database dari lsit friends
const addRemoveFriend = async (req, res) => {
  try {
    const { id, friendId } = req.params;
    const user = await User.findById(id);
    const friend = await User.findById(friendId);

    // Membuat logika jika sudah ada friendId di arraynya friends user maka kita hapus dia agar tidak tampil suggest user yang mau ditemani
    if (user.friends.includes(friendId)) {
      user.friends = user.friends.filter((id) => id !== friendId);
      friend.friends = friend.friends.filter((id) => id !== id);
    } else {
      // Menambahkan ke ke dua user id masing masing yang bermakana bahwa mereka sudah saling berteman
      user.friends.push(friendId);
      friend.friends.push(id);
    }
    await user.save();
    await friend.save();

    // melakukan formated user
    const friends = await Promise.all(user.friends.map((id) => User.findById(id)));
    const formattedFriends = friends.map(({ _id, firstName, lastName, occupation, location, picturePath }) => {
      return { _id, firstName, lastName, occupation, location, picturePath };
    });
    res.status(200).json(formattedFriends);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

module.exports = { Alluser, updateUser, getUser, getUserFriends, addRemoveFriend };
