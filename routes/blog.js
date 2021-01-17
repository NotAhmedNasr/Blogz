const express = require('express');
const formidable = require('formidable');
const path = require('path');

const {getAll, create, edit, deleteById, search} =
  require('../controllers/blog');
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
    res.status(200).send('Uploaded!!');
  });
});

// make new blog
router.post('/', async (req, res, next) => {
  const {body, userId} = req;
  body.author = userId;
  try {
    const blog = await create(body);
    res.status(201).json(blog);
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {body, userId} = req;
  try {
    const blog = await edit(body, blogId, userId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {userId} = req;
  try {
    const result = await deleteById(blogId, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

router.get('/search', async (req, res, next) => {
  const {query} = req;
  try {
    const results = await search(query);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
