const Score = require('../../models/score');
const Game = require('../../models/game');
const HttpError = require('../../models/http-error');
const prepageGameData = require('./game-data-generator/generator');

async function getGame(req, res, next) {
  const { gameId } = req.params;

  const { userId } = req.userData;
  let score;

  try {
    score = await Score.find({ user: userId }).populate('card');
  } catch (err) {
    return next(
      new HttpError('fetching gamecards failed, please try again', 500)
    );
  }

  if (!score) {
    return next(
      new HttpError(`a user with id ${userId} can not be found`, 404)
    );
  }

  let gameConfig;

  try {
    gameConfig = await Game.findOne({ name: gameId });
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(
      new HttpError('fetching game config failed, please try again', 500)
    );
  }

  if (!gameConfig) {
    return next(
      new HttpError(`a game with id ${gameId} can not be found`, 404)
    );
  }

  const cardsForGame = score.filter((i) => i.score[gameId]);
  const { config } = gameConfig;
  const result = prepageGameData(cardsForGame, { ...config, gameId });

  res.json({ ...result });
}

module.exports = getGame;
