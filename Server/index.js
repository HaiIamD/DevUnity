// Semua Depedency yang di gunakan
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const helmet = require('helmet');
const morgan = require('morgan');
const ConnectDB = require('./connectDB');
const { register } = require('./controllers/auth.js');
const { createPost } = require('./controllers/posts.js');
const { updateUser } = require('./controllers/users.js');
const { postChat } = require('./controllers/message.js');
const uuid = require('uuid').v4;
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});
const PORT = process.env.PORT || 6001;

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);

app.use(express.json());
app.use(helmet());

app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

app.use(morgan('common'));

app.use(bodyParser.json({ limit: '30mb', extended: true }));

app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use('/assets', express.static('public/assets'));

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) && users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

// Socket.io configuration
io.on('connection', (socket) => {
  console.log('User Connect...');
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    console.log('=====================================================================');
    console.log(users);
    io.emit('getUsers', users);
  });

  socket.on('sendMessage', ({ senderId, receiverId, text, pictureChat }) => {
    console.log('===================================+++================================');
    console.log(users);
    console.log({ senderId, receiverId, text, pictureChat });

    const user = getUser(receiverId);

    // Pengecekan apakah user dengan receiverId ditemukan
    if (user) {
      // Pengecekan apakah user memiliki socketId (online)
      if (user.socketId) {
        io.to(user.socketId).emit('getMessage', {
          senderId,
          text,
          pictureChat,
        });
        console.log('Pesan berhasil dikirim.');
      }
    } else {
      console.log('User offline. Menyimpan pesan dalam antrian atau database.');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconect...');
    removeUser(socket.id);
    console.log(socket.id);
    io.emit('getUsers', users);
  });
});

// Mengarah ke file route
const authRoutes = require('./routes/auth.js');
const userRoutes = require('./routes/user.js');
const postRoutes = require('./routes/posts.js');
const messageRoutes = require('./routes/message.js');
const verifyToken = require('./middleware/auth.js');

// Storange menggunakan multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, `${uuid()} - ${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// koneksi Ke MongoDB
ConnectDB();

// Routes with FILE
app.post('/auth/register', upload.single('picturePath'), register);
app.post('/posts', verifyToken, upload.single('picturePath'), createPost);
app.patch('/users/updateUser', verifyToken, upload.single('picturePath'), updateUser);
app.post('/message/chat', verifyToken, upload.single('pictureChat'), postChat);

// Routes tanpa file karena tidak membutuhkan gambar (upload middleware)
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/posts', postRoutes);
app.use('/message', messageRoutes);

server.listen(PORT, () => {
  console.log(`Connect to Port ${PORT}`);
});
