const Game = require('../../../models/game');
const Score = require('../../../models/score');
const HttpError = require('../../../models/http-error');
const getGame = require('../get-game');

jest.mock('../../../models/game');
jest.mock('../../../models/score');

const next = jest.fn();
const json = jest.fn();
const req = {
  params: { gameId: 'gameId' },
  userData: { userId: 'id0' },
};

describe('get-game', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });
  it('should handle score fetching error', async () => {
    Score.find.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await getGame(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching gamecards failed, please try again', 500)
    );
  });
  it('should handle score absence', async () => {
    Score.find.mockImplementation(() => ({ populate: () => null }));
    await getGame(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError(`a user with id id0 can not be found`, 404)
    );
  });
  it('should handle gameConfig fetching error', async () => {
    Score.find.mockImplementation(() => ({ populate: () => [] }));
    Game.findOne.mockImplementation(() => {
      throw new Error('dummy error');
    });
    await getGame(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('fetching game config failed, please try again', 500)
    );
  });
  it('should handle game config absence', async () => {
    Score.find.mockImplementation(() => ({ populate: () => [] }));
    Game.findOne.mockResolvedValue(null);
    await getGame(req, { json }, next);
    expect(next).toHaveBeenCalledWith(
      new HttpError('a game with id gameId can not be found', 404)
    );
  });
  it('should return game', async () => {
    Game.findOne.mockResolvedValue({ config: {} });
    Score.find.mockImplementation(() => ({
      populate: () => [
        { score: { gameId: [] } },
        { score: { gameId2: [] } },
        { score: { gameId: [] } },
      ],
    }));
    await getGame(req, { json }, next);
    expect(json).toHaveBeenCalledWith({
      gameId: 'gameId',
      learntCards: [],
      qa: [],
    });
  });
});
