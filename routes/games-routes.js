const express = require('express');
const {check} = require('express-validator');
const  {postScore, getGame, addGame, getAvailableGames} = require('../controllers/games-controller');

const router = express.Router();

router.patch('/score',  [check('userId').not().isEmpty(), 
check('gameResults').isArray(),
 check('gameId').notEmpty()], postScore);

 router.get('/catalog', getAvailableGames);

 router.post('/catalog', addGame);

 router.get('/:gameId', getGame);

module.exports = router;