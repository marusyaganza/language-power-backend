const { validationResult } = require('express-validator');
const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');
const User = require('../../models/user');
const Score = require('../../models/score');
const { generateGameData } = require('../helpers');

async function addCard(req, res, next) {
  const { userId } = req.userData;
  const card = req.body;

  // check if inputs are valid
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (process.env.mode === 'dev') {
      console.error(errors.errors);
    }
    return next(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  }

  // check if this card exists
  let existingCard;
  try {
    existingCard = await WordCard.findOne({ uuid: card.uuid, user: userId });
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    next(new HttpError('fetching card failed, please try again', 500));
  }
  if (existingCard) {
    return next(
      new HttpError(`card with name ${card.name} has been already added`),
      422
    );
  }

  // fetch user
  let user;
  try {
    user = await User.findById(userId);
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    next(new HttpError('fetching user failed, please try again', 500));
  }

  if (!user) {
    return next(new HttpError(`could not find user with id ${userId}`, 404));
  }

  const gameData = generateGameData(card.defs.length);

  // save card
  const createdCard = new WordCard({ ...card, user: userId });
  const score = new Score({ user: userId, score: gameData, card: null });
  try {
    const sess = await WordCard.startSession();
    sess.startTransaction();
    createdCard.score = score;
    await createdCard.save({ session: sess });
    user.wordCards.push(createdCard);
    await user.save({ session: sess });
    score.card = createdCard;
    await score.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('creating card failed, please try again', 500));
  }
  res.status(201).json({ messsage: 'card created' });
}

module.exports = addCard;
