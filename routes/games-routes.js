const express = require('express');
const {check} = require('express-validator');
const  {postScore, getGame} = require('../controllers/games-controller');

const router = express.Router();

router.post('/score',  [check('userId').not().isEmpty(), 
check('gameResults').isArray(),
 check('gameId').notEmpty()], postScore);

 router.get('/:gameId', getGame);

module.exports = router;