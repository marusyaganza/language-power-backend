const Game = require('../../models/game');
const HttpError = require('../../models/http-error');

async function getAvailableGames(req, res, next) {
  let games;
  try {
    games = await Game.find();
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('fetching games failed, please try again', 500));
  }
  if (!games) {
    return res.json({ message: 'no games available' });
  }
  res.json([...games.map((game) => game.toObject({ getters: true }))]);
}

module.exports = getAvailableGames;
