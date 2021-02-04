const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {promisify} = require('util');
const jwt = require('jsonwebtoken');

const asyncSign = promisify(jwt.sign);

// jwt secret
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
  }, SECRET.secret, {expiresIn: '1d'});
  return {...user.toJSON(), token};
};

const login = async function({username, password}) {
  const user = await User.findOne({username}).exec();
  if (!user) {
    throw new Error('Unauthenticated');
  }
  const validPassword = await user.validatePassword(password);
  if (!validPassword) {
    throw new Error('Unauthenticated');
  }
  return await signUserWithJwt(user);
};

const getUserById = async function(id) {
  return await User.findById(id).exec();
};

const getAll = async function() {
  return await User.find().exec();
};

const deleteUserById = async function(id) {
  return await User.findByIdAndDelete(id).exec();
};

const updateData = async function(id, data) {
  return await User.findByIdAndUpdate(id, data);
};

const follow = async function(followerId, followedId) {
  try {
    debugger;
    const followerRes = await User.findByIdAndUpdate(
        followerId, {$addToSet: {following: followedId}},
        {new: true},
    ).exec();
    const followedRes = await User.findByIdAndUpdate(
        followedId, {$addToSet: {followers: followerId}},
        {new: true},
    ).exec();
    return {followerRes, followedRes};
  } catch (error) {
    throw error;
  }
};

const unfollow = async function(followerId, followedId) {
  try {
    debugger;
    const followerRes = await User.findByIdAndUpdate(
        followerId, {$pull: {following: followedId}},
        {new: true},
    ).exec();
    const followedRes = await User.findByIdAndUpdate(
        followedId, {$pull: {followers: followerId}},
        {new: true},
    ).exec();
    return {followerRes, followedRes};
  } catch (error) {
    throw error;
  }
};

module.exports = {
  create,
  login,
  getUserById,
  deleteUserById,
  updateData,
  follow,
  unfollow,
  getAll,
};
