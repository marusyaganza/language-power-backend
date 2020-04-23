const express = require('express');
const {check} = require('express-validator');
const checkAuth = require('../middleware/check-auth');
const  {postScore, getGame, addGame, getAvailableGames} = require('../controllers/games-controller');

const router = express.Router();

router.get('/catalog', getAvailableGames);

router.use(checkAuth);

router.post('/catalog', addGame);

router.get('/:gameId', getGame);

router.patch('/score',  [check('userId').not().isEmpty(), 
check('gameResults').isArray(),
 check('gameId').notEmpty()], postScore);

module.exports = router;