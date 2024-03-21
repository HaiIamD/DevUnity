const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Converstation = new Schema(
  {
    userIdChat: {
      type: Array,
    },
  },
  { timestamps: true }
);
const Conver = mongoose.model('Converstation', Converstation);
module.exports = Conver;
