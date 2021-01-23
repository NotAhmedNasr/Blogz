/* eslint-disable guard-for-in */
const express = require('express');
const formidable = require('formidable');
const path = require('path');

const {getAll, create, edit, deleteById, search, getFollowing, like} =
  require('../controllers/blog');
const {checkIfUserLoggedIn} = require('../middlewares/Auth');

// eslint-disable-next-line new-cap
const router = express.Router();

// get all blogs for all users
router.get('/', async (req, res, next) => {
  const {query: {page, count}} = req;
  try {
    const blogs = await getAll(page, count);
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

router.use(checkIfUserLoggedIn);

// search for blogs
router.get('/search', async (req, res, next) => {
  const {query} = req;
  try {
    const results = await search(query);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
});

// get all blogs for followed users
router.get('/following', async (req, res, next) => {
  const {userId, query: {page, count}} = req;
  try {
    const blogs = await getFollowing(userId, page, count);
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// get own blogs
router.get('/owned', async (req, res, next) => {
  const {userId, query: {page, count}} = req;
  try {
    const blogs = await getAll(page, count, {author: userId});
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});

// new blog with images
router.post('/', (req, res, next) => {
  const {userId} = req;

  const form = formidable({
    multiples: true, // more than one file
    uploadDir: path.join(__dirname, '../private/uploads/images'),
    keepExtensions: true,
  });

  // parsing the request body
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    fields.author = userId; // add author field
    try { // parsing tags
      fields.tags = JSON.parse(fields.tags);
    } catch (error) {
      next(error);
    }
    fields.photos = []; // add photos field

    for (const file in files) {
      fields.photos.push(files[file].toJSON().path); // adding images paths
    }

    try {
      const blog = await create(fields);
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  });
});

// edit a blog
router.patch('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {userId} = req;

  const form = formidable({
    multiples: true, // more than one file
    uploadDir: path.join(__dirname, '../private/uploads/images'),
    keepExtensions: true,
  });

  // parsing the request body
  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }

    fields.author = userId; // add author field
    fields.photos = []; // add photos field

    for (const file in files) {
      fields.photos.push(files[file].toJSON().path); // adding images paths
    }

    try {
      const blog = await edit(fields, blogId, userId);
      res.status(200).json(blog);
    } catch (error) {
      next(error);
    }
  });
});

// delete blog
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

// like a blog
router.patch('/like/:id', async (req, res, next) => {
  const {userId, params: {id: blogId}} = req;
  try {
    const blog = await like({$addToSet: {likers: userId}}, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

// unlike a blog
router.patch('/unlike/:id', async (req, res, next) => {
  const {userId, params: {id: blogId}} = req;
  try {
    const blog = await like({$pull: {likers: userId}}, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
