require('dotenv').config();

const Sentry = require('@sentry/node');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const { version } = require('./package.json');

const userRoutes = require('./routes/user-routes');
const wordsRoutes = require('./routes/words-routes');
const gamesRoutes = require('./routes/games-routes');
const HttpError = require('./models/http-error');

const app = express();

Sentry.init({
  release: `language-power-backend@${version}`,
  dsn: process.env.SENTRY_DSN,
});

app.use(Sentry.Handlers.requestHandler());

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.FE_ORIGIN);
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  next();
});

app.use('/api/user', userRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/games', gamesRoutes);

app.use(Sentry.Handlers.errorHandler());

app.use('/', (req, res, next) => {
  next(new HttpError('cannot find this route', 404));
});

app.use((error, req, res, next) => {
  res
    .status(error.code || 500)
    .json(error.message || 'an unknown error happend');
  next();
});

mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }
  )
  .then(() => {
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    // TODO send this to Sentry
    console.error(err);
  });
