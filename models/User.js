const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  googleId: { type: String, unique: true, sparse: true }, // Ensure uniqueness but allow null
  name: String,
  email: { type: String, unique: true, required: true }, // Email is required for all users
  password: { type: String, default: null }, // Make password optional
  is_premium: { type: Boolean, default: false },
  premium_expired_at: { type: Date, default: null },
}, { timestamps: true }); // Automatically handles `createdAt` and `updatedAt`

module.exports = mongoose.model('User', UserSchema);
