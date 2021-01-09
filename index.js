const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/blogs', {useNewUrlParser: true, useUnifiedTopology: true});

const app = express();


const {PORT = 3000} = process.env;

app.listen(PORT, () => {
  console.log(`Application is listening on http://localhost:${PORT}`);
});
