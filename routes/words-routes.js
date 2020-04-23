const express = require('express');
const {check} = require('express-validator');

const checkAuth = require('../middleware/check-auth');
const {getUsersCards, addCard, deleteCard, updateCard, getCard, search} = require('../controllers/words-controller');

const router = express.Router();

const validationRules = [
    check('name').notEmpty(), 
    check('uuid').isUUID(),
    check('defs').isArray().notEmpty()
];

router.get('/search/:query', search);

router.get('/card/:cardId', getCard);

router.use(checkAuth);

router.get('/', getUsersCards);

router.post('/addCard', validationRules , 
    addCard
    );

router.delete('/:cardId', deleteCard);

module.exports = router;