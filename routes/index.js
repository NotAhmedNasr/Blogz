const express = require('express');


const userRouter = require('./user');
const blogRouter = require('./blog');

// eslint-disable-next-line new-cap
const routes = express.Router();

routes.use('/users', userRouter);
routes.use('./blogs', blogRouter);

module.exports = routes;
