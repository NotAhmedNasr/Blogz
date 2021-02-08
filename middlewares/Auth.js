const jwt = require('jsonwebtoken');
const {promisify} = require('util');

const {SECRET} = process.env;

const verifyAsync = promisify(jwt.verify);

const checkIfUserLoggedIn = async (req, res, next) => {
  const {token} = req.headers;
  try {
    const payload = await verifyAsync(token, SECRET);

    req.userId = payload.id;
    next();
  } catch (error) {
    next(error);
  }
};


module.exports = {
  checkIfUserLoggedIn,
};
