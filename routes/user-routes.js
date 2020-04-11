const express = require('express');
const {check} = require('express-validator');

const router = express.Router();

const {getUsers, login, signup} = require('../controllers/user-controller');

router.get('/', getUsers);

router.post(
    '/signup',
     [check('name').not().isEmpty(), 
     check('email').isEmail(),
      check('password').isLength({min: 6, max: 16})],
      signup
      );

router.post('/login', [check('email').isEmail()], login);

module.exports = router;