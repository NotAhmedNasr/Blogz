const express = require('express');
const {create, login} = require('../controllers/user');

// eslint-disable-next-line new-cap
const router = express.Router();

// Creates new user
router.post('/', async (req, res, next) => {
  const {body} = req;
  try {
    const user = await create(body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  const {body} = req;
  try {
    const user = await login(body);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
