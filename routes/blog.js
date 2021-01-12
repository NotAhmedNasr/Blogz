const express = require('express');
const {getAll} = require('../controllers/blog');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const blogs = await getAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
