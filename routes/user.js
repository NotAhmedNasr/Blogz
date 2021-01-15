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

router.use(checkIfUserLoggedIn);

router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const user = await getUserById(id);
    if (!user) {
      throw new Error('User doesn\'t exist');
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.delete('/', async (req, res, next) => {
  const id = req.userId;
  try {
    const deletedUser = await deleteUserById(id);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const id = req.userId;
  const {body} = req;
  try {
    const updated = await updateData(id, body);
    res.json(updated);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
