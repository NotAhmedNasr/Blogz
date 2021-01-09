const mongoose = require('mongoose');
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    maxlength: 100,
  },
  password: {
    type: String,
    required: true,
  },
  email: { // Must match the email pattern
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    maxlength: 50,
    minlength: 2,
    index: true,
    required: true,
  },
  dob: { // Date of birth
    type: Date,
    required: true,
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
});

userSchema.pre('save', async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
