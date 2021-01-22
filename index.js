const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');
const errorHandler = require('./middlewares/Error');

mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const app = express();

app.use(express.json());

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).end('NOT FOUND');
});

app.use(errorHandler);

const {PORT = 3000} = process.env;

app.listen(PORT, () => {
  console.log(`Application is listening on http://localhost:${PORT}`);
});
