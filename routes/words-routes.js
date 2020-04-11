const express = require('express');
const {check} = require('express-validator');

const {getUsersCards, addCard, deleteCard, updateCard, getCard, search} = require('../controllers/words-controller');

const router = express.Router();

const validationRules = [
    check('name').notEmpty(), 
    check('uuid').isUUID(),
    check('defs').isArray().notEmpty()
];

router.get('/:userId', getUsersCards);
router.get('/card/:cardId', getCard);
router.get('/search/:query', search)

router.post('/:userId', validationRules , 
    addCard
    );

router.delete('/:cardId', deleteCard);

router.patch('/:cardId', [check('gameData').notEmpty()], updateCard);

module.exports = router;