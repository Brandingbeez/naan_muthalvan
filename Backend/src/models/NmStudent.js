const mongoose = require('mongoose');

const nmStudentSchema = new mongoose.Schema({
  nmUserId: { type: String, required: true, unique: true },
  email: { type: String },
  name: { type: String },
  phone: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('NmStudent', nmStudentSchema);