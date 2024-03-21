const Post = require('../models/Post.js');
const User = require('../models/User.js');
const path = require('path');

// Create

const createPost = async (req, res) => {
  try {
    const { userId, description } = req.body;
    const picturePath = req.file ? path.basename(req.file.path) : '';
    // Mengambil data dari user
    const user = await User.findById(userId);
    // Membuat litle schema yang akan di post ke database
    const newPost = new Post({
      userId,
      firstName: user.firstName,
      lastName: user.lastName,
      location: user.location,
      description,
      userPicturePath: user.picturePath,
      picturePath,
      likes: {},
      comments: [],
    });
    // save newPost ke database
    await newPost.save();
    // Menangkap semua data dari datbaase Post
    const post = await Post.find();
    res.status(200).json(post);
  } catch (error) {
    res.status(409).json({ massage: error.massage });
  }
};

// Delete Post

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByIdAndDelete(id);

    const newPost = await Post.find();
    res.status(200).json(newPost);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

// Read

// Menampilkan semua data pada halaman dashboard / berfungsi untuk searchBar
const getFeedPosts = async (req, res) => {
  try {
    const { description } = req.query;
    let query = {};

    if (description) {
      query.description = { $regex: `${description}`, $options: 'i' };
    }
    console.log(query);

    const posts = await Post.find(query);

    res.status(200).json(posts);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

const getUserPosts = async (req, res) => {
  try {
    const { userId } = req.params;
    const post = await Post.find({ userId });
    res.status(200).json(post);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};

// Update Likes
const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const post = await Post.findById(id);

    // Melakukan check apakah userID sudah ada di likes dari database Post atau belum
    const isliked = post.likes.get(userId);

    // disini logikanya saat udah like jika di pencet lagi maka akan menghapus like
    if (isliked) {
      post.likes.delete(userId);
    } else {
      // Jika belum maka akan menambahkan userId ke dalam daftar likes di database Post
      post.likes.set(userId, true);
    }

    // Mengembailkan semua data satu post agar dapat di ganti di depan, ( note : ini yang di balikkan data baru )

    const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(404).json({ massage: error.massage });
  }
};
const commentPost = async (req, res) => {
  try {
    const { id, comment } = req.body;
    const updatedComments = await Post.findByIdAndUpdate(id, { $push: { comments: comment } }, { new: true });
    if (!updatedComments) {
      // Jika ID tidak ditemukan, kembalikan respons dengan status 404
      return res.status(404).json("{ message: 'Post not found' }");
    }
    res.status(200).json(updatedComments);
  } catch (error) {
    res.status(404).json('{ massage: error.massage }');
  }
};

module.exports = { deletePost, commentPost, createPost, getFeedPosts, getUserPosts, likePost };
