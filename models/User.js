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
    unique: true,
  },
  fullname: {
    type: String,
    maxlength: 50,
    minlength: 2,
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
}, { // schema options
  toJSON: {
    transform: function(doc, ret, options) {
      delete ret.password;
      delete ret._id;
      return ret;
    },
  },
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
});

userSchema.methods.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function(next) {
  try {
    this.password = await bcrypt.hash(this.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.pre('findOneAndUpdate', async function(next) {
  try {
    this._update.password = await bcrypt.hash(this._update.password, 10);
    return next();
  } catch (error) {
    return next(error);
  }
});

userSchema.index({'fullname': 'text'});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
