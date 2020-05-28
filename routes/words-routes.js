const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');
const getUsersCards = require('../controllers/words-controller/get-users-cards');
const addCard = require('../controllers/words-controller/add-card');
const deleteCard = require('../controllers/words-controller/delete-card');
const getCard = require('../controllers/words-controller/get-card');
const search = require('../controllers/words-controller/search');

const router = express.Router();

const validationRules = [
  check('name').notEmpty(),
  check('uuid').isUUID(),
  check('defs').isArray().notEmpty(),
];

router.get('/search/:query', search);

router.get('/card/:cardId', getCard);

router.use(checkAuth);

router.get('/', getUsersCards);

router.post('/addCard', validationRules, addCard);

router.delete('/:cardId', deleteCard);

module.exports = router;
