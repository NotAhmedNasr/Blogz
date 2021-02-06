const express = require('express');

const {
  create, login, getUserById, deleteUserById, updateData, follow, unfollow,
  getAll, getUserByusername,
} = require('../controllers/user');
const {checkIfUserLoggedIn} = require('../middlewares/Auth');


// eslint-disable-next-line new-cap
const router = express.Router();

// Creates new user
router.post('/', async (req, res, next) => {
  const {body} = req;
  try {
    const user = await create(body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  const {body} = req;
  try {
    const user = await login(body);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const users = await getAll();
    if (!users) {
      throw new Error('NotFound');
    }
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
});

router.use(checkIfUserLoggedIn);

// get user by username

router.get('/byname/:username?', async (req, res, next) => {
  const {username} = req.params;
  try {
    const user = await getUserByusername(username);
    if (!user) {
      throw new Error('NotFound');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// get user by id
router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new Error('NotFound');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

// delete user
router.delete('/', async (req, res, next) => {
  const id = req.userId;
  try {
    const deletedUser = await deleteUserById(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

// edit user
router.patch('/', async (req, res, next) => {
  const id = req.userId;
  const {body} = req;
  try {
    const updated = await updateData(id, body);
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
});

// follow
router.patch('/follow/:id', async (req, res, next) => {
  const {id: followed} = req.params;
  const {userId} = req;
  if (followed != userId) {
    try {
      const result = await follow(userId, followed);
      res.json(result);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(200).send({});
  }
});

// unfollow
router.patch('/unfollow/:id', async (req, res, next) => {
  const {id: followed} = req.params;
  const {userId} = req;
  try {
    const result = await unfollow(userId, followed);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
