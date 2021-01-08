const { validationResult } = require('express-validator');
const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');
const User = require('../../models/user');
const Score = require('../../models/score');
const { generateGameData } = require('../helpers');

async function updateCard(req, res, next) {
  const { userId } = req.userData;
  const { cardId } = req.params;
  const changes = req.body;

  let existingCard;
  try {
    existingCard = await WordCard.findById(cardId).populate('user').populate('score');
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    next(new HttpError('fetching card failed, please try again', 500));
  }
  if (!existingCard) {
    return next(
      new HttpError(`card is not found`),
      404
    );
  }

  const { userData } = req;
  if (existingCard.user.id.toString() !== userData.userId) {
    return next(
      new HttpError(
        `card ${cardId} belongs another user you cannot change it`,
        403
      )
    );
  }

const entries = Object.entries(changes);

entries.forEach(([key, value]) => {
    existingCard[key] = value;
});

  const gameData = generateGameData(changes.defs.length);

  const score = new Score({ user: userId, score: gameData, card: null });

  try {
    const sess = await WordCard.startSession();
    sess.startTransaction();
    await existingCard.score.remove({ session: sess });
    existingCard.score = score;
    await existingCard.save({ session: sess });
    await existingCard.user.wordCards.pull(existingCard);
    await existingCard.user.wordCards.push(existingCard);
    await existingCard.user.save({ session: sess });
    score.card = existingCard;
    await score.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('creating card failed, please try again', 500));
  }
  res.status(201).json({ message: 'changes saved' });
}

module.exports = updateCard;
