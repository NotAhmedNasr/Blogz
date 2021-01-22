const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const routes = require('./routes');
const errorHandler = require('./middlewares/Error');

mongoose.connect('mongodb+srv://ahmedalinasr:0128115293Ali@anasritidb.s6k5s.mongodb.net/blogsDB?retryWrites=true&w=majority',
    {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => console.log('Database Connected Successfully'))
    .catch((err) => console.log(err));

const app = express();

app.use(express.json());
app.use(cors());

app.use('/', routes);

app.use((req, res, next) => {
  res.status(404).end('NOT FOUND');
});

app.use(errorHandler);

const {PORT = 8000} = process.env;

app.listen(PORT, () => {
  console.log(`Application is listening on http://localhost:${PORT}`);
});
