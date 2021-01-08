const express = require('express');
const { check } = require('express-validator');

const checkAuth = require('../middleware/check-auth');
const getUsersCards = require('../controllers/words-controller/get-users-cards');
const addCard = require('../controllers/words-controller/add-card');
const updateCard = require('../controllers/words-controller/update-card');
const deleteCard = require('../controllers/words-controller/delete-card');
const getCard = require('../controllers/words-controller/get-card');
const search = require('../controllers/words-controller/search');
const mockSearch = require('../controllers/words-controller/mock-search');

const router = express.Router();

const validationRules = [
  check('name').notEmpty(),
  check('uuid').isUUID(),
  check('defs').isArray().notEmpty(),
];

router.get('/search/:query', search);

router.get('/mocksearch/:query', mockSearch);

router.get('/card/:cardId', getCard);

router.use(checkAuth);

router.get('/', getUsersCards);

router.post('/addCard', validationRules, addCard);

router.patch('/edit/:cardId', updateCard);

router.delete('/:cardId', deleteCard);

module.exports = router;
