const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');
const HttpError = require('../../models/http-error');

async function login(req, res, next) {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (process.env.mode === 'dev') {
      console.error(errors);
    }
    return next(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  }
  let user;
  try {
    user = await User.findOne({ email: email });
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError(`login user failed, please try later`, 500));
  }

  if (!user) {
    return next(
      new HttpError('could not identify user, credentials seems wrong', 401)
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('Login failed, please try again', 500));
  }

  if (!isValidPassword) {
    return next(
      new HttpError('could not identify user, credentials seems wrong', 401)
    );
  }

  let token;

  try {
    token = jwt.sign({ userId: user.id }, process.env.TOKEN_KEY, {
      expiresIn: '1y',
    });
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('Login failed, please try again', 500));
  }

  res.json({ userId: user.id, token });
}

module.exports = login;
