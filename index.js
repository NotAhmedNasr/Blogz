const express = require('express');
const mongoose = require('mongoose');

const routes = require('./routes');

mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();

app.use(express.json());

app.use('/', routes);

app.use((err, req, res, next) => {
  res.json(err);
});

const {PORT = 3000} = process.env;

app.listen(PORT, () => {
  console.log(`Application is listening on http://localhost:${PORT}`);
});
