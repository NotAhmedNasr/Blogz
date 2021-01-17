const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const app = express();

app.use(express.json());

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).end('NOT FOUND');
});

app.use((err, req, res, next) => {
  if (err.message === 'Unauthenticated') {
    return res.status(401).end('Invalid username or password');
  } else if (err['_message'] === 'User validation failed') {
    return res.status(400).end('Incomplete Registeration Data');
  } else if (err.status === 400) {
    return res.status(400).end('Invalid body format');
  } else if (err.code === 11000) {
    return res.status(400).end('User already Exists');
  } else if (err.message === 'jwt must be provided') {
    return res.status(403).end('Unauthorized');
  } else if (err.message === 'jwt expired') {
    return res.status(408).end('Session expired');
  } else if (err.message === 'jwt malformed') {
    return res.status(403).end('Unauthorized');
  } else if (err.message === 'NotFound') {
    return res.status(404).end('Not Found');
  } else if (err.message === 'Unauthorized') {
    return res.status(403).end('Unauthorized');
  }
  res.status(400).json(err.message);
});

const {PORT = 3000} = process.env;

app.listen(PORT, () => {
  console.log(`Application is listening on http://localhost:${PORT}`);
});
