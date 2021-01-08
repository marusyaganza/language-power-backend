const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');
const Score = require('../../models/score');
const { generateGameData } = require('../helpers');

const MUTABLE_PROPERTIES = ['defs', 'examples'];

async function updateCard(req, res, next) {
  const { userId } = req.userData;
  const { cardId } = req.params;
  const changes = req.body;

  if(changes.defs && !changes.defs.length) {
    return next(new HttpError('invalid input: defs array can\'t be empty', 422));
  }

  let existingCard;
  try {
    existingCard = await WordCard.findById(cardId).populate('user').populate('score');
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('fetching card failed, please try again', 500));
  }
  if (!existingCard) {
    return next(
      new HttpError(`card is not found`, 404))
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

entries
.forEach(([key, value]) => {
    if (MUTABLE_PROPERTIES.includes(key)) {
      existingCard[key] = value;
    }
});

if (!changes.defs) {
  try {
    await existingCard.save();
  }
  catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('updating card failed, please try again', 500));
  }
  return res.status(201).json({ message: 'changes saved' });
}

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
    return next(new HttpError('updating card failed, please try again', 500));
  }
  res.status(201).json({ message: 'changes saved' });
}

module.exports = updateCard;
