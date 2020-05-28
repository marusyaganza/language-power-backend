const Game = require('../../models/game');
const HttpError = require('../../models/http-error');

async function addGame(req, res, next) {
  const { game } = req.body;
  const createdGame = new Game({ ...game });
  try {
    createdGame.save();
  } catch (err) {
    if (process.env.mode === 'dev') {
      console.error(err);
    }
    return next(new HttpError('creating game failed, please try again', 500));
  }
  res.json({ game: createdGame.toObject({ getters: true }) });
}

module.exports = addGame;
