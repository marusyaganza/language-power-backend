const express = require('express');
const { check } = require('express-validator');
const checkAuth = require('../middleware/check-auth');

const getAvailableGames = require('../controllers/games-controller/get-available-gemes');
const postScore = require('../controllers/games-controller/post-score');
const addGame = require('../controllers/games-controller/add-game');
const getGame = require('../controllers/games-controller/get-game');

const router = express.Router();

router.get('/catalog', getAvailableGames);

router.post('/catalog', addGame);

router.use(checkAuth);

router.get('/:gameId', getGame);

router.patch(
  '/score',
  [
    check('userId').not().isEmpty(),
    check('gameResults').isArray(),
    check('gameId').notEmpty(),
  ],
  postScore
);

module.exports = router;
