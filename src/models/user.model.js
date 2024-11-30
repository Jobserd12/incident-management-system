import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  role: {
    type: String,
    enum: ['user', 'support', 'admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  emailVerification: {
    token: String,
    expiresAt: Date,
    resendCount: { type: Number, default: 0 },
    lastResend: Date
  },
  emailChange: {
    newEmail: String,
    token: String,
    expiresAt: Date,
    count: { type: Number, default: 0 },
    lastChange: Date,
    lastReset: Date
  },
  passwordReset: {
    token: String,
    expiresAt: Date,
    resendCount: { type: Number, default: 0 },
    lastResend: Date
  },
  passwordChanges: {
    count: { type: Number, default: 0 },
    lastChange: Date,
    lastReset: Date
  }
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isTokenExpired = function(tokenType) {
  const tokenData = this[tokenType];
  return !tokenData?.expiresAt || tokenData.expiresAt < new Date();
};

UserSchema.methods.clearToken = function(tokenType) {
  this[tokenType] = undefined;
  return this.save();
};

UserSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.canChangePassword = function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  if (this.passwordChanges?.lastReset < oneDayAgo) {
    this.passwordChanges = {
      count: 0,
      lastChange: null,
      lastReset: new Date()
    };
    return true;
  }

  return this.passwordChanges?.count < 3;
};

UserSchema.methods.canChangeEmail = function() {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  
  if (this.emailChange?.lastReset < oneDayAgo) {
    this.emailChange = {
      ...this.emailChange,
      count: 0,
      lastChange: null,
      lastReset: new Date()
    };
    return true;
  }

  return this.emailChange?.count < 3;
};

const User = mongoose.model('User', UserSchema);
export default User; 

