const score = require('./mocks/score.json');
const games = require('./mocks/games.json');

const data = games.map(game => {return {score, config:{gameId: game.name, ...game.config}}})
exports.data = data;
