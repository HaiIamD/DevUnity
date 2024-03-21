const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const path = require('path');

// Register User Controller

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, friends, location, occupation, description, gmail, github, linkedin, instagram } = req.body;
    const picturePath = req.file ? path.basename(req.file.path) : 'postman.png';
    // Bycrypt Password dimana salt yang merupakan huruf ajak akan di gabungkan dengan password yang ada
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Mengirim ke database
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 100),
      impressions: Math.floor(Math.random() * 100),
      description,
      gmail,
      github,
      instagram,
      linkedin,
    });
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// Login User Controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    // Cek adakah email yang sama di database
    if (!user) return res.status(400).json({ msg: "User Doesn't Exist." });

    // Cek kecocokan password dengan nilai password yang sudah di hask menggunakan genSalt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid Credential' });

    // Membuat token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    delete user.password;
    // Kalau semuanya oke maka kita kirim response
    res.status(200).json({ token, user });
  } catch (error) {
    res.status(500).json({ error });
  }
};

module.exports = { register, login };
