const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user-routes');
const wordsRoutes = require('./routes/words-routes');
const gamesRoutes = require('./routes/games-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', process.env.FE_ORIGIN);
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
    next();
})


app.use('/api/user', userRoutes);
app.use('/api/words', wordsRoutes);
app.use('/api/games', gamesRoutes);

app.use('/', (req, res, next) => {
    next(new HttpError('cannot find this route', 404));
})

app.use((error,req, res, next) => {
    res.status(error.code || 500).json(error.message || 'an unknown error happend');
    next();
});

mongoose.
connect(`${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then(() => {
    app.listen(process.env.PORT);
})
.catch((err) => {
    console.error(err);
});
