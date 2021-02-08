const jwt = require('jsonwebtoken');
// const fs = require('fs');
// const path = require('path');
const {promisify} = require('util');

const {SECRET} = process.env;
// const SECRET = JSON.parse(fs.readFileSync(
//     path.join(__dirname, '..', 'private', 'secrets', 'secret.json'),
//     {encoding: 'utf8'},
// )).secret;

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
