const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    match: '/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)' +
      '|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])' +
      '|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/',
  },
  fullname: {
    type: String,
    maxlength: 50,
    minlength: 2,
  },
  dob: {
    type: Date,
  },
});

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
