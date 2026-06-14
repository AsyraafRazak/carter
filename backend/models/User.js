const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  username: { type: String, required: true, unique: true, trim: true },
  password: { type: String, select: false },
  googleId: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  is_active: { type: Boolean, default: true },
  points: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
