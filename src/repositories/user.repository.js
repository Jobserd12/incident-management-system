import User from "../models/user.model.js";

export class UserRepository {
  async findByEmail(email) {
    return User.findOne({ email });
  }

  async findByUsername(username) {
    return User.findOne({ username });
  }

  async findById(id) {
    return User.findById(id).select('-password');
  }

  async findByEmailWithPassword(email) {
    return User.findOne({ email }).select('+password');
  }

  async findByIdWithPassword(id) {
    return User.findById(id).select('+password');
  }
  
  async create(userData) {
    return User.create(userData);
  }
  

  // ==========================================
  // Métodos para verificación de email
  // ==========================================
  
  async findByVerificationToken(token) {
    return User.findOne({
      'emailVerification.token': token,
      'emailVerification.expiresAt': { $gt: new Date() },
      isVerified: false
    });
  }

  async checkAndResetLimit(email) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    return User.findOneAndUpdate(
      { 
        email,
        'emailVerification.resendCount': { $gte: 3 },
        'emailVerification.lastResend': { $lt: oneDayAgo }
      },
      {
        $set: {
          'emailVerification.resendCount': 0,
          'emailVerification.lastResend': null
        }
      },
      { new: true }
    );
  }

  async checkResendCooldown(email) {
    return User.findOne({ 
      email,
      isVerified: false,
      $or: [
        { 'emailVerification.lastResend': { $exists: false } },
        { 'emailVerification.lastResend': { 
          $lt: new Date(Date.now() - 15 * 60 * 1000) 
        }}
      ]
    });
  }

  async updateVerificationToken(user, token) {
    const currentCount = user.emailVerification?.resendCount || 0;
    
    user.emailVerification = {
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), 
      resendCount: currentCount + 1,
      lastResend: new Date()
    };
    return user.save();
  }

  async checkResendLimit(email) {
    await this.checkAndResetLimit(email);
    return User.findOne({ 
      email,
      isVerified: false,
      $or: [
        { 'emailVerification.resendCount': { $exists: false } },
        { 'emailVerification.resendCount': { $lt: 3 } }
      ]
    });
  }

  // ==========================================
  // Métodos para reset de contraseña
  // ==========================================
  
  async checkAndResetPasswordLimit(email) {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    
    const reset = await User.findOneAndUpdate(
      { 
        email,
        'passwordReset.resendCount': { $gte: 3 },
        'passwordReset.lastResend': { $lt: oneDayAgo }
      },
      {
        $set: {
          'passwordReset.resendCount': 0,
          'passwordReset.lastResend': null
        }
      },
      { new: true }
    );

    return reset;
  }

  async checkPasswordResetLimit(email) {
    await this.checkAndResetPasswordLimit(email);

    return User.findOne({ 
      email,
      $or: [
        { 'passwordReset.resendCount': { $exists: false } },
        { 'passwordReset.resendCount': { $lt: 3 } }
      ]
    });
  }

  async checkPasswordResetCooldown(email) {
    return User.findOne({ 
      email,
      $or: [
        { 'passwordReset.lastResend': { $exists: false } },
        { 'passwordReset.lastResend': { 
          $lt: new Date(Date.now() - 15 * 60 * 1000) 
        }}
      ]
    });
  }

  async updatePasswordResetToken(user, token) {
    const currentCount = user.passwordReset?.resendCount || 0;
    
    user.passwordReset = {
      token,
      expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000),
      resendCount: currentCount + 1,
      lastResend: new Date()
    };
    return user.save();
  }

  async findByPasswordResetToken(token) {
    return User.findOne({
      'passwordReset.token': token,
      'passwordReset.expiresAt': { $gt: new Date() }
    });
  }

  // ==========================================
  // Métodos para cambio de contraseña
  // ==========================================


  async checkPasswordChangeCooldown(userId) {
    return User.findOne({
      _id: userId,
      $or: [
        { 'passwordChanges.lastChange': { $exists: false } },
        { 'passwordChanges.lastChange': { 
          $lt: new Date(Date.now() - 15 * 60 * 1000) 
        }}
      ]
    });
  }

  async updatePasswordChange(user, newPassword) {
    user.password = newPassword;
    user.passwordChanges = {
      count: (user.passwordChanges?.count || 0) + 1,
      lastChange: new Date(),
      lastReset: user.passwordChanges?.lastReset
    };
    return user.save();
  }

  // ==========================================
  // Métodos para cambio de email
  // ==========================================

  async updateEmailChangeToken(user, newEmail, token) {
    user.emailChange = {
      newEmail,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      count: (user.emailChange?.count || 0) + 1,
      lastChange: new Date(),
      lastReset: user.emailChange?.lastReset || new Date()
    };
    
    return user.save();
  }

  async findByEmailChangeToken(token) {
    return User.findOne({
      'emailChange.token': token,
      'emailChange.expiresAt': { $gt: new Date() }
    });
  }


  async checkEmailChangeCooldown(userId) {
    return User.findOne({ 
      _id: userId,
      $or: [
        { 'emailChange.lastChange': { $exists: false } },
        { 'emailChange.lastChange': { 
          $lt: new Date(Date.now() - 0.1 * 60 * 1000) 
        }}
      ]
    });
  }

  async updateProfile(userId, updateData) {
    return User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('username email role department isVerified createdAt updatedAt');
  }

  async getProfile(userId) {
    return User.findById(userId)
      .select('username email role department isVerified createdAt updatedAt')
      .lean();
  }
}

export default new UserRepository(); 