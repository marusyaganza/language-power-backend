const { validationResult } = require('express-validator');
const HttpError = require('../../models/http-error');
const WordCard = require('../../models/word-cards');

async function deleteCard(req, res, next) {
  const { cardId } = req.params;
  const errors = validationResult(req);

  // check if inputs are valid
  if (!errors.isEmpty()) {
    if (process.env.mode === 'dev') {
      console.error(errors.errors);
    }
    return next(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  }

  // check if this card exists
  let card;
  try {
    card = await WordCard.findById(cardId).populate('user').populate('score');
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    next(new HttpError('fetching card failed, please try again', 500));
  }

  if (!card) {
    return next(new HttpError(`could not find card with id ${cardId}`, 404));
  }

  const { userData } = req;
  if (card.user.id.toString() !== userData.userId) {
    return next(
      new HttpError(
        `card ${cardId} belongs another user you cannot delete it`,
        403
      )
    );
  }

  // save card
  try {
    const sess = await WordCard.startSession();
    sess.startTransaction();
    await card.remove({ session: sess });
    await card.user.wordCards.pull(card);
    await card.score.remove({ session: sess });
    await card.user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('deleting card failed, please try again', 500));
  }
  res.status(202).json({ message: 'card removed' });
}

module.exports = deleteCard;
