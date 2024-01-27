// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  healthcareType: { type: String, required: true },
  organizationName: { type: String, required: true },
  notifications: [{ type: mongoose.Schema.Types.Mixed }]
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
