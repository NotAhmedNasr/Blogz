const express = require('express');
const {create, login, getUserById, deleteUserById, updateData} =
  require('../controllers/user');
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

router.use(checkIfUserLoggedIn);

// get user by id
router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new Error('User doesn\'t exist');
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const id = req.userId;
  try {
    const deletedUser = await deleteUserById(id);
    res.status(200).json(deletedUser);
  } catch (error) {
    next(error);
  }
});

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

module.exports = router;
