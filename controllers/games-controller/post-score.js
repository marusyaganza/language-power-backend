const { validationResult } = require('express-validator');
const Score = require('../../models/score');
const HttpError = require('../../models/http-error');

async function postScore(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (process.env.mode === 'dev') {
      console.error(errors.errors);
    }
    return next(
      new HttpError('invalid inputs passed, please check your data', 422)
    );
  }
  const { gameResults, gameId } = req.body;

  for (const item of gameResults) {
    let score;
    const { id, index, result } = item;
    try {
      score = await Score.findById(id);
    } catch (err) {
      return next(
        new HttpError(
          `fetching score for card ${item.cardId} failed, please try again`,
          500
        )
      );
    }
    if (!score) {
      return next(new HttpError(`score ${id} is not found`, 404));
    }
    const { userData } = req;
    if (score.user.toString() !== userData.userId) {
      return next(new HttpError('Auth is required for this operation', 403));
    }
    const currentScore = [...score.score[gameId]];
    const value = currentScore[index] + result;
    currentScore.splice(index, 1, value);
    const newScore = { ...score.score, [gameId]: currentScore };
    score.score = { ...newScore };
    score.lastTimePlayed = Date.now();
    try {
      await score.save();
    } catch (err) {
      if (process.env.mode === 'dev') {
        console.error(err);
      }
      return next(
        new HttpError('updating score failed, please try again', 500)
      );
    }
  }
  res.status(201).json({ message: 'games results saved' });
}

module.exports = postScore;
