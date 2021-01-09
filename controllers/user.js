const User = require('../models/User');

const create = async function(user) {
  return await User.create(user);
};

const login = async function({username, password}) {
  const user = await User.find({username: username}).exec();
  if (!user) {
    throw new Error('UNAUTHENTICATED USER');
  }
  try {
    const valid = await user.validatePassword(password);
  } catch (error) {
    throw new Error('UNAUTHENTICATED USER');
  }
};

module.exports = {
  create,
  login,
};
