const express = require('express');
const formidable = require('formidable');
const path = require('path');

const {getAll, create, edit, deleteById} = require('../controllers/blog');
const {checkIfUserLoggedIn} = require('../middlewares/Auth');

// eslint-disable-next-line new-cap
const router = express.Router();

// get all blogs for all users
router.get('/', async (req, res, next) => {
  try {
    const blogs = await getAll();
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.use(checkIfUserLoggedIn);

// for uploading photos
router.post('/upload', (req, res, next) => {
  const form = formidable({multiples: true});
  form.uploadDir = path.join(__dirname, '../private/uploads/images');
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    res.send('Uploaded!!');
  });
});

router.post('/', async (req, res, next) => {
  const {body, userId} = req;
  body.author = userId;
  try {
    const blog = await create(body);
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {body, userId} = req;
  try {
    const blog = await edit(body, blogId, userId);
    res.json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {userId} = req;
  try {
    const result = await deleteById(blogId, userId);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
