// Membuat authentication untuk user yang sudah login

const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    // Cek tokennya ada atau engga kalau ga ada berarti tidak boleh salainn yang sudah login
    if (!token) return res.status(403).send('Access Denied');
    //  Cek apakah token di mulai dengan Bearer
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trimLeft();
    }
    // Melakukan verified token dengan jwt
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(500).json({ msg: 'Erro Authenticaition' });
  }
};

module.exports = verifyToken;
