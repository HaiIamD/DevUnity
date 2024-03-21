const e = require('express');
const mongoose = require('mongoose');

const ConnectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Already Connect to Database`);
  } catch (error) {
    console.log(`${error} did not connect`);
  }
};

module.exports = ConnectDB;
