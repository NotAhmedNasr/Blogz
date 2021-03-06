/* eslint-disable guard-for-in */
const express = require('express');

const {getAll, create, edit, deleteById, search, getFollowing,
  like, unlike, comment, uncomment} =
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
router.post('/', async (req, res, next) => {
  const {userId, body} = req;
  body.author = userId;
  try {
    const blog = await create(body);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

// edit a blog
router.patch('/:id', async (req, res, next) => {
  const {id: blogId} = req.params;
  const {userId, body} = req;

  try {
    const blog = await edit(body, blogId, userId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
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
    const blog = await like(userId, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

// unlike a blog
router.patch('/unlike/:id', async (req, res, next) => {
  const {userId, params: {id: blogId}} = req;
  try {
    const blog = await unlike(userId, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

router.patch('/comment/:id', async (req, res, next) => {
  const {userId, params: {id: blogId}} = req;
  const {body} = req;
  try {
    const blog = await comment({...body, commenter: userId}, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

router.patch('/uncomment/:id', async (req, res, next) => {
  const {params: {id: blogId}} = req;
  const {commentId} = req.body;

  try {
    const blog = await uncomment(commentId, blogId);
    res.status(200).json(blog);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
