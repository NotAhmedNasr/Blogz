const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const asyncSign = promisify(jwt.sign);

const SECRET = JSON.parse(fs.readFileSync(
    path.join(__dirname, '..', 'private', 'secrets', 'secret.json'),
    {encoding: 'utf8'},
));

const create = async function(newUser) {
  const user = await User.create(newUser);
  return await signUserWithJwt(user);
};

const signUserWithJwt = async function(user) {
  const token = await asyncSign({
    id: user.id,
  }, SECRET.secret, {expiresIn: '1h'});
  return {...user.toJSON(), token};
};

const login = async function({username, password}) {
  const user = await User.findOne({username}).exec();
  if (!user) {
    throw new Error('Unauthenticated');
  }
  debugger;
  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    throw new Error('Unauthenticated');
  }
  return await signUserWithJwt(user);
};

const getUserById = async function(id) {
  return await User.findById(id).exec();
};

const deleteUserById = async function(id) {
  return await User.findByIdAndDelete(id).exec();
};

const updateData = async function(id, data) {
  return await User.findByIdAndUpdate(id, data);
};

module.exports = {
  create,
  login,
  getUserById,
  deleteUserById,
  updateData,
};
